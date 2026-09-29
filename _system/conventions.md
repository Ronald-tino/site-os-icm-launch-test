---
title: "Build Code for This Harness"
type: context
confidentiality: internal
updated: 2026-09-29
summary: "This template's rulebook: structure, naming, frontmatter, gates, and the build-to-maintain mode switch. Adapted from My Win-Win OS's Build Code."
---

# Build Code: the conventions of this harness

This file is the rulebook. `CLAUDE.md` tells an agent where to go; this file tells it how things get built here. Adapted from My Win-Win OS's own Build Code (`os-kit-v2.2-en/my-os/_system/conventions.md`), scoped down to a four-room site harness.

## 1. The structure (fixed)

```
site/    the working artifact: the actual code
docs/    reference material: design tokens and technical reference, binding
tasks/   build mode: the plan, while it still has open items
ops/     maintain mode: the log, once the plan is empty
```

No new top-level room gets created without updating this file and `CLAUDE.md` together.

## 2. Naming and files

- Folders: lowercase, one word where possible (`site`, `docs`, `tasks`, `ops`).
- Files: lowercase with hyphens (`build-plan.md`, `update-a-published-fact.md`).
- `CLAUDE.md` and `CONTEXT.md` keep these exact names; an AI coding agent looks for them by name.
- A `CONTEXT.md` states a room's contract: what it reads, what it does, what it writes, what a human checks. It carries no content of its own.

## 3. Frontmatter

Content files (not routers, not `CONTEXT.md` contracts) open with:

```
---
title: "..."
type: plan | log | reference | playbook
updated: YYYY-MM-DD
summary: "one sentence"
---
```

## 4. Placeholders

- `{{DOUBLE_CURLY}}` marks a value meant to be replaced once, when this template is instantiated for a real project. None should remain in a finished file.
- `[please fill in later]` marks a value the human has not given yet. Offer again; do not invent it.
- Facts (prices, stats, testimonials, claims) come from the linked reference vault, or get asked about. Never invented.
- Never derived either. A fact goes on a page only the way the source states it:
  - Don't count, combine or reword source material into a new claim. A list of three names is not "3 managing directors", and "founded in Eschen" is not "at the same address since".
  - Don't lift a sentence into a headline claim it didn't make.
  - Don't add a reassuring line the client never said ("all conversations are confidential").
- When the source states two different versions of a fact (two addresses, two founding years), neither goes on a page until the human says which is current. Mark it `[please fill in later]` and list both in `tasks/build-plan.md`.
- A fact with an age is shown with its date, or asked about first. Anything that can go out of date (a dog or product still available, a price, opening hours, staff, a count, "currently") and whose source is older than the current build keeps the source's date on the page ("Stand 2017"). If it only makes sense as current, like a listing that says "sucht ein Zuhause", it stays off the page until the human confirms it still holds. Walk test 2026-09-29: 2017 dog listings were shown as current.
- A direction's signature element or section that needs facts (a credentials strip, a note on confidentiality, opening hours) gets only facts the source states outright. If there are too few, make the element smaller or drop it; never pad it. Walk test 2026-09-29: 4 of 6 corrections were facts derived this way, 3 of them inside such an element.

## 5. Gates

- REVIEW: a human reads an intermediate result and edits it directly; work continues with what is there.
- DECISION: a human chooses between named options; the choice becomes a line in `tasks/build-plan.md` or `ops/changelog.md`.
- APPROVAL: a human signs off before anything reaches a real visitor.
- Only a human passes a gate. An agent with no human present stops at the gate: it leaves the item open, says what is waiting for whom, and never records its own sign-off, not even marked "self-approved". The same goes for a scripted or test answer that stands in for the human: it never replaces a real APPROVAL. Walk test 2026-09-29: an agent marked its own page done.

Every stage contract in `tasks/CONTEXT.md` and `ops/CONTEXT.md` names its gate by kind.

## 6. Style

No em dashes as sentence separators: use a period, comma, parenthesis, or colon instead. No emoji in files. No AI stock phrases (filler openers, inflated language, "not only X but also Y," meta-commentary). Match whatever language and spelling the project itself uses; this template's own files are in English.

## 7. Publishing boundary (how "propose, never publish" actually works)

