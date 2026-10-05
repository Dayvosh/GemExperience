---
trigger: model_decision
description: Use when implementing or modifying report filing, listing hide/unhide logic, admin moderation actions, account suspension, or report review queues.
---

# moderation.md

**Job:** Define exactly what happens when a listing is reported, hidden, or when an account is suspended. This file does not define the report button's location or UI; it defines the behavior once a report or moderation action occurs. Report reasons themselves are defined in `fixed-lists.md`, not repeated here.

## Report rules

1. A report must use one of the reasons defined in `fixed-lists.md`. Reason: a fixed list keeps reports scannable for the admin and prevents vague, unactionable reports.

2. Filing a report does not hide the listing by itself. Reason: reports can be wrong or malicious. Automatic removal on report would let anyone take down a competitor's listing with a false report.

3. A report starts in an open state and can later be marked reviewed or dismissed by the admin. Reason: this gives the admin a queue to work through, and a record of what was already looked at.

## Hide rules

1. Only an account with the admin role can hide a listing in response to a report. Reason: this is the deliberate, human decision point that a report alone does not trigger.

2. A rental can also hide their own listing directly, separate from an admin hiding it. Reason: a rental needs a way to take their own listing down, for example once the outfit is no longer available to rent, without needing to contact an admin.

3. A listing hidden by an admin cannot be un-hidden by the rental who owns it. Reason: without this rule, a rental whose listing was hidden for being fraudulent could simply toggle it back on through the same control used for self-hiding, which defeats the point of admin moderation.

4. Hiding a listing removes it from browse results but does not delete the listing, its photos, its ratings, or its report history. Reason: deleting the record would erase the evidence of a bad actor's pattern right when it matters most.

## Suspend rules

1. Only an admin can suspend a user account. Reason: same reasoning as hiding a listing, this is a deliberate human decision, not an automatic one.

2. A suspended account cannot log in, even with a correct OTP. Reason: suspension has to actually block access, not just remove visible content while leaving the account free to keep acting.

3. Suspending an account automatically hides every listing that account owns. Reason: a repeat bad actor should be stopped at the account level in one action, not by hiding their listings one at a time.

## Open gap, not resolved
What happens to an active, already-paid boost if its listing is later hidden, whether the boost is forfeited, refunded, or left running unseen, is not decided anywhere in the PRD. Do not invent a resolution. Ask before building any hide action that touches an active boost. The same gap is flagged in `pricing-and-boosts.md`.