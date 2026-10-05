---
trigger: model_decision
description: **/app/api/webhooks/**
---

# payment-webhook-safety.md

**Job:** Set the safety rules for handling the one payment webhook this project has, the Paystack boost payment confirmation. This file does not cover the boost price, duration, or state machine; that belongs to `pricing-and-boosts.md`.

## Rules

1. Verify the webhook's signature before reading or acting on its contents. Reason: without this check, anyone who finds the webhook URL can fake a payment confirmation and mark a boost as paid for free.

2. If the signature does not verify, reject the request and log it. Do not process the payload any further. Reason: a failed signature check means the request cannot be trusted at all, not partially trusted.

3. Look up the boost by its stored payment reference, not by any other field sent in the webhook body. This reference must already exist on a pending boost record created before checkout started; see `pricing-and-boosts.md` for when that record is created. Reason: the payment reference is the one value that ties a specific payment attempt to a specific boost record. Matching on anything else risks updating the wrong listing's boost.

4. If a webhook arrives for a payment reference that has already been marked active, do nothing and return a success response without changing anything again. Reason: Paystack can send the same webhook more than once. Processing it twice must not double-activate anything or cause an error that makes Paystack retry endlessly.

5. Never trust an amount sent from the browser as the price paid. Only trust the amount confirmed inside the verified webhook payload. Reason: a client-side value can be edited by anyone before it reaches the server. Only the webhook, once its signature is verified, is trustworthy.

6. A boost only moves from pending to active because of a verified webhook, never because the browser says the checkout finished. Reason: a browser can report success even if the payment actually failed or was abandoned partway through. Only the webhook confirms money actually moved.