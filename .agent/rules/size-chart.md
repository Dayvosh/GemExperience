---
trigger: model_decision
description: Use for the UK size field, measurement display, or size filter. Defines the placeholder chart, requires asking for sizes outside 6 through 24
---

# size-chart.md

**Job:** Hold the UK size reference chart shown to both rentals and renters. This file does not hold a specific outfit's real measurements; those are typed directly into that listing by the rental.

## Status
The numbers below are placeholder reference values, not a confirmed source. They must be reviewed and confirmed, or replaced with a source the product owner trusts, before this product goes live. This is tracked as an open question in the PRD.

This chart only covers UK sizes 6 through 24. What happens for a size outside this range is not decided. Ask before building a size selector that assumes this chart is exhaustive, and do not silently extrapolate a row for a size not listed.

## Chart

| UK Size | Bust (in) | Waist (in) | Hip (in) | Letter Size |
|---|---|---|---|---|
| 6 | 31 | 24 | 34 | XS |
| 8 | 32 | 25 | 35 | XS |
| 10 | 33 | 26 | 36 | S |
| 12 | 35 | 28 | 38 | M |
| 14 | 37 | 30 | 40 | L |
| 16 | 39 | 32 | 42 | L |
| 18 | 41 | 34 | 44 | XL |
| 20 | 43 | 36 | 46 | XL |
| 22 | 45 | 38 | 48 | XXL |
| 24 | 47 | 40 | 50 | XXL |

Reason this exists as its own file: this data is unverified, unlike most other fixed data in this project. Keeping it isolated means it can be replaced with a confirmed source later by editing one file, without touching the size filter logic, the listing form, or any other part of the codebase that reads from it.