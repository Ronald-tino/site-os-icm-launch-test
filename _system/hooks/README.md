---
title: "Governance hooks"
type: reference
updated: 2026-09-29
summary: "Mechanical backstops for conventions.md sections 7 and 8, installed via git core.hooksPath."
---

# Governance hooks

Three git hooks, installed by `site-setup/GUIDE.md` at setup time:

- `pre-commit`: blocks a commit that introduces a raw hex color value outside `docs/design-tokens.md` (section 8, token drift).
- `pre-merge-commit`: the same check for a merge made with `git merge`, which git runs instead of `pre-commit` (both use `lib-check-tokens.sh`).
- `pre-push`: blocks a direct push to `main` or `master` from this checkout (section 7, publishing boundary).

## No-build-tool stacks (plain HTML/CSS)

`pre-commit` only ever exempts a file listed in `_system/token-drift-allowlist.txt`, and that file is meant to hold something mechanically GENERATED from `docs/design-tokens.md`. A plain HTML/CSS project with no build step has no such file: the stylesheet is hand-authored and must contain the real values somewhere. A first live walk test against this exact stack (2026-09-24) hit this directly and had to allowlist its entire stylesheet as a one-off exception, which silently stops the check for all of that file's other styling too, not just its color values.

Fixed at the source, not just documented: `site-setup/GUIDE.md` step 2b now has the agent create one small, dedicated file (for CSS, `site/css/tokens.css`) containing only variable definitions copied verbatim from `docs/design-tokens.md`, and only that file goes in the allowlist. Every other stylesheet references those variables and is never allowlisted, so `pre-commit` keeps checking it. See `_system/token-drift-allowlist.txt`'s own header comment for the exact rule.

## Gallery direction files

`docs/design-direction.md` and anything under `docs/direction/` (written when a direction is picked from the kit gallery at setup) describe color by role and in words only, never by value (`_system/conventions.md` section 8). No hook logic changed for them: the existing 6- and 8-digit check already covers `.md` files. Never add either path to `_system/token-drift-allowlist.txt`. The client preview rendered at setup lives in `docs/direction/.preview/`, which is git-ignored, so its real color values never reach a commit at all.

## Why hooks, not just the rulebook

Sections 7 and 8 of `_system/conventions.md` were, until 2026-09-23, prose only: an agent had to choose to follow them, and one of the two (token drift) had already failed for real, with no adversary involved, in the live project this kit was extracted from. These hooks turn "the agent chooses not to" into "the checkout mechanically refuses," for the two properties this kit calls load-bearing.

## Installation

`git config core.hooksPath _system/hooks` (done by `site-setup/GUIDE.md` at initial setup, and reconfirmed by `site-ops/GUIDE.md` at the start of maintain mode, since a fresh clone does not carry this setting) plus making the scripts executable (`chmod +x _system/hooks/pre-commit _system/hooks/pre-push _system/hooks/pre-merge-commit`), and recording that in git (`git update-index --chmod=+x` on the same three files, then check `git ls-files -s _system/hooks` shows `100755`). The second step matters on a drive where git ignores file modes (Windows, OneDrive; `core.fileMode=false`): without it, a clone gets the hooks as plain files and git skips them without a word. The scripts are then version-controlled like any other file in the repo, unlike the default `.git/hooks/`, which is not tracked and does not survive a clone.

## What was found and fixed during independent testing (2026-09-23)

An adversarial review found two real bugs in the original version of these hooks, both fixed here, not just documented around:

