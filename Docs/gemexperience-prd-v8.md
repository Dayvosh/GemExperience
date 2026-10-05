## Product Summary

GemExperience is a listing platform for wedding outfits in Nigeria. It connects two user types: rentals, who list wedding outfits they no longer need, and renters, who browse those listings and contact rentals directly to arrange price, payment, and pickup. The platform hosts listings, contact details, and a safety disclaimer. It does not process rental payments, does not handle logistics, and does not resolve transaction disputes between named users. Content moderation, such as hiding a fake or reported listing, is a separate action the platform does take. The platform earns money by charging rentals for a visibility boost on their listing. Version one is a Next.js web app with a PostgreSQL database, built to run on free-tier infrastructure.

What sets this apart from posting on WhatsApp Status or Facebook Marketplace: listings are filterable by outfit type, location, and size, and every rental builds a visible rating history over time. A free social post offers neither.

## Problem

Couples spend large amounts on outfits for wedding events: introduction, traditional, white wedding, and reception. After the wedding, these outfits are rarely worn again because they are too elaborate for daily use or other events. The outfits sit unused at home. At the same time, other couples preparing for their own wedding spend similar amounts sewing new outfits from scratch, often under time pressure. There is no dedicated, searchable channel connecting people with unused wedding outfits to people who need one temporarily. Informal channels like WhatsApp groups and word of mouth exist, but they are not structured or searchable.

## Goals

- Let a rental create a listing for a wedding outfit in under 5 minutes.
- Let a renter browse and filter listings without an account, and require account creation with phone verification only at the point of viewing contact details.
- Give renters enough listing detail to decide whether to make contact, without the platform handling the transaction.
- Generate revenue through paid visibility boosts, with no other payment flow in version one.
- Reduce the two most likely harms on this kind of platform: fake listings and unsafe in-person meetings, through disclaimers and reporting, not through platform-enforced safety.

Assumption: A specific business goal, such as a target number of listings or a revenue figure, is not set in this PRD. This is listed in Open Questions.

## Users and Personas

**Persona 1: Amaka, the Rental**
Amaka got married 3 months ago in Lagos. She spent money on 4 outfits for introduction, traditional, white wedding, and reception. She will not wear these again. She wants to earn money from them without spending time negotiating logistics through the platform. She wants control over who she gives the outfit to, so she wants to see a phone number or WhatsApp contact before committing, and she wants a way to mark her listing as taken once she has an agreement.

**Persona 2: Tobi, the Renter**
Tobi is getting married in 4 months in Abuja. He does not want to spend the time or money sewing a traditional outfit from scratch. He wants to filter by outfit type, city, and size, look at photos, and message a few rentals directly on WhatsApp to compare price and availability before deciding. His size filter uses UK sizes on every listing, and each size shows its typical bust, waist, and hip measurements plus its letter size, so he can judge fit before reaching out.

**Persona 3: A bad actor**
Assumption: this persona is not in the original idea, but the safety disclaimer and reporting feature only make sense if this persona exists. This platform will attract people who post fake listings to lure users into off-platform scams, or who show up to a handover with no intention to pay. The product is designed assuming this persona exists, even in version one.

**Persona 4: The Admin**
The product owner acts as the sole admin in version one. There is no admin signup flow; the owner's account has its `role` field set to `ADMIN` directly in the database, and they use a dedicated admin view to see reported listings, hide the ones that warrant it, and suspend a repeat bad-actor's account entirely.

## Scope

