---
title: "Design reference"
type: reference
updated: 2026-09-24
summary: "Embedded, self-contained design guidance so a site doesn't come out looking like a generic AI template, and doesn't come out looking broken either. No external skill, no script, no Python, no network call required."
---

# Design reference

Two files, both read directly, no tooling required:

- `visual-distinctiveness-principles.md`: how to avoid the site looking like a generic AI-generated template. Read this at site-setup, before proposing colors/typography/layout (per `site-setup/GUIDE.md` step 2a-v), and again during build (per `tasks/CONTEXT.md`) when actually laying out a page, not just at setup.
- `interface-quality-checklist.md`: a concrete accessibility, forms, performance, and interaction checklist. Read this while building a page, and use it as a review pass before marking a build item done.

How this relates to the kit's gallery: when a direction was picked from the gallery during setup, `docs/design-direction.md` records what was kept from it and what was changed for this business. These two files still apply in full, to what was inherited from that direction as much as to anything invented.

## Why these exist

Found directly, 2026-09-24: this kit had never actually consulted any design guidance when generating a site, prose or otherwise. Every pilot to date, including a real practice site, came out generic: a plausible-looking but unremarkable palette and layout chosen from general impressions, not from anything grounded. The kit's original fix for this (checking for an external Claude Code skill like `ui-ux-pro-max` in the environment) was real but fragile: that skill's advertised way to run needs Python, which is commonly missing, and when it failed, the process silently fell back to generic choices instead of flagging the gap.

These two files exist so the guidance ships with the kit itself, works with any AI coding agent that can read a repo (this kit's own stated tool-neutral principle), and never depends on whether a specific external skill happens to be installed, or whether Python happens to be available.

## Provenance and licensing, stated plainly

- `visual-distinctiveness-principles.md` is an original synthesis for this kit, informed by publicly observable patterns in AI-generated web design (the kind of generic output multiple design-focused tools and articles independently describe: identical rounded cards, ALL-CAPS eyebrow labels, arrow-suffixed buttons, one default hero template regardless of subject, and so on). It is not a copy of any single proprietary source. One well-known example of a tool addressing this exact problem is Anthropic's own `frontend-design` Claude Code skill; that skill's own text is © Anthropic PBC under Anthropic's Commercial Terms of Service, not an open license, so it is not reproduced here. Only the independently-describable underlying idea (plan a distinctive design before building, name what would make this generic, avoid it) is used.
- `interface-quality-checklist.md` is adapted from Vercel's `web-interface-guidelines` (`github.com/vercel-labs/web-interface-guidelines`), MIT licensed, trimmed and reorganized for a framework-agnostic site (this kit explicitly supports plain HTML/CSS with no framework at all, not only the React/Next.js stack the original guidelines assume throughout). Attribution and MIT terms kept in that file's own header.

## What this does not replace

`ui-ux-pro-max` or any similar external skill, if actually installed and working in a given environment, is still worth checking for extra depth (a specific industry-to-style match, a wider font-pairing library): see `site-setup/GUIDE.md` step 2a. These two embedded files are the floor every instantiation gets regardless of environment, not a ceiling on what a richer environment can add.
