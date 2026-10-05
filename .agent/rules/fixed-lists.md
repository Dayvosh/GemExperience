---
trigger: model_decision
description: Use when building, seeding, or editing outfit types, listing color selections, Nigerian state/location filters, report reasons, or dropdown selection options.
---

# fixed-lists.md

**Job:** Hold the exact values for every fixed selection list in the product. These values must match what is actually seeded in the database, not be retyped from memory in any code that uses them.

## Outfit type
Introduction, Traditional, White Wedding, Reception.

Reason this is fixed and not free text: the PRD sets exactly these four values. Adding a fifth value here without adding it to the seeded database list will make filtering silently miss listings that use it.

## Color
White, Gold, Red, Wine, Blue, Green, Purple, Silver, Black, Multicolor, Other.

If a rental picks Other, a separate free-text field appears for a specific description, such as a particular aso-ebi print. That free-text value is shown to renters but is never part of the color filter.

Reason: free text cannot be filtered reliably, since two people can describe the same color two different ways. The fixed list exists so the color filter actually works. The Other option exists so a real outfit color is never forced into a bad fit.

## State
Abia, Adamawa, Akwa Ibom, Anambra, Bauchi, Bayelsa, Benue, Borno, Cross River, Delta, Ebonyi, Edo, Ekiti, Enugu, Gombe, Imo, Jigawa, Kaduna, Kano, Katsina, Kebbi, Kogi, Kwara, Lagos, Nasarawa, Niger, Ogun, Ondo, Osun, Oyo, Plateau, Rivers, Sokoto, Taraba, Yobe, Zamfara, Federal Capital Territory.

City is a separate, free-text field on the listing. It is shown to renters for extra context but is not part of any filter.

Reason: this is all 36 Nigerian states plus the Federal Capital Territory. State is fixed because it is filterable. City is left as free text on purpose, since building a full list of every town in Nigeria is not worth the effort for version one, but that tradeoff means city can never be trusted as a filter input.

## Report reason
Fake listing, Outfit not as described, Scam attempt, Other.

Reason: a fixed list keeps reports scannable for the admin and prevents vague, unactionable reports. This list is referenced, not repeated, in `moderation.md`.