**In scope for version one:**
- Two user roles: rental and renter. One account can act as both. This is a final decision for version one, not an open question.
- Outfit listings only. No shoes, jewelry, or accessories.
- A fixed list of outfit types, set at launch: Introduction, Traditional, White Wedding, and Reception.
- Location filtering by state, using a fixed list of all 36 Nigerian states plus the Federal Capital Territory. City is entered as a free-text detail on the listing for extra context, shown to renters, but is not filterable, since free text cannot be matched reliably.
- A fixed UK size on every listing (for example 6, 8, 10, 12, up to 24), picked from a reference size chart that shows typical bust, waist, and hip measurements and the matching letter size (XS to XXL) for that UK size. This chart is a general guide, not a guarantee, since wedding outfits are usually altered to fit one specific person. A rental can also enter the outfit's actual bust, waist, and hip measurements as an optional extra field, which is more reliable than the general chart when provided.
- A price entered by the rental for each listing, shown to renters, with a note that it is a starting point and can still be discussed directly with the rental.
- An optional face-blur toggle when uploading photos, so a rental can hide her face in listing photos if she chooses, with a live preview and a manual fallback for faces automatic detection misses.
- Photo upload for listings, minimum 1 photo, maximum 6 photos, stored on a named free-tier photo host.
- Manual availability toggle per listing ("Available" or "Currently Rented Out").
- Contact details displayed on a listing: phone number required, email and WhatsApp link optional. Visible only to signed-in, phone-verified accounts. This is a final decision for version one, not an open question.
- Simple rating left by a renter on a listing, gated to renters who have viewed that listing's contact details.
- A "Report this listing" action available to any signed-in user.
- Admin ability to hide a reported listing without deleting its history.
- Admin ability to suspend a user account, which automatically hides all listings owned by that account.
- Paid visibility boost for a listing: 3,000 naira for 30 days.
- Safety disclaimer shown once, at signup.
- A maximum of 6 active (non-hidden) listings per rental account, to limit spam or fake bulk listings while still covering a couple's full outfit set (introduction, traditional, white wedding, reception) with room to spare.

**Out of scope for version one:**
- Any payment or escrow between rental and renter.
- Delivery, courier, or logistics coordination.
- Dispute resolution or mediation between users over an actual transaction.
- Identity verification beyond phone number OTP (no ID upload, no facial verification).
- Calendar-based booking or date-blocking. Availability is a manual toggle only, not a calendar.
- Multi-language support. Assumption: English only.
- Native mobile apps. Web only, mobile-responsive.
- Password-based login. Assumption: phone number plus OTP is the only login method, removing the need for password storage or password reset.

## Functional Requirements

### Authentication
| ID | Requirement |
|---|---|
| AUTH-1 | A user signs up and logs in with a phone number only. There is no password. |
| AUTH-2 | The platform sends a one-time password (OTP) to the phone number by SMS for both signup and every login. The user must enter the correct OTP to proceed. |
| AUTH-3 | An account cannot create a listing, leave a rating, or report a listing until the phone number is verified. |
| AUTH-4 | Browsing and filtering listings does not require an account. Contact details on a listing are hidden until the visitor creates an account and passes phone verification. This is a final version-one decision. |
| AUTH-5 | OTP requests are rate limited to a maximum of 3 requests per phone number per rolling hour, to protect the SMS budget from abuse. |
| AUTH-6 | A suspended account cannot log in, even with a correct OTP. The login attempt fails with a message that the account has been suspended. |

### Listings
| ID | Requirement |
|---|---|
| LIST-1 | A verified rental account can create a listing with: outfit type (fixed list, single select), UK size (fixed list, single select, for example 6 through 24), optional actual measurements for the specific outfit (bust, waist, hip, entered as numbers), color (fixed list, single select: White, Gold, Red, Wine, Blue, Green, Purple, Silver, Black, Multicolor, Other), description (free text, max 500 characters), price (whole naira amount, required), 1 to 6 photos, state (fixed list, single select), city (free text), phone number, optional email, optional WhatsApp link. |
| LIST-2 | A listing has an availability status field with two values: "Available" and "Currently Rented Out". The rental can toggle this at any time from their dashboard. |
| LIST-3 | A listing is visible to renters only after the rental's phone number is verified. |
| LIST-4 | A rental can edit their own listing at any time, or hide it themselves (self-hide, distinct from admin hide). |
| LIST-5 | A rental can view a list of their own listings, with status and boost state, from a dashboard. |
| LIST-6 | Uploaded photos are stored on a named free-tier photo storage service (see Technical Architecture). |
| LIST-7 | When a rental picks a UK size, the listing form shows the reference chart entry for that size (typical bust, waist, hip range, and letter size) so she can confirm it is close to her outfit before saving. This reference is informational and does not restrict what she can enter in the optional actual measurements field. |
| LIST-8 | A rental account can have at most 6 active, non-hidden listings at a time. The form blocks creating a new listing past this limit until the rental hides an existing one to free up a slot. |
| LIST-9 | The listing's price is shown on the listing card in the browse feed and on the detail page, labeled as a starting price. A short note near the price tells the renter they can still discuss and negotiate the amount directly with the rental by phone or WhatsApp. |
| LIST-10 | When adding photos to a listing, a rental can turn on a "Blur my face" toggle. When it is on, each photo is processed with client-side face detection as it is added, and any detected face is blurred. A live preview of the blurred photo is shown immediately so the rental can confirm the result before saving. |
| LIST-11 | If automatic face detection does not find a face in a photo (for example, when a gele, veil, or headpiece obscures it), the rental can manually draw a box over the area to blur it herself, as a fallback to the automatic tool. |
| LIST-12 | Only the blurred version of a photo is ever uploaded and stored. Face detection and blurring happen in the rental's browser before upload; the original, unblurred image is never sent to or stored on the server. |
| LIST-13 | If a rental picks "Other" for color, for example a multi-pattern aso-ebi print that does not fit the fixed list, a short free-text field appears for her to describe it. This text is shown on the listing but is not filterable, since color filtering only works against the fixed list. |

