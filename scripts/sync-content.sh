#!/usr/bin/env bash
# sync-content.sh — Copy .md files from Obsidian vault raw/ to content/
# This is run by the pre-commit hook to ensure content files are always
# in the repo (not symlinks) for deployment.
#
# Usage: bash scripts/sync-content.sh
# Called automatically by .git/hooks/pre-commit

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
CONTENT_DIR="$REPO_ROOT/content"
VAULT_RAW="/home/mtkagent/workspace/agent-obsidian-vault/raw"

if [[ ! -d "$VAULT_RAW" ]]; then
  echo "⚠️  WARNING: Obsidian vault raw/ directory not found at $VAULT_RAW"
  echo "   Content will not be synced. Symlinks will be committed as-is."
  exit 0
fi

# Remove all old content files (both symlinks and regular files)
# Keep .gitkeep and index.md
find "$CONTENT_DIR" -maxdepth 1 -type l -delete 2>/dev/null || true

# Copy new content files from vault
copied=0
skipped=0
for md_file in "$VAULT_RAW"/*.md; do
  [[ -f "$md_file" ]] || continue
  
  filename="$(basename "$md_file")"
  
  # Skip index.md — it's special (the landing page)
  if [[ "$filename" == "index.md" ]]; then
    continue
  fi
  
  dest="$CONTENT_DIR/$filename"
  
  # Check if file actually changed
  if [[ -f "$dest" ]] && cmp -s "$md_file" "$dest"; then
    skipped=$((skipped + 1))
    continue
  fi
  
  cp "$md_file" "$dest"
  echo "  ✅ Synced: $filename"
  copied=$((copied + 1))
done

echo ""
echo "Sync complete: $copied copied, $skipped unchanged"

if [[ $copied -gt 0 ]]; then
  echo ""
  echo "⚠️  Content files were updated. They will be included in the next commit."
  echo "   Run: git add content/*.md"
  exit 1  # Signal that files changed (pre-commit should catch this)
fi

exit 0
