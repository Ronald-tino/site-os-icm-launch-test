---
title: "docs: reference material"
type: context
confidentiality: internal
updated: 2026-09-24
summary: "Design tokens and technical reference. Binding: nothing in site/ introduces a value not documented here."
---

# docs/: reference material

## What this is
The factory layer: stable across both modes. Design tokens, and whatever technical reference a developer or agent needs to build against without re-deriving it each time.

## What goes here
- `design-tokens.md`: colors, typography, spacing. Binding. An agent in either mode never introduces a value that is not here; it asks, or proposes an addition instead.
- `design-direction.md`: which gallery direction this site started from, what was kept, and what was changed for this business. Binding for layout intent, not for values. Describes color by role and in words only.
- `direction/`: the one chosen direction spec (and its thumbnail) copied from the kit gallery at setup. `direction/.preview/` holds the client preview and is git-ignored.
- Technical reference that does not change per task: API contracts, environment setup, architecture notes.

## What does NOT go here
- Business strategy, brand voice, personas, pricing rationale: reference vault territory, not this repo. (`design-direction.md` records the design consequences of the brand voice, not the voice itself.)
- Anything that changes per task: that is a `tasks/` or `ops/` output, not reference material.

## Gate
DECISION, before adding or changing a token: is this a genuinely new value, or does an existing token already cover it. DECISION, before changing the design direction: it ripples into the tokens and every built page.