### Browsing and search
| ID | Requirement |
|---|---|
| BROWSE-1 | A renter can filter listings by outfit type, state, UK size, color, price range in naira, and availability status. City is shown on each listing but is not a filter option, since it is free text. |
| BROWSE-2 | A renter can sort listings by newest first or by boosted first. |
| BROWSE-3 | Boosted listings appear above non-boosted listings in default sort order, both in the general listings feed and within a filtered outfit-type category, marked with a visible "Featured" label. Boosted status is computed at query time based on whether the boost's end date is in the future, not solely from a stored status field. |
| BROWSE-4 | Clicking a listing opens a detail page with all photos, full description, and contact details, once the viewer is signed in and phone-verified. The page also shows the listing's UK size with its reference chart measurements and letter size, and the outfit's actual measurements when the rental provided them, clearly labeled as two separate pieces of information. |
| BROWSE-5 | The price filter uses a minimum and maximum naira amount entered by the renter. Both are optional; a renter can set only a minimum, only a maximum, or both. |

### Safety disclaimer
| ID | Requirement |
|---|---|
| SAFE-1 | The disclaimer is shown as a mandatory checkbox at signup, and covers both roles since one account can act as either. Text: "I understand GemExperience does not process payments, handle logistics, or resolve transaction disputes between users. If I list an outfit for rent, I am responsible for my own checks before handing it over, such as asking for identification and collecting payment first. If I rent an outfit, I understand GemExperience does not verify listings or guarantee an outfit's condition, and I am responsible for verifying details and arranging payment carefully, and meeting in a public place if meeting in person." The user cannot complete signup without checking this box. This is the only time the disclaimer is shown; it does not repeat on listing pages. |
| SAFE-2 | Disclaimer text is stored in a single editable content block so it can be updated without a code change. |

### Ratings
| ID | Requirement |
|---|---|
| RATE-1 | A signed-in renter can leave one rating per listing: a Yes/No answer to "Did this rental respond and follow through?" plus an optional comment, max 300 characters. |
| RATE-2 | A rental cannot rate their own listing. |
| RATE-3 | Ratings are shown publicly on the listing detail page, along with a computed percentage of "Yes" responses. |
| RATE-4 | A user can submit only one rating per listing. Editing a submitted rating is not supported in version one. |
| RATE-5 | A renter can only rate a listing after having viewed its contact details at least once. Each contact-detail view is logged and checked before allowing a rating. |

### Reporting
| ID | Requirement |
|---|---|
| REPORT-1 | A signed-in user can report a listing with a reason selected from a fixed list (Fake listing, Outfit not as described, Scam attempt, Other) plus an optional comment. |
| REPORT-2 | Reported listings are flagged in an admin view for manual review. Reporting does not automatically remove or hide a listing. |
| REPORT-3 | An account with the ADMIN role can hide a reported listing. Hiding removes it from browse results but keeps the listing record, its ratings, and its report history intact. Admins do not have a hard-delete action in version one. |
| REPORT-4 | An account with the ADMIN role can suspend a user account. A suspended account cannot log in, create a listing, leave a rating, or file a report. All listings owned by a suspended account are automatically hidden at the same time, so a repeat bad actor is stopped at the account level, not just one listing at a time. |