- **A commit that renamed a file and edited it in the same step bypassed the token check entirely.** The original check used `git diff --cached --name-only --diff-filter=ACM`, which excludes renamed (`R`) entries; a plain refactor (`git mv old new` plus an edit) could introduce a raw hex with zero block. Fixed: the filter is gone; the existing file-existence guard already skips genuine deletions.
- **A merge commit was never checked at all.** Git fires `pre-merge-commit`, not `pre-commit`, for a commit created by `git merge`. Fixed: `pre-merge-commit` now exists and runs the same check (see `lib-check-tokens.sh`, shared by both).
- **A bare 3-hex-digit string (`#add`, `#fad`) false-positived on ordinary markdown anchors and CSS id selectors**, with no documented remedy, which risked training a user toward `--no-verify` or an over-broad allowlist entry, the two things that most weaken this hook. Fixed: the 3-digit form is now only checked inside recognized style/markup files (`.css`, `.scss`, `.sass`, `.less`, `.html`, `.htm`, `.jsx`, `.tsx`, `.vue`, `.svelte`); the 6- and 8-digit forms are still checked everywhere, since they essentially never occur by coincidence.
- **An allowlist file whose last line had no trailing newline silently dropped that line.** Fixed: the read loop no longer requires a trailing newline.

## Limits, stated plainly

- **These are local checkout backstops, not server-side enforcement.** Real branch protection on the actual hosting remote is a separate step once one exists; these hooks do not replace it.
- **`--no-verify` on any hook skips it entirely**, on both commit and push. This is the most reachable bypass and the only one that at least announces itself in the command.
- **A checkout that never had `core.hooksPath` set has no protection at all**, silently: a fresh `git clone` does not inherit this setting (it lives in the untracked `.git/config`, not in any tracked file), so a second checkout of the same repo is unprotected until someone runs the config command again. `site-ops/GUIDE.md` reconfirms this at the start of maintain mode for exactly this reason, but a build-mode session on a brand-new clone is not automatically re-checked.
- **A one-line override on an already-configured checkout defeats all three hooks with no second clone needed**: `git -c core.hooksPath=/some/empty/dir push ...` (or the equivalent for commit) skips the hook silently, from the same directory the hook is "installed" in, no `--no-verify` flag and no distinguishable second working copy required.
- **`git send-pack`, used directly instead of `git push`, bypasses `pre-push` entirely**, including a forced update straight onto `main`, with no hook output and no `--no-verify` needed. Git only invokes the client-side pre-push hook from the `git push` porcelain command, not from lower-level plumbing.
- **A local `git merge` that fast-forwards (no merge commit created) never triggers `pre-merge-commit` at all.** Git only fires that hook when it actually creates a merge commit; a fast-forward is a ref update with no commit of its own, so a hex-bearing branch merged this way brings its content onto the current branch with zero token-drift check. Combined with `pre-push` (which still blocks pushing the result to `main`/`master`), this is contained on push, but a purely local checkout that never pushes has no check at that step.
- **`pre-push` recognizes only the literal branch names `main` and `master`.** A repo using a different default branch name (`trunk`, `production`, ...) needs that name added to the `protected_branches` list in the hook itself; nothing detects this automatically.
- **`pre-commit`'s hex-literal check is a grep-based heuristic, not a full CSS/design-system parser.** It will not catch an `rgb()`/`hsl()` triplet, a named CSS color (`steelblue`), a value split across a template literal or string concatenation, or a hex literal with internal whitespace. Treat it as a backstop for the common, accidental failure mode (a value typed straight into code instead of the token file), not a guarantee against a deliberate attempt to evade it.
- **A very broad allowlist glob (for example `*.css`) crosses directory boundaries**, since the allowlist is matched with shell `case` globbing, not gitignore-style path matching. A glob that is broader than intended can silently stop checking far more of the codebase than meant. Keep allowlist entries as specific, real generated-file paths, not broad extension globs.
- **Editing this rulebook or its hooks to remove or weaken a check is itself a DECISION per `_system/conventions.md` section 9**: it must be a deliberate, logged choice, never a silent edit made mid-task to get past a blocked commit or push.

## What this does not attempt

Cherry-pick, rebase, and `git apply`/`am` paths were not tested and may have their own hook-invocation quirks; a hosting platform's own web-based file editor is entirely outside what a local git hook can ever see. Treat this as coverage for the ordinary local-commit and local-push path, not an exhaustive account of every way content reaches a repo.
