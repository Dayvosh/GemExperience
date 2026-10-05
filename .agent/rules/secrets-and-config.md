---
trigger: glob
description: Use for environment variables, external API keys (Paystack, Gemini, Cloudinary, Termii, database), or new packages. Confirms variable names, server-side-only secrets, native-binding risk
globs: **/{.env*,env.ts,config.ts,lib/env*,next.config.*}
---

# secrets-and-config.md

**Job:** Name every environment variable this project needs and which service it belongs to. Never store an actual secret value here.

## Rules

1. `DATABASE_URL` holds the pooled Postgres connection string, not a direct connection string. Reason: this project runs on serverless functions with no persistent process. A direct connection exhausts the free-tier database's connection limit under normal traffic, not just at scale.

2. `DIRECT_URL` holds a direct, unpooled Postgres connection string, separate from `DATABASE_URL`. Reason: Prisma migrations generally cannot run reliably through a connection pooler. The app uses the pooled connection at runtime; migrations need the direct one.

3. `PAYSTACK_SECRET_KEY` holds the Paystack secret key, used only in server-side code. Reason: this key can authorize real refunds and payment actions. It must never reach the browser.

4. `PAYSTACK_PUBLIC_KEY` holds the Paystack public key, used only in client-side checkout code. Reason: this key is safe to expose, but it belongs in a clearly separate variable from the secret key so the two are never confused or swapped by mistake.

5. `GEMINI_API_KEY` holds the Gemini API key, used for the three AI features. Reason: without a named variable, the agent has no fixed place to read this key from, and will either invent a name or hardcode the key directly into a file.

6. `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` hold the three separate Cloudinary credentials. Reason: Cloudinary issues these as three distinct values, not one combined string. Treating them as one variable will break the upload flow.

7. `TERMII_API_KEY` holds the Termii key used to send OTP messages. Reason: this is the only credential tied to real spending, since Termii's free tier is trial credit, not unlimited. Isolating it in its own variable makes it easy to check usage against that credit.

## Open gap, not resolved
No variable is named for keeping a user logged in after OTP succeeds, such as a session or token signing secret. Neither the PRD nor AGENTS.md specifies the session mechanism. Ask before inventing one; do not assume a library or approach.