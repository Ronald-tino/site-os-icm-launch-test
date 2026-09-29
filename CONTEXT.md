---
title: "Build Mode, Then Maintain Mode"
type: context
confidentiality: internal
updated: 2026-09-24
summary: "The two-mode contract this harness runs on, and the signal that switches an agent between them."
---

# Linden Family Dental (launch test): build mode, then maintain mode

The flow in one line: build the site against a plan that ends, then keep it correct against a log that does not.

| | Build mode (`tasks/`) | Maintain mode (`ops/`) |
|---|---|---|
| Source of truth | `tasks/build-plan.md`, a checklist with an end | `ops/changelog.md`, a log with no end |
| Unit of work | a page or feature, built once, reviewed once | a fix, update, or bump, logged and dated |
| "Done" means | the checklist item is closed | never done, only current |
| Agent may | implement against a signed-off task | propose a change via pull request or issue |
| Agent may never | publish without a human APPROVAL gate | merge its own change, or invent a fact |
| Switch trigger | (starts here) | `tasks/build-plan.md` shows zero open items |

Factory (stable, applies to both modes): `docs/design-tokens.md`, `docs/design-direction.md`, and whatever reference vault is linked from `CLAUDE.md`.
Product: `site/` in build mode; `site/` plus `ops/changelog.md` in maintain mode.
