# GemExperience

## Description
GemExperience is a listing platform for wedding outfits in Nigeria. It connects rentals, who list wedding outfits they no longer need, with renters, who browse listings and contact a rental directly to arrange price, payment, and pickup off the platform. The platform does not process rental payments, handle logistics, or mediate transaction disputes between users. Content moderation, such as hiding a listing after a report, is a separate action the platform does perform. The platform earns revenue only through paid listing boosts.

## Who uses it
- Rental: a person who lists a wedding outfit for rent. Can also act as a renter using the same account.
- Renter: a person who browses listings and contacts a rental directly to arrange a rental. Can also act as a rental using the same account.
- Admin: the product owner. Reviews reported listings, can hide a listing, and can suspend a user account. No public admin signup exists.

## One thing the agent must do well
Never build a payment, escrow, or logistics flow between a rental and a renter. The platform never processes, holds, or sees money exchanged between these two roles. The only real payment flow in this product is a rental paying the platform for a listing boost, through Paystack. If a task description implies renter-to-rental payment on the platform, stop and ask before building it.

## Defined scope for the MVP
- Authentication uses a phone number plus a one-time password sent by SMS. There is no password anywhere in this system.
- One account type can act as rental, renter, or both. This is behavioral, not a schema field. The role field distinguishes only USER from ADMIN; never add rental or renter as role values.
- Listings limited to wedding outfits only, from a fixed list of outfit types.
- Outfit types, colors, and states are fixed, seeded lists, not editable through the app in version one. Do not build an admin screen to edit them.
- Location filtering by state, using a fixed list of Nigerian states. City is a free-text field on the listing and is not filterable.
- A UK size on each listing, drawn from a fixed reference chart. This chart is an unverified placeholder pending product-owner confirmation before launch. A rental can also enter the outfit's real measurements as an optional extra.
- A price entered by the rental, shown to renters as a starting point for negotiation off-platform.
- An optional face-blur step for listing photos, done in the browser before upload. Only the blurred image is ever uploaded or stored. The unblurred original is never sent to or stored on the server. A manual fallback exists if automatic detection misses a face.
- Photo upload for listings, stored on a photo hosting service.
- A manual availability toggle with exactly two states: Available and Currently Rented Out. No third state.
- Contact details shown only to signed-in, phone-verified accounts.
- A rating is a Yes/No answer plus an optional comment, allowed only after the renter has viewed the listing's contact details, one per renter per listing. A rental cannot rate their own listing.
- A report uses a fixed list of reasons and never auto-hides a listing. Only an explicit admin action hides a listing.
- A paid boost that raises a listing's placement in browse results for a fixed period. Boosted status must be checked live against the boost's end date at query time, not trusted from a stored status field alone.
- A safety disclaimer shown once, at signup, that addresses both roles. The exact required disclaimer wording is fixed and must not be paraphrased; confirm the exact text before implementing it.
- A cap on how many active listings one rental account can have at once.

## Not in scope for the MVP
- Any payment or escrow between a rental and a renter.
- Delivery, courier, or logistics coordination.
- Dispute resolution or mediation over an actual transaction.
- Identity verification beyond phone number OTP, including ID upload and facial verification. Facial verification here is unrelated to face blur, which hides a rental's own face in her own photos and is in scope.
- Calendar-based booking or date-blocking.
- Multi-language support.
- Native mobile apps.
- Password-based login.

## Stack
Fixed, do not change without asking:
- Next.js
- TypeScript
- Prisma
- PostgreSQL
- Paystack, for the boost payment flow
- Gemini free tier, for AI features (description assistant, photo check, report triage). Note: Gemini is not named in the PRD; this choice was set outside the PRD and should be reconfirmed.

AI feature rules: AI features must never block core listing creation if they fail or are slow. The description assistant must never add facts the rental did not supply.

Also named in the PRD's Technical Architecture section. Treat as current, but confirm before assuming it still holds:
- Vercel for hosting
- A pooled PostgreSQL connection, through a free-tier provider such as Supabase or Neon
- Cloudinary free tier for photo storage
- face-api.js, specifically, for the face-blur feature. Do not substitute another library without asking.
- Termii for OTP SMS delivery

## Folder map
Exact file paths are not specified, but the PRD states the app has a browsing UI and a rental dashboard, and that API routes are grouped by authentication, listing CRUD, ratings, reports, admin actions, and boost payment webhooks. Follow that grouping. Ask before creating top-level folders or choosing a routing convention beyond this.

## How to work in this codebase
- Make one change at a time, meaning one requirement ID or one named task per response. Never combine multiple requirement IDs in one response.
- Ask before adding a new package or dependency.
- Never edit the Prisma schema or run a migration without asking first. Ask before any change that adds, removes, or renames a table, column, or enum value.
- List assumptions at the end of every response, even small ones.
- If the PRD is silent about something needed to complete a task, stop and ask instead of guessing.

## Where the detailed rules live
Exact numbers, prices, and thresholds are not repeated in this file, to avoid this file drifting out of sync with the PRD. Ask where they should live before creating any new file or folder for them. Likely topics to track separately, once a location is agreed:
- Fixed selection lists: outfit types, colors, states.
- The UK size reference chart values.
- Boost price, boost duration, and how price is stored.
- Photo count limits, text length limits, listing caps, and rate limits.
- How hiding a listing and suspending an account work.

For anything not listed above, check the current PRD file in the project root. Confirm its exact filename each session, since it may have been renamed or re-versioned.

## Definitions
- Rental: the person listing a wedding outfit. Not the outfit itself.
- Renter: the person looking to rent an outfit.
- Contact reveal: a logged event recorded each time a renter views a listing's contact details. Required once per renter per listing before that renter can rate it.
- Boost: a paid feature that raises a listing's placement in browse results for a limited time. Does not change any of the listing's other data.
- Hidden: a listing removed from renter-facing browse results, but kept in the database with its history intact. Different from suspended. Only a listing can be individually hidden; a rating or report tied to a hidden listing stays in the database and is not itself hidden.
- Suspended: a user account blocked from logging in. All listings owned by that account become hidden at the same time.
- Tier / free tier: a service plan with no cost, used for hosting, the database, photo storage, SMS trial credit, and payment test mode. Not a paid user subscription. The PRD states there is no subscription model.
- Record: a stored entry in the database, such as a listing, a rating, or a report.
- Chunk: not a term used in the PRD. No definition exists for this project.