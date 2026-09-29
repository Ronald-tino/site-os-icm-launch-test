---
title: "tasks: build mode contract"
type: context
confidentiality: internal
updated: 2026-09-29
summary: "Turn the plan into the site, one item at a time, until nothing is open."
---

# tasks/: build mode contract

One job: turn the plan into the site, one item at a time, until nothing is open.

## Inputs
- Working (this run): whatever `build-plan.md` names as next.
- Reference (every run): `../docs/design-tokens.md`, `../docs/design-direction.md` and `../docs/direction/` (the gallery direction this site started from and what was changed for this business), `../_system/design-reference/` (visual distinctiveness principles and an interface quality checklist: read these while actually laying out and building a page, not only during setup), and any briefing docs kept in this folder.

Do not load `../ops/`: it is a different mode with a different contract. Do not mix the two while `build-plan.md` still has open items.

## Process
1. Read `build-plan.md`. It is a live document, not a frozen spec: edit it as decisions change.
2. Work items in the order the plan states. If order does not matter, say so in the plan instead of leaving it implicit.
3. If something is blocked on a person (a missing asset, an unanswered question), say so in the plan instead of guessing.

## Outputs
- Code in `../site/`.
- An updated `build-plan.md`, with the item marked closed and any new blockers noted.

## Gate
APPROVAL, before marking an item closed. A human only: with no human present, the item stays open and the agent says it is waiting for approval (`../_system/conventions.md` section 5). The human checks:
- the built page or feature matches what the plan asked for;
- it uses only tokens from `docs/design-tokens.md`, and only facts from the linked reference vault, as stated there, never derived, dated facts showing their date (`../_system/conventions.md` section 4);
- it holds up against `../_system/design-reference/interface-quality-checklist.md` (accessibility, forms, focus states, the rest), not only eyeballed;
- it keeps the direction's kept layers and signature element without sliding back to a generic default, with nothing inherited only because the template had it;
- every color pair it uses passes `../_system/conventions.md` section 10 (a pair not yet in the Contrast table gets a row there and a fresh run of `_system/tools/contrast-check.mjs`), and its fonts follow section 11.

## Exit
When every item in `build-plan.md` is closed except going live, stop reading this folder for new work. If the site has no remote or host yet, the next step is the kit's `blueprints/site-launch/GUIDE.md`. Once it is live, the next task lives in `../ops/CONTEXT.md`; if `../ops/` does not exist yet, run the kit's `blueprints/site-ops/GUIDE.md` first.