### Boosts
| ID | Requirement |
|---|---|
| BOOST-1 | A rental can pay to boost their own listing from their dashboard. |
| BOOST-2 | A boost costs a fixed 3,000 naira and lasts 30 days from the moment payment is confirmed. |
| BOOST-3 | A boosted listing shows a "Featured" badge and appears above non-boosted listings in default browse order, for the duration of the boost. |
| BOOST-4 | A scheduled job runs periodically to mark boosts as expired once their end date passes. Boosted status shown to users is also checked live against the end date, so a missed scheduled run cannot wrongly keep a listing featured. |
| BOOST-5 | Payment for a boost is processed through Paystack, using their free test mode during development. Amounts are stored in kobo, matching Paystack's API convention. A 3,000 naira boost is stored as 300,000 kobo. |
| BOOST-6 | When a boost expires after 30 days, the listing is not removed or hidden. It simply stops showing the "Featured" badge and returns to normal, non-boosted position in browse results. The rental can purchase a new boost at any time to feature it again. |

## AI and AI Related Tools and Solutions

All AI features below are chosen to run within a free tier during testing, and none are required for the core listing or browsing flow to work.

- **Listing description assistant**: An optional, non-blocking button a rental can press after filling in outfit type, color, and a few bullet points. An AI model API call generates a suggested description in full sentences. The prompt is constrained to only rephrase fields the rental has already entered and is explicitly forbidden from adding new factual claims, such as fabric type or condition, that the rental did not supply. The rental must review and can edit the result before it is saved. If the AI call fails or is slow, the rental can still publish the listing using their own typed description with no interruption.
- **Basic listing photo check**: An AI image classification call can flag if an uploaded photo does not appear to contain clothing, and prompt the rental to re-upload. This is a content-quality check, not a fraud detection system, and does not block upload if the check itself fails.
- **Face blur for photos**: Unlike the other AI features here, this runs entirely in the rental's browser using a free, client-side face detection library, not a server-side API call. It has no per-use cost and no ongoing quota to manage. See Technical Architecture for the specific library and Listings requirements LIST-10 through LIST-12 for how it behaves.
- **Report triage**: When a listing is reported, an AI model API call can read the report reason and comment and assign a rough priority (High, Medium, Low) to help the admin review queue, without taking any automatic action.
- Explicitly out of scope for AI in version one: no AI-based identity verification, no AI-based fraud scoring of users, no AI chat agent for renter-rental communication.

## Technical Architecture

**Stack**: Next.js (frontend and backend, using API routes or route handlers), TypeScript, Prisma as ORM, PostgreSQL as database.

**Hosting**: Vercel for the Next.js app (free tier). A free-tier PostgreSQL provider such as Supabase or Neon for the database.

**Database connections**: Assumption, added to prevent a known failure mode. Prisma on a serverless platform can exhaust a free-tier database's connection limit if each function invocation opens its own connection. Version one uses the pooled connection string provided by the chosen database host (Supabase's connection pooler or Neon's equivalent) rather than a direct connection string, to stay within free-tier connection limits.

**Photo storage**: Assumption, a specific provider was not named before. Version one uses Cloudinary's free tier for photo upload and storage, referenced by URL from the `Photo` model.

**Face blur**: Recommendation. Version one uses face-api.js, a free, open-source face detection library that runs fully in the browser using the visitor's own device, with no server calls and no per-use cost. When the rental turns on the "Blur my face" toggle, this library detects faces in each photo on a canvas element in the browser, applies a blur over the detected area, and shows the result as a live preview. Only the resulting blurred image file is uploaded to Cloudinary; the original is never sent to the server. If the library does not detect a face, for example when a gele or veil obscures it, the rental can manually draw a blur box over the area herself before saving.

