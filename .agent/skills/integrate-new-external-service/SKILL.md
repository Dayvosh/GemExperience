---
name: integrate-new-external-service
description: Use when connecting a new third-party API or service to the project. Walks through confirming it fits the free-tier rule, naming its credentials correctly, deciding what is public versus secret, and checking it for compatibility with this project's serverless hosting.
---

# Integrate a new external service

## Step 1: Confirm the service has a usable free tier
Check that the service offers a free tier or free trial credit sufficient to build and test for several weeks without payment. If it does not, stop and say so instead of proceeding, since this is a fixed constraint for this project.

## Step 2: Confirm the service is actually needed
State plainly why this service is required and what it replaces or adds. Check `secrets-and-config.md` for the services already integrated, to confirm this is not a duplicate of an existing one.

## Step 3: Check for native compiled dependencies
Before selecting a specific package or SDK for this service, check whether it relies on native compiled bindings. If a pure JavaScript or TypeScript alternative exists that does the same job, prefer it. Check `secrets-and-config.md` for the existing precedent on this decision.

## Step 4: List every credential the service issues
Write down every distinct key, secret, or identifier the service gives you. Do not assume a service issues only one credential; check its documentation directly.

## Step 5: Separate public credentials from secret credentials
For each credential, state whether it is safe to expose in client-side code or must stay server-side only. Never combine a public and a secret credential into a single variable.

## Step 6: Name each variable following the existing pattern
Name each new environment variable using the same naming pattern already used in `secrets-and-config.md`, such as prefixing with the service name in capital letters.

## Step 7: Add the variables to secrets-and-config.md
Add each new variable to `secrets-and-config.md` with its purpose and its reason, following the same format as the existing entries. Do not add the variables anywhere else as the source of truth.

## Step 8: Confirm no secret reaches the browser
Check every place the new service's secret credential is used. Confirm none of those usages are in client-side or browser-executed code.

## Step 9: Ask before adding the package
Per AGENTS.md, ask before adding the new package to the project, even after completing the steps above.