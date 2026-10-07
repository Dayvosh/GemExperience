# GemExperience

GemExperience is a listing platform for wedding outfits in Nigeria. It connects rentals (people listing wedding outfits they no longer need) with renters (people browsing listings and contacting rentals directly to arrange rentals). 

The platform does not process payments between rentals and renters, handle logistics, or mediate disputes. It earns revenue only through paid listing boosts.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Prisma](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/) (pooled via Supabase/Neon)
- **Payments**: [Paystack](https://paystack.com/) (boost payments only)
- **AI**: [Google Gemini](https://ai.google.dev/gemini-api/docs) (free tier) for description assistant, photo check, and report triage
- **Hosting**: [Vercel](https://vercel.com/)
- **Storage**: [Cloudinary](https://cloudinary.com/) (photo hosting)
- **SMS**: [Termii](https://termii.com/) (OTP delivery)
- **Face Detection**: [face-api.js](https://justadudewhohacks.github.io/face-api.js/docs/) (browser-based face blur)

## Key Features (MVP)

- **Phone OTP Authentication**: No passwords. Phone number + one-time code via SMS
- **Dual Role Accounts**: One account can act as both rental and renter (role is USER/ADMIN only)
- **Wedding Outfit Listings**: Limited to wedding outfits from a fixed set of types
- **Location & Sizing**: Filter by Nigerian state (fixed list), city as free text. UK size from fixed chart + optional measurements
- **Browser Face Blur**: Optional face blur applied before upload - unblurred originals never stored
- **Availability**: Manual toggle (Available / Currently Rented Out)
- **Contact Reveal**: Contact details shown only to signed-in, phone-verified users
- **Ratings & Reports**: Yes/No rating + comment (after contact reveal, one per renter/listing). Reports use fixed reasons, never auto-hide
- **Listing Boosts**: Paid boosts raise placement for a fixed period (status checked live against end date)
- **Safety Disclaimer**: Shown once at signup
- **Content Moderation**: Admins can hide listings and suspend accounts (no public admin signup)

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Supabase/Neon pooled connection)
- API keys for: Paystack, Gemini, Cloudinary, Termii
- Vercel account (for deployment)

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/Dayvosh/GemExperience.git
cd GemExperience
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Fill in the required values for database, Paystack, Gemini, Cloudinary, and Termii.

4. Set up the database
```bash
npx prisma generate
npx prisma db push # or prisma migrate dev
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Important Notes

- **No payment flow between users**: The platform never processes money between rentals and renters. Only boost payments to the platform via Paystack.
- **Privacy-first**: Face blur happens in-browser before upload; original unblurred images are never sent to the server.
- **Fixed reference data**: Outfit types, colors, states, and UK size chart are seeded/fixed (not admin-editable in MVP).
- **AI non-blocking**: AI features never block core listing creation if they fail or are slow. The description assistant never invents facts.

## Contributing

Please read `AGENTS.md` for detailed development guidelines specific to this project.

## License

[MIT](LICENSE)
