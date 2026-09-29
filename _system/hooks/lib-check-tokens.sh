#!/usr/bin/env bash
# Shared token-drift check, used by both pre-commit and pre-merge-commit.
# Git fires a different hook for a merge created by `git merge`
# (pre-merge-commit, not pre-commit), so both entry points source this file
# rather than duplicating the logic.

check_token_drift() {
  local ALLOWLIST_FILE="_system/token-drift-allowlist.txt"
  local FULL_HEX='#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{8}\b'
  local SHORT_HEX='#[0-9a-fA-F]{3}\b'
  local STYLE_EXTENSIONS='\.(css|scss|sass|less|html|htm|jsx|tsx|vue|svelte)$'

  local allowed_paths=("docs/design-tokens.md")
  if [ -f "$ALLOWLIST_FILE" ]; then
    while IFS= read -r line || [ -n "$line" ]; do
      line="$(echo "$line" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
      [ -z "$line" ] && continue
      case "$line" in \#*) continue ;; esac
      allowed_paths+=("$line")
    done < "$ALLOWLIST_FILE"
  fi

  is_allowed() {
    local file="$1"
    for pattern in "${allowed_paths[@]}"; do
      case "$file" in
        $pattern) return 0 ;;
      esac
    done
    return 1
  }

  local violations=""
  # No --diff-filter: a commit that renames AND edits a file in one step must
  # still be checked at its new path, not silently skipped because it isn't
  # a plain Added/Copied/Modified entry.
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    [ -f "$file" ] || continue
    is_allowed "$file" && continue

    # A bare 3-hex string ("#add", "#fad") collides with ordinary markdown
    # anchors and id selectors too often to be worth flagging outside an
    # actual style/markup file; the 6- and 8-digit forms are checked
    # everywhere, since they essentially never occur by coincidence.
    local pattern="$FULL_HEX"
    if [[ "$file" =~ $STYLE_EXTENSIONS ]]; then
      pattern="$FULL_HEX|$SHORT_HEX"
    fi

    local hits
    hits="$(git diff --cached -- "$file" | grep -E '^\+' | grep -Ev '^\+\+\+' | grep -E "$pattern" || true)"
    if [ -n "$hits" ]; then
      violations="${violations}
${file}:
${hits}
"
    fi
  done < <(git diff --cached --name-only)

  if [ -n "$violations" ]; then
    echo "COMMIT BLOCKED: raw hex color value(s) found outside docs/design-tokens.md." >&2
    echo "Per _system/conventions.md section 8, tokens are binding." >&2
    echo "Either move the value into docs/design-tokens.md, or, if this file is" >&2
    echo "mechanically generated FROM design-tokens.md, add its path to" >&2
    echo "$ALLOWLIST_FILE (never for a hand-authored file)." >&2
    echo "If this fired on something that is not actually a color (a markdown" >&2
    echo "anchor, a CSS id selector, a short string that happens to be valid" >&2
    echo "hex), rename it to dodge the collision rather than allowlisting the" >&2
    echo "file: an allowlist entry stops checking that whole path, not just" >&2
    echo "this one line, and a broad glob can silently stop checking far more" >&2
    echo "than intended." >&2
    echo "$violations" >&2
    return 1
  fi
  return 0
}
