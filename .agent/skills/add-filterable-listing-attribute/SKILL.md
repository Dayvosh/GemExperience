---
name: add-filterable-listing-attribute
description: Use when adding a new attribute to a listing that a renter might filter or search by. Walks through deciding whether the attribute needs a fixed list or free text, then wires it into the schema and the filter.
---

# Add a filterable listing attribute

## Step 1: Decide free text or fixed list
Ask: will a renter ever filter or search by this attribute? If yes, it must be a fixed list, not free text. If no, free text is allowed. Check the decision against `fixed-lists.md` for how this decision was made for outfit type, color, and state, and against `size-chart.md` for how it was made for UK size. Do not proceed until this decision is made and stated out loud in your response.

## Step 2: If free text, stop here
Add the field as a plain text column. Do not add it to any filter. State clearly that this field is not filterable. Do not continue to the remaining steps.

## Step 3: Get the exact values
Check `fixed-lists.md` for the values if this attribute already has a defined list. If it does not exist yet in `fixed-lists.md`, ask for the exact values before writing any code. Never invent list values yourself.

## Step 4: Decide if the list needs an Other option
Check for a real, specific case where an outfit's true value would not match any listed option, for example a unique print or pattern. If such a case exists, add an Other option with a paired free-text field for the description, following the pattern already used for color in `fixed-lists.md`. If no such case exists, skip the Other option.

## Step 5: Record any new values in fixed-lists.md
If Step 3 required asking for new values because they did not already exist, add those approved values into `fixed-lists.md` now, before writing any schema or seed code. Confirm `fixed-lists.md` reflects the full, final list before moving on.

## Step 6: Add the field to the schema
Add the new fixed list as an enum. Add the field to the relevant model using that enum. Ask for approval before running the migration, per AGENTS.md.

## Step 7: Seed the fixed values
After the migration is approved and run, seed the exact values from `fixed-lists.md` into the database. Do not seed values that are not in `fixed-lists.md`.

## Step 8: Add the field to the listing form
Add the new field as a selectable input, not a text box, on the listing creation and edit forms.

## Step 9: Add the field to the browse filter
Add the field as a new filter option on the browse page. Confirm it filters correctly against the seeded values before considering the task done.

## Step 10: Confirm the Other field, if one exists, is excluded from the filter
If an Other option with free text was added in Step 4, confirm the filter does not attempt to match against that free-text value. Confirm this by testing that an Other-tagged listing only appears under the Other filter option, never under a text search of its free-text description.