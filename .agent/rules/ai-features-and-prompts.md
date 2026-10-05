---
trigger: model_decision
description: Use when developing, modifying, or discussing AI integrations, Gemini API features, listing description generator, photo content checks, automated report triage, or AI scope constraints.
---

# ai-features-and-prompts.md

**Job:** Define the three AI features this product uses, exactly what each one is allowed and not allowed to do, and which provider serves all three. This file does not cover face blur, since face blur runs entirely in the browser with no AI API call involved.

## Provider
Gemini free tier serves all three features below. This choice is not named in the PRD itself; it was set as a project decision and should be reconfirmed if the PRD is ever updated.

## Feature 1: Listing description assistant
- Triggered by an optional button the rental presses after filling in outfit type, color, and a few bullet points.
- Must only rephrase fields the rental already entered. Must never add a new factual claim, such as a fabric type or condition, that the rental did not supply.
- The rental must review and can edit the result before it is saved.
- If the API call fails or is slow, the rental can still publish the listing using their own typed description. This feature must never block listing creation.

Reason: an AI-invented detail about fabric or condition becomes a false claim on a real listing, which is the kind of thing that damages trust in the whole platform. Making the feature optional and non-blocking also protects the core five-minute listing goal from an external API's uptime.

## Feature 2: Basic listing photo check
- Runs after a photo is uploaded. Flags if the image does not appear to contain clothing and prompts the rental to re-upload.
- This is a content-quality check, not a fraud detection system. It does not verify the photo is of the actual outfit being listed.
- If the check itself fails or times out, the upload still proceeds. This feature must never block a photo upload.

Reason: this catches obvious mistakes, like an accidentally uploaded unrelated photo, without pretending to catch fraud it was never built to catch.

## Feature 3: Report triage
- Runs when a report is filed. Reads the report's reason and comment and assigns a rough priority, High, Medium, or Low, to help order the admin's review queue.
- Takes no automatic action. Never hides a listing or suspends an account by itself.
- If the API call fails, the report is still filed normally. It simply has no priority label until an admin looks at it directly. This feature must never block a report from being filed.

Reason: this helps the one admin, the product owner, work through reports faster, without giving an AI model the power to make a moderation decision on its own, and without making the basic act of filing a report depend on an external API being available.

## Explicitly out of scope
No AI-based identity verification. No AI-based fraud scoring of users. No AI chat agent for renter-rental communication.

Reason: these all require far more data and testing than a version-one product has, and identity or fraud scoring in particular carries real risk if it gets something wrong.