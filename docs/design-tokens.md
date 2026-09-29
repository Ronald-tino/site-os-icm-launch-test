---
title: "Design tokens"
type: reference
updated: {{YYYY-MM-DD}}
summary: "[please fill in later]"
---

# Design tokens

[please fill in later]. Your color, typography, and spacing values go here. Bring them from your design system, brand DNA, or design file, or work out a complete scheme with the human at setup time. Either way: fill in every row below before building starts. Do not invent a value here, and do not leave a row for "later" either: a color nobody picked up front is a color someone will invent on page twelve.

## Colors

A complete scheme needs more than the 2 or 3 colors someone thinks of as "the brand." Fill in every row that applies to this site; delete a row only if the site genuinely has no dark sections, no cards, etc. This list exists because a project that skips it (a real one, not hypothetical) ended up with a background color used on five live pages and 8 more raw colors in the code, none of them ever written down here.

| Token | Value | Use |
|---|---|---|
| (brand, primary) | | main brand color: headings, primary buttons |
| (brand, secondary or accent) | | a second brand color, if there is one |
| (background, light) | | the page background on light sections |
| (background, dark or surface) | | dark section backgrounds (a hero, a closing CTA, a footer): needed even if it is just a darker shade of a brand color, because someone will need it |
| (text, primary) | | body text color |
| (text, muted) | | secondary or muted text |
| (border) | | dividers, card borders |
| (tint or card background) | | a light neutral shade for cards, subtle highlights, if the site uses any |
| (input edge) | | outline of form fields, checkboxes, outlined buttons: must reach 3:1 on its background; only if the site has forms or outlined controls |

If a direction was picked from the kit gallery at setup, derive these values from it as `site-setup/GUIDE.md` step 2a-ii describes (client brand values first, then this business's adaptations, then the direction's color roles), and record what changed in `design-direction.md`. Never copy a gallery sample's default colors unchanged.

If nobody has a complete scheme yet (no brand colors, only a logo, or the client asks to see options): propose two or three complete, named options, each with every row above filled in, started from the kit's palette presets as `site-setup/GUIDE.md` step 2a-ii describes, not invented from general impressions. The human picks one (a DECISION), rather than leaving this page half-empty and letting whoever builds the first page decide alone.

## Typography

Same rule as Colors, including the same instruction to ground the choice in a real design reference if one is available, not a generic default: fill in every row that applies, or propose 2-3 complete named options at the REVIEW gate if nobody has a preference yet. Delete a row only if the site genuinely has no such use (a one-page site with no distinct heading style, for instance).

| Token | Value | Use |
|---|---|---|
| (heading, font family) | | page and section headings |
| (body, font family) | | paragraph and general text; can be the same family as headings |
| (base size) | | body text size, the scale everything else is relative to |
| (scale ratio or heading sizes) | | how much bigger each heading level is than the last |
| (heading, weight) | | bold vs. regular for headings |
| (body, weight) | | usually regular; note if body text is ever bold by default |
| (font files, source) | | where the files come from: the kit's `gallery/fonts/` folder or the brand's own licensed files, served from the site itself, never a font CDN (`_system/conventions.md` section 11) |

## Spacing

Same rule as Colors and Typography: fill in every row, or propose complete options if nobody has a preference.

| Token | Value | Use |
|---|---|---|
| (base unit) | | the smallest spacing increment everything else is a multiple of (for example 4px or 8px) |
| (small) | | tight spacing: between related inline items |
| (medium) | | the default gap between elements inside one section |
| (large) | | spacing between distinct sections on a page |

## Contrast

Required before the REVIEW gate (`_system/conventions.md` section 10). One row per text/background or button pair the site actually uses. Calculate each ratio (WCAG 2.x formula); do not estimate by eye. AA minimum: 4.5:1 for body text, 3:1 for large text, UI edges, and focus indicators.

Write each row with the exact token names from the Colors table above (or `white` / `black`): replace the parenthesised placeholders in both tables with real token names such as `brand-primary`, and put descriptions in the Use column. Keep only rows for pairs the site really uses: delete a button row if the design has no buttons, and add a row for any other pair it does use. A brand color kept only for decoration (a band, a rule, an ornament: never text of any size, never a control edge) gets `decorative` in its Minimum cell, and such a row is listed, not checked. Headings in the brand color get a checked 3:1 row instead. Then run `node _system/tools/contrast-check.mjs` from the repo root: it calculates every ratio against the row's own Minimum and prints the filled rows to paste back here. If Node is not available, calculate by hand and write `not run: no Node` under this table, so the REVIEW reader knows no tool checked it.

| Foreground token | Background token | Ratio | Minimum | Pass |
|---|---|---|---|---|
| (text, primary) | (background, light) | | 4.5:1 | |
| (text, muted) | (background, light) | | 4.5:1 | |
| (background, light) or white | (background, dark or surface) | | 4.5:1 | |
| (button label) | (brand, primary) | | 4.5:1 | |
| (link, hover state) | (background, light) | | 4.5:1 | |
| (brand, primary) as a large heading | (background, light) | | 3:1 | |

If a brand color cannot pass as body text, keep it for large text where it reaches 3:1 and for decoration otherwise, and add a `primary-text` row to Colors above for the readable version.