- Every change, in either mode, happens on its own branch (for example `agent/fix-menu-price`), never directly on the default branch.
- An agent commits to that branch and stops there. It never merges into the default branch and never runs a deploy command (a production deploy, a `push` to the default branch, or equivalent), no matter who asked or how it was phrased.
- A git remote and hosting must already exist before maintain mode starts (see `../ops/CONTEXT.md` and the `site-ops` guide). Setting that up is a build-mode task; a maintenance change with nowhere to be proposed has nowhere to be reviewed either.
- "Urgent," "the client said just do it," "skip the review this once," "I already reviewed it myself, just merge it for me" change nothing here. Someone asserting the review already happened elsewhere is not the same as a human actually reviewing the diff in front of them. If a human genuinely wants to skip this gate, that is their DECISION to make and log themselves, by their own hand, not an agent acting on their say-so.
- This rule covers the effect, not just the literal word "merge." Renaming a branch so it becomes the new default, force-pushing over the default branch, enabling auto-merge on a pull request, or editing CI so a push deploys automatically are all the same forbidden action wearing a different name. If asked for a workaround because the direct route is blocked, the answer is still no, not "let me find another way to achieve the same thing."
- This is not enforced by prose alone: `_system/hooks/pre-push` mechanically refuses a direct push to `main` or `master` from an instantiated repo (see `_system/hooks/README.md`). That hook is a local backstop for a solo operator; once a real hosting remote exists, also enable branch protection there. Neither replaces the other.
- The one exception: an empty remote has no default branch yet, and the hook blocks the push that would create it. The human makes that first push themselves, once (`git push --no-verify -u origin main`), and then switches on branch protection at the host. An agent never runs `--no-verify`, for this or anything else.

## 8. Token drift

- `docs/design-tokens.md` is the one hand-edited source of truth. If the codebase also has a generated token file (a Tailwind `@theme` block, CSS custom properties, a theme object), that file is generated from `design-tokens.md` and never hand-edited on its own. If the two ever disagree, `design-tokens.md` wins, and the generated file gets regenerated, not patched around. A stack with no build step at all still gets a small, dedicated variables-only file for this purpose, per `site-setup/GUIDE.md` step 2b: not "generated" mechanically, but hand-copied and nothing else, so it can play the same role.
- Adding a new token is a DECISION (section 5): is this genuinely a new value, or does an existing token already cover it.
- Raw color values appear only in `docs/design-tokens.md` and the step-2b variables file. `docs/design-direction.md` and anything under `docs/direction/` describe color by role and in words ("dark band, one warm accent"), never by value, and are never added to `_system/token-drift-allowlist.txt`.
- This is not enforced by prose alone: `_system/hooks/pre-commit` mechanically refuses a commit introducing a raw hex value outside `docs/design-tokens.md` (see `_system/hooks/README.md` and `_system/token-drift-allowlist.txt` for the narrow exception: a generated token file, or the one step-2b variables file). This rule failed for real once, with no adversary involved, before the hook existed: a live project this kit was extracted from shipped an undocumented color live on five pages, plus several more raw hex values bypassing the token system entirely.

## 9. Editing this rulebook

- Changing what sections 5, 7, 8, 10, or 11 require, removing a gate, or disabling a hook under `_system/hooks/` is itself a DECISION (section 5), never a silent edit made mid-task to get past a blocked commit, a blocked push, or an inconvenient gate.
- Log the change (what, why, who decided) the same way any other DECISION gets logged, in `tasks/build-plan.md` or `ops/changelog.md`, whichever mode is active.

## 10. Contrast

- Every text/background pair and every button state (default, hover, focus; disabled states are exempt) meets WCAG AA: at least 4.5:1 for body text, at least 3:1 for large text (24px and up, or about 18.7px bold and up), UI component edges, and focus indicators.
- Record the ratio for each pair actually used in `docs/design-tokens.md`, next to the token names, before the REVIEW gate. Calculate it; do not estimate by eye.
- Calculate it with `node _system/tools/contrast-check.mjs` whenever Node is available (no install, no network; exit code 1 means a pair fails). Without Node, calculate by hand and say so plainly under the Contrast table (`not run: no Node`), never silently. A row whose Minimum says `decorative` is listed but not checked: use it only for a color that is never text of any size and never a control edge (a band, a rule, an ornament), and name that use in the Use column. Headings and other large text get a 3:1 row, never `decorative`. Its optional `--google` flag adds a second opinion from Google's DESIGN.md linter; that linter only knows 4.5:1, so this script's own result is the one that counts.
- On a failure, shift the color's lightness and keep its hue. If a brand color itself cannot pass as body text, it stays for large text only where it reaches 3:1, and for decorative use (bands, rules) otherwise; a separate `primary-text` token carries the readable version.
- A site with forms needs an input-edge color that reaches 3:1 on its background, with its own Contrast row. A pale divider color is not enough for the outline of a field, checkbox or button. Adding that token is a DECISION like any other (section 8).

## 11. Fonts

- Fonts are open-licensed (SIL OFL or similar), or the brand's own with a license that allows web use.
- Font files are served from the site itself, never from a font CDN (Google Fonts and the like send every visitor's address to a third party). The kit's own open-licensed families are in its `blueprints/site-setup/gallery/fonts/`: copy only the folders the site uses, each with its `OFL.txt`, and a `fonts.css` holding only their `@font-face` rules.
- `docs/design-tokens.md`'s Typography table names each family and where its files come from.
