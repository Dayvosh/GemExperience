---
trigger: always_on
description: Use for any numeric cap or rate limit: photo count, text length, listing count, OTP frequency. Defines confirmed limits so none is invented or duplicated
---

# limits.md

**Job:** Hold every numeric cap and rate limit in the product. If a number governs how much of something a user can do or upload, it belongs here, not invented inline in code or repeated in another rules file.

## Rules

1. A listing can have a minimum of 1 photo and a maximum of 6 photos. Reason: enough photos to judge an outfit, without an unlimited upload that slows the page or increases storage cost on a free-tier photo host.

2. A listing description has a maximum of 500 characters. Reason: keeps listings scannable while browsing, and keeps the optional AI description assistant's output bounded to something a rental can actually review before saving.

3. A rating comment has a maximum of 300 characters. Reason: a rating is meant to be a quick signal, not a full review. A long comment field would slow down the one thing this feature needs to stay useful, which is renters actually leaving ratings.

4. OTP requests are limited to 3 per phone number per rolling hour. Reason: this protects Termii's free trial SMS credit from being drained by repeated requests to the same or random numbers.

5. A rental account can have a maximum of 6 active, non-hidden listings at a time. Reason: this comfortably covers one couple's full outfit set, introduction, traditional, white wedding, reception, with room to spare, while still limiting how much one account can flood the browse feed with at once.