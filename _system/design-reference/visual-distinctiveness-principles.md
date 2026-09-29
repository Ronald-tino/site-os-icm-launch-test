---
title: "Visual distinctiveness principles"
type: reference
updated: 2026-09-24
summary: "How to avoid a site looking like a generic AI-generated template. Read before proposing colors/typography/layout, and again while actually building a page."
---

# Visual distinctiveness principles

An original synthesis for this kit; see `README.md` in this folder for provenance. Not a copy of any single proprietary source.

## Ground the design in the actual subject, every time

A coffee shop, a law firm, and a children's toy brand should not converge on the same look. Before proposing anything, name the specific subject matter, audience, and the one job this page needs to do. If a design-intelligence skill or reference library is available in this environment, use it to check what a real match for this specific industry looks like (see `site-setup/GUIDE.md` step 2a), rather than reasoning from a generic sense of "what a nice small-business site looks like."

## Starting from a gallery direction

Starting from a direction picked out of the kit's gallery (see `docs/design-direction.md`) is expected, not a shortcut to apologize for. Most clients cannot describe a design in words; reacting to a sample and adapting it is how they get a good one. Layout skeletons, section order, spacing rhythm, component shapes, and type personality may be reused.

Two things may not:

- **The site must not be interchangeable with another business,** especially one in the same town or trade, or another business that picked the same direction. Swap the names and it should look wrong.
- **Nothing may arrive only because the template had it:** product-UI sections, software-company copy, stock imagery, or any pattern listed below that has no reason specific to this business.

The test is no longer "is this original?" but "is every inherited element earning its place here, and is the brand (colors, voice, the signature element's treatment) unmistakably this client's?"

## Plan before building, and check the plan against the generic default

Before writing any code: name 4-6 specific colors (already required, see `docs/design-tokens.md`), the type roles (heading vs. body, and why), a one-paragraph layout concept, and one sentence on what makes this page's treatment specific to this subject, not swappable with any other small business.

Then ask honestly: would this same plan come out for an unrelated business in the same general category (any coffee shop, any law firm), including another business that picked the same gallery direction? If yes, something in it is a default, not a choice. Revise the part that is generic, name what changed and why, before writing code.

## Concrete patterns that signal "generic AI site," worth deliberately avoiding

These are default treatments, not always wrong, but suspicious when they show up without a reason specific to this project:

- Every card in a grid using the identical border-radius, the identical soft drop shadow, and nothing else to distinguish importance.
- A tracked-out, all-caps label sitting above every section heading regardless of content.
- Meta text joined with a middle dot (`A · B · C`) or a spaced em dash (`Word — fragment`) as a default label style.
- An arrow (`→`) appended to every link or button as a decorative tic, not because it signals actual navigation.
- Numbered markers (01 / 02 / 03) used purely for visual rhythm on content that is not actually a sequence, a process, or a timeline.
- A hero section that is always "big headline, one-line subhead, two buttons," regardless of what the subject's own most characteristic content actually is.
- Fade-and-slide-up entrance animation on every single section, and a hover lift on every single card, as the reflexive default rather than one deliberate, memorable moment.
- One family for everything, chosen because it's the safe default rather than because its personality fits the subject.

These apply to what you inherit from a gallery direction exactly as to what you invent.

None of these are permanently banned; a real brief can call for any of them. The test is whether the choice was made for this subject, or defaulted to because it's what gets reached for on any project.

## Typography carries personality

Pick one or two type families deliberately, tied to what this business actually is (a warm, established feel reads differently from a sharp, modern one), not the safest default. If two families, make their roles clearly distinct (heading vs. body), not interchangeable. Keep line lengths readable (under roughly 80 characters for body text). Avoid leaning on "highlight one word in a different color or weight" as the only way to add emphasis to a headline; it is a crutch, not a design choice, when used on every heading.

## Motion, spent sparingly

One deliberate, orchestrated moment (a single page-load sequence, one meaningful reveal) reads as more considered than scattered hover transitions and fade-ins applied uniformly to every element. Motion that responds to a real user action (opening, confirming, expanding) is welcome; motion that exists just because every section needs "some animation" usually is not.

## Restraint

Spend boldness in one place. Let one element be the memorable thing on a page, and keep everything around it quiet and disciplined rather than competing for attention. Cut any decoration that does not serve the subject.