**Scheduled jobs**: Boost expiry is handled by a Vercel Cron job calling a dedicated API route on a fixed schedule (for example, once per hour), which finds boosts past their `endsAt` date and marks them `EXPIRED`.

**Size reference chart**: A fixed reference table maps each UK size to a typical bust, waist, and hip range and a letter size (XS through XXL). This table is seeded once into the database and is not editable through the app in version one. Listings store only the UK size a rental picked; the chart values shown on screen are looked up from this table, not duplicated onto each listing.

**SMS OTP provider**: Recommendation, since no provider was named. Version one uses Termii, a Nigerian SMS API that reaches all four major networks (MTN, Airtel, Glo, 9mobile) and prices in naira. Termii gives free trial credit on signup, which covers OTP volume during early testing. This is trial credit, not an unlimited free tier, so if testing volume grows, a small NGN wallet top-up will eventually be needed. This is flagged in Risks.

**High-level structure**:
- Next.js app handles both the browsing UI and the rental dashboard.
- API routes handle authentication, listing CRUD, ratings, reports, admin actions, and boost payment webhooks.
- Prisma manages all database access and migrations against PostgreSQL, using a pooled connection.
- SMS OTP is sent through Termii's API, using free trial credit during early testing.
- Payment for boosts is handled through Paystack's API, using their test mode during development, with amounts stored in kobo.

**Prisma data model**:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  USER
  ADMIN
}

model User {
  id            String    @id @default(cuid())
  phoneNumber   String    @unique
  email         String?   @unique
  role          Role      @default(USER)
  isVerified    Boolean   @default(false)
  isSuspended   Boolean   @default(false)
  suspendedAt   DateTime?
  otpCode       String?
  otpExpiresAt  DateTime?
  otpRequestCount Int     @default(0)
  otpWindowStart  DateTime?
  createdAt     DateTime  @default(now())

  listings      Listing[]
  ratingsGiven  Rating[]        @relation("RatingsGiven")
  reportsFiled  Report[]        @relation("ReportsFiled")
  contactReveals ContactReveal[]
}

model OutfitType {
  id       String    @id @default(cuid())
  name     String    @unique
  listings Listing[]
}

// Fixed reference table, seeded once. Not user-editable in version one.
model UkSizeChart {
  ukSize      Int      @id
  bustInches  Int
  waistInches Int
  hipInches   Int
  letterSize  String
  listings    Listing[]
}

enum NigerianState {
  ABIA
  ADAMAWA
  AKWA_IBOM
  ANAMBRA
  BAUCHI
  BAYELSA
  BENUE
  BORNO
  CROSS_RIVER
  DELTA
  EBONYI
  EDO
  EKITI
  ENUGU
  GOMBE
  IMO
  JIGAWA
  KADUNA
  KANO
  KATSINA
  KEBBI
  KOGI
  KWARA
  LAGOS
  NASARAWA
  NIGER
  OGUN
  ONDO
  OSUN
  OYO
  PLATEAU
  RIVERS
  SOKOTO
  TARABA
  YOBE
  ZAMFARA
  FCT_ABUJA
}

enum Color {
  WHITE
  GOLD
  RED
  WINE
  BLUE
  GREEN
  PURPLE
  SILVER
  BLACK
  MULTICOLOR
  OTHER
}

enum ListingStatus {
  AVAILABLE
  RENTED_OUT
}

