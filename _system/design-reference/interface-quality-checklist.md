---
title: "Interface quality checklist"
type: reference
updated: 2026-09-24
summary: "Accessibility, forms, animation, typography, performance, and interaction checklist. Use while building a page and as a review pass before marking a build item done."
---

# Interface quality checklist

Adapted from Vercel's `web-interface-guidelines` (`github.com/vercel-labs/web-interface-guidelines`), MIT licensed:

> MIT License. Copyright Vercel, Inc. Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, subject to the standard MIT conditions (include this notice in copies; provided "as is," without warranty).

Trimmed and reorganized for a framework-agnostic site: this kit supports plain HTML/CSS with no framework at all, not only a JS framework. Items that only apply when using a JS framework are marked as such; everything else applies regardless of stack.

## Accessibility

- Icon-only buttons need a text alternative (`aria-label` or equivalent)
- Every form control needs a `<label>` (or `aria-label`)
- Interactive custom elements need keyboard handling, not just a click handler
- Use `<button>` for actions, `<a>` for navigation, never a `<div>` with a click handler standing in for either
- Images need `alt` text (or `alt=""` if purely decorative)
- Decorative icons need `aria-hidden="true"`
- Headings are hierarchical (`<h1>`-`<h6>`, no skipped levels); include a skip-to-content link on longer pages
- Use semantic HTML (`<button>`, `<a>`, `<label>`, `<table>`) before reaching for ARIA attributes at all

## Focus states

- Every interactive element needs a visible focus state
- Never remove the default focus outline without providing a replacement
- Prefer `:focus-visible` over `:focus` so a mouse click doesn't show a focus ring unnecessarily

## Color contrast

Not from Vercel's guidelines: added for this kit from WCAG 2.x (level AA). The binding rule is `_system/conventions.md` section 10; this is the review pass.

- Body text on its background: at least 4.5:1. Large text (24px and up, or about 18.7px bold and up): at least 3:1
- UI component edges (input borders, button outlines) and focus indicators: at least 3:1 against what surrounds them
- Check hover and focus states too, not only the resting state: a link that turns lighter on hover can drop below 4.5:1
- Text over an image or a gradient: check at the worst spot, not the average
- Placeholder and "muted" helper text are still text: muted grey that fails 4.5:1 is the most common miss
- Every ratio used is written down in `docs/design-tokens.md`, calculated, not guessed

## Forms

- Inputs use the correct `type` (`email`, `tel`, `url`, `number`) and, where relevant, `autocomplete`
- Labels are clickable (wrap the control, or use `for`/`id`)
- Checkboxes and radios: the label and the control share one hit target, no dead zones between them
- Errors appear inline, next to the field they belong to, not only in a summary at the top
- Placeholder text ends with an ellipsis and shows an example, never stands in for a real label

## Animation

- Honor `prefers-reduced-motion`: provide a reduced variant, or skip the animation entirely, for anyone who has that set
- Animate `transform`/`opacity` where possible (cheap to render), not `width`/`height`/`top`/`left`
- Never transition every property at once; list the specific properties actually changing

## Typography

- Use a true ellipsis character (`…`), not three periods
- Use curly quotes (`"` `"`), not straight ones, in body copy
- Use non-breaking spaces to keep units and short labels together (`10 MB`, not a plain space that can wrap mid-unit)
- A loading state's label ends with an ellipsis: "Loading…", "Saving…"

## Content handling

- Text containers handle long content gracefully (truncate, wrap, or clamp lines), rather than breaking the layout
- Don't render broken-looking UI for an empty string or an empty list; give an empty state its own honest treatment

## Images

- `<img>` has explicit `width` and `height` (or an aspect-ratio) so the layout doesn't jump while it loads
- Below-the-fold images use `loading="lazy"`

## Performance

- Long lists are not rendered as one giant unstyled block; consider pagination or a simpler view on a small static site
- Preconnect to any external font or asset domain the page actually depends on

## Touch and interaction

- `touch-action: manipulation` on interactive elements, to avoid the double-tap-to-zoom delay on mobile
- Buttons and links have a visible hover state, and an increase in contrast on hover/focus/active compared to their resting state

## Dark mode, if the site has one

- Set `color-scheme` on the root element so native form controls and scrollbars follow the theme too
- `<meta name="theme-color">` matches the actual page background in that mode

## Content and copy

- Active voice: "Install the CLI," not "The CLI will be installed"
- Specific button labels: "Save changes," not "Submit" or "Continue"
- Error messages say what happened and what to do next, not just that something went wrong
- Numerals for counts in running text ("8 items"), not spelled out, where it reads more clearly

## Anti-patterns, flag these on sight

- `user-scalable=no` or a fixed `maximum-scale`, disabling pinch-to-zoom
- `outline: none` with no focus-visible replacement
- A `<div>` or `<span>` with a click handler doing a `<button>`'s job
- An image with no explicit dimensions
- A form input with no associated label
- An icon-only button with no accessible name
- An animated GIF where a compressed video would work just as well and cost far less

## JS-framework-specific items (skip entirely for a plain HTML/CSS site)

- Reflect UI state that matters (filters, tabs, open panels) in the URL, so it survives a refresh or a shared link
- Guard against hydration mismatches in anything that renders differently on the server versus the client (dates, random values)
- Prefer uncontrolled inputs where the framework allows it; a controlled input needs to stay cheap on every keystroke
