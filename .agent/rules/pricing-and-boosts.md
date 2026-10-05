---
trigger: model_decision
description: Use when building or editing the paid listing boost flow, Paystack checkout initialization, boost pricing, kobo/naira conversions, boost expiry jobs, or boosted listing search placement.
---

# pricing-and-boosts.md

**Job:** Hold the boost's fixed price, fixed duration, currency handling, and state machine. This file does not cover webhook safety, that belongs to `payment-webhook-safety.md`, and does not cover moderation interactions with an active boost, which is an open gap flagged in `moderation.md`.

## Price and duration
A boost costs a fixed 3,000 naira and lasts 30 days from the moment payment is confirmed. Reason: this is the confirmed, fixed starting price and duration for version one.

## Two separate currency fields, never to be confused
A listing's displayed price, shown to renters as a starting point for negotiation, is stored in plain naira. Reason: this number is only ever shown to users and is never sent to Paystack, so there is no reason to store it in a smaller unit.

The boost's actual paid amount is stored in kobo, matching Paystack's API convention. A 3,000 naira boost is stored as 300,000 kobo. Reason: Paystack's API works in kobo. Storing the boost amount in naira while Paystack expects kobo would make every boost payment wrong by a factor of 100.

## Lifecycle
1. A boost record is created in a pending state before the rental is sent to Paystack checkout, with a payment reference stored on it. Reason: the webhook that later confirms payment needs an existing record with that reference to match against; see `payment-webhook-safety.md`.
2. The boost moves from pending to active only through a verified webhook, never through the browser reporting success. Reason: stated fully in `payment-webhook-safety.md`; not repeated here.
3. A scheduled job runs periodically and marks a boost as expired once its 30 days have passed. Boosted status shown to users is also checked live against the end date at query time, not only from the stored status field. Reason: this project has no persistent background process. If the scheduled job runs late, a live check still gives the correct answer instead of trusting a possibly stale status.

## What expiry does and does not do
When a boost expires, the listing is not hidden, removed, or altered in any other way. It simply loses its featured placement and returns to normal position in browse results. Reason: a boost only ever affects where a listing appears, never whether it exists or what data it holds. The rental can purchase a new boost at any time to feature it again.

## Placement
A boosted listing appears above non-boosted listings both in the general browse feed and within a filtered outfit-type category. Reason: this is the confirmed placement behavior; a boost that only worked in one of the two views would not deliver the visibility a rental is paying for.

## Open gap, not resolved
What happens to an active boost if its listing is hidden during the boost period is not decided. Do not invent a resolution. Ask before building any interaction between hiding and an active boost. The same gap is flagged in `moderation.md`.