model Listing {
  id             String        @id @default(cuid())
  ownerId        String
  owner          User          @relation(fields: [ownerId], references: [id])
  outfitTypeId   String
  outfitType     OutfitType    @relation(fields: [outfitTypeId], references: [id])
  ukSize         Int
  sizeChart      UkSizeChart   @relation(fields: [ukSize], references: [ukSize])
  actualBustInches  Int?
  actualWaistInches Int?
  actualHipInches   Int?
  color          Color
  colorOther     String?
  description    String
  priceNaira     Int
  city           String
  state          NigerianState
  phoneNumber    String
  whatsappLink   String?
  contactEmail   String?
  status         ListingStatus @default(AVAILABLE)
  isHidden       Boolean       @default(false)
  hiddenAt       DateTime?
  photos         Photo[]
  ratings        Rating[]
  reports        Report[]
  boosts         Boost[]
  contactReveals ContactReveal[]
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

model Photo {
  id             String   @id @default(cuid())
  listingId      String
  listing        Listing  @relation(fields: [listingId], references: [id])
  url            String
  order          Int
  wasFaceBlurred Boolean  @default(false)
}

model ContactReveal {
  id        String   @id @default(cuid())
  listingId String
  listing   Listing  @relation(fields: [listingId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())

  @@unique([listingId, userId])
}

model Rating {
  id              String   @id @default(cuid())
  listingId       String
  listing         Listing  @relation(fields: [listingId], references: [id])
  raterId         String
  rater           User     @relation("RatingsGiven", fields: [raterId], references: [id])
  followedThrough Boolean
  comment         String?
  createdAt       DateTime @default(now())

  @@unique([listingId, raterId])
}

enum ReportReason {
  FAKE_LISTING
  NOT_AS_DESCRIBED
  SCAM_ATTEMPT
  OTHER
}

enum ReportStatus {
  OPEN
  REVIEWED
  DISMISSED
}

model Report {
  id         String       @id @default(cuid())
  listingId  String
  listing    Listing      @relation(fields: [listingId], references: [id])
  reporterId String
  reporter   User         @relation("ReportsFiled", fields: [reporterId], references: [id])
  reason     ReportReason
  comment    String?
  status     ReportStatus @default(OPEN)
  createdAt  DateTime     @default(now())
}

enum BoostStatus {
  PENDING
  ACTIVE
  EXPIRED
}

model Boost {
  id            String      @id @default(cuid())
  listingId     String
  listing       Listing     @relation(fields: [listingId], references: [id])
  amountPaidKobo Int
  currency      String      @default("NGN")
  paymentRef    String      @unique
  status        BoostStatus @default(PENDING)
  startsAt      DateTime?
  endsAt        DateTime?
  createdAt     DateTime    @default(now())
}
```

Notes on the schema:
- `amountPaidKobo` is named explicitly to remove ambiguity: all boost amounts are stored in kobo, matching Paystack's API.
- `ContactReveal` has a unique constraint per listing and user, and is the required gate before a `Rating` can be created for that listing.
- `Listing.isHidden` replaces hard deletion for admin moderation. Ratings, reports, and boosts tied to a hidden listing remain in the database.
- `UkSizeChart` is a fixed lookup table seeded once with standard UK size to bust/waist/hip/letter size data. `Listing.ukSize` references it. The optional `actualBustInches`, `actualWaistInches`, and `actualHipInches` fields hold the real measurements of that specific outfit when the rental provides them, and are shown separately from the chart values on the listing page.
- `OutfitType` is seeded once with exactly four rows: Introduction, Traditional, White Wedding, Reception. It is not user-editable in version one.
- `Listing.priceNaira` is stored as a whole naira number (not kobo), since this price is only ever displayed to users and is never processed as a payment by the platform. This is a deliberate difference from `Boost.amountPaidKobo`, which is an actual payment amount sent to Paystack.
- `Photo.wasFaceBlurred` records whether a given photo went through the blur step before upload, for reference only. It does not store any unblurred version of the image.
- `Listing.color` uses a fixed `Color` enum so it can be filtered reliably. `colorOther` is an optional free-text field used only when `color` is set to `OTHER`, and is shown on the listing but excluded from the color filter.
- `Listing.state` uses a fixed `NigerianState` enum covering all 36 states plus the Federal Capital Territory, so location filtering works reliably. `Listing.city` remains a free-text field for extra detail shown to renters, but is intentionally left out of `BROWSE-1`, since free text cannot be filtered the same way.
- `User.isSuspended` and `suspendedAt` support REPORT-4. A suspended user's listings are hidden at the same time the suspension is applied, using the existing `Listing.isHidden` field, so no separate mechanism is needed to remove their content from browse results.

## Business Model

- The only revenue source in version one is the paid visibility boost, paid by rentals to the platform.
- A boost moves a listing to the top of default browse results, in both the general feed and its outfit-type category, and adds a "Featured" badge, for 30 days.
- The boost has value because it places a listing above competitors inside a structured, filterable, rated marketplace, something a free social media post cannot offer. This is the core reason a rental would pay instead of just posting for free elsewhere.
- Boost price is fixed at 3,000 naira for a 30-day period. When the 30 days end, the listing stays live and simply loses its "Featured" placement; it is never removed or hidden for a boost expiring.
- No commission is charged on any rental-to-renter transaction, since the platform does not process or see that payment.
- No subscription model, no listing fee, and no lead-generation fee exist in version one.

## Success Metrics

Assumption: this PRD does not set target numbers or a measurement period. The following metrics are structurally reasonable for this type of platform. Targets must be set by the product owner.

- Number of verified rental accounts with at least one published listing.
- Number of verified renter accounts.
- Number of listing detail page views that result in a contact-details reveal (a proxy for actual outreach, since the platform cannot see whether contact happened off-platform).
- Percentage of listings with at least one rating within 60 days of publishing.
- Number of boosts purchased per month, and total boost revenue.
- Number of reports filed per 100 listings, as a rough fraud/quality signal.
- Percentage of listings with no edit or status change in 90 days, as a measure of stale or abandoned listings.

## Risks

- **Fraud between renter and rental**: The platform never sees payment or handover, so a renter can send money and never receive the outfit, or a rental can hand over an outfit and never get paid. The disclaimer sets expectations but does not prevent this.
- **Fake listings**: Since there is no outfit-ownership verification, someone can post photos that are not theirs, collect payment or lure a renter into a scam conversation, then disappear. Phone verification and reporting reduce but do not remove this risk.
- **Safety during in-person handover**: Meetings happen off-platform. The platform cannot enforce or monitor the "meet in a public place" advice. A serious safety incident during a meetup is a reputational and possibly legal risk for the platform even though the disclaimer states no responsibility.
- **No logistics oversight**: If a rental and renter are in different cities, there is no shipping or courier support. Failed logistics arrangements will likely produce complaints directed at the platform even though it is out of scope.
- **Weak trust signal at low volume**: The rating system only works once there is meaningful usage. In the first weeks, most listings will have zero ratings, which weakens the main trust mechanism exactly when it is needed most.
- **Reliance on manual availability toggling**: If a rental forgets to mark a listing "Currently Rented Out," renters will keep contacting them about an outfit that is unavailable, creating a bad experience with no system safeguard.
- **Free-tier infrastructure limits**: Termii's free trial credit, free-tier database hosting, and Paystack test mode all have volume caps. If OTP volume grows past Termii's trial credit, a small NGN wallet top-up will be needed to keep OTP delivery working. If other parts of usage grow faster than expected, they may need to move to paid tiers sooner than planned.
- **SMS quota abuse**: Without rate limiting, repeated OTP requests to real or random phone numbers can drain the free-tier SMS budget quickly. Version one addresses this with a per-phone-number rate limit, but a determined attacker using many numbers could still cause damage.
- **Rating manipulation**: Requiring a contact-detail view before rating reduces but does not eliminate the risk of a rental inflating their own rating through a second account, since account creation itself is not heavily gated.
- **Database connection exhaustion**: Serverless functions calling Prisma without connection pooling can exhaust a free-tier database's connection limit under concurrent load. Version one addresses this by using a pooled connection string, but this must be verified under real testing traffic, not assumed to work by default.
- **Face blur reliability**: Automatic face detection can miss faces that are partly covered by a gele, veil, or other headpiece, which are common in Nigerian wedding photos. The manual blur fallback covers this, but a rental could still save a photo believing her face is hidden when the automatic detection missed it and she did not check the preview carefully.

## Open Questions

1. Do listings auto-expire after a period of inactivity (for example, if a rental never toggles status or edits it for many months), and if so, after how many days? Note: this is different from boost expiry, which is now settled. This question is about a listing going stale, not a boost ending.
2. The UK size to bust/waist/hip/letter-size chart used to seed `UkSizeChart` is a placeholder built from commonly used reference ranges, not a verified source. This must be reviewed and confirmed, or replaced with a source the product owner trusts, before the platform launches, since it is shown to every renter as guidance on every listing.
