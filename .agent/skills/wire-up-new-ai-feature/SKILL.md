---
name: wire-up-new-ai-feature
description: Use when building any feature that calls the AI provider. Walks through making the feature optional, non-blocking, and unable to fabricate facts, matching the pattern already used for the description assistant, photo check, and report triage.
---

# Wire up a new AI-touching feature

## Step 1: Confirm the feature is not disallowed
Check `ai-features-and-prompts.md` for the list of AI features explicitly ruled out: identity verification, fraud scoring, and a chat agent for renter-rental communication. If the requested feature matches any of these, stop and say so instead of building it.

## Step 2: Document the feature's contract if it is new
Check whether the requested feature is already one of the three described in `ai-features-and-prompts.md`. If it is a new feature not yet described there, write its contract into that file first, using the same format as the existing three: what triggers it, exactly what it is allowed to generate, and what happens if the AI call fails. Do not begin building until this is written down.

## Step 3: Identify what the AI is allowed to add
Using the contract from Step 2, write down exactly which fields or facts the AI is allowed to generate or transform, and which facts it must never invent that the user did not already supply.

## Step 4: Make the trigger optional
Build the feature as something the user actively starts, such as a button, never as something that runs automatically and blocks the user from proceeding without it.

## Step 5: Build the failure path first
Before building the success path, build what happens when the AI call fails or times out. Confirm the user can still complete the underlying task, saving a listing, filing a report, without the AI feature succeeding.

## Step 6: Get the credential from the right place
Use the `GEMINI_API_KEY` variable named in `secrets-and-config.md`. Do not invent a new variable name for this.

## Step 7: Add a human review step before anything AI-generated is saved
If the AI output will be saved as real data, such as a listing description, require the user to see and be able to edit that output before it saves. Never auto-save AI output directly.

## Step 8: Confirm the feature cannot block its parent task
Test the feature with the AI call deliberately failing. Confirm the parent action, such as publishing a listing or filing a report, still completes successfully without the AI step.