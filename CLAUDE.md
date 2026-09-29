# Linden Family Dental (launch test): Map

A throwaway test site for the kit's site-launch guide: a fictional family dental practice.

This repo holds only what an AI agent and a developer need to build and then maintain the site. Business strategy, brand voice, and client-specific facts live in a separate reference vault outside this repo (for example a My Win-Win OS instance's `01_dna/`); link to it below, do not copy it in.

Rulebook: `_system/conventions.md`. In case of conflict, the rulebook wins.

## Where things live

| Room | Holds | Contract |
|---|---|---|
| `site/` | The actual code | `site/CONTEXT.md` |
| `docs/` | Design tokens and technical reference | `docs/CONTEXT.md` |
| `tasks/` | Build mode: what is being built now | `tasks/CONTEXT.md` |
| `ops/` | Maintain mode: what changed after launch | `ops/CONTEXT.md` |

Reference vault (business facts, brand voice): none: fictional test business, nothing here is a real fact

## Route by what just happened

| If | Go to |
|---|---|
| `tasks/build-plan.md` has open items | `tasks/CONTEXT.md`, work the plan |
| every build item is closed except going live, or the site has no remote or host yet | run the kit's `blueprints/site-launch/GUIDE.md`: the agent prepares, the human publishes |
| `tasks/build-plan.md` shows zero open items and the site is live | `ops/CONTEXT.md`: you are in maintain mode now. If `ops/` does not exist yet, run the kit's `blueprints/site-ops/GUIDE.md` first |
| touching a color, font, or spacing value | `docs/design-tokens.md` is binding: never introduce a value that is not there |
| adding a section or changing a layout | `docs/design-direction.md`: keep the direction's kept layers and signature element; nothing inherited without a reason |
| a fact about the business (price, stat, testimonial, claim) | it must come from the reference vault above, as stated there, or be asked for: never invented, never worked out from other facts (`_system/conventions.md` section 4) |
| asked for status | scan `tasks/build-plan.md` (build) or `ops/changelog.md` (maintain) |

## The one rule

Nothing an agent writes reaches a real visitor without a human APPROVAL gate: a task's output in build mode, a changelog entry's diff in maintain mode.
