#!/usr/bin/env bash
# sync-content.sh — Sync Obsidian vault raw/ to Quartz content/ using rsync
# Copies new/updated .md files AND removes files that no longer exist in vault.
#
# Usage: bash scripts/sync-content.sh
# Called automatically by .git/hooks/pre-commit

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
CONTENT_DIR="$REPO_ROOT/content"
VAULT_RAW="/home/mtkagent/workspace/agent-obsidian-vault/raw"

# Protected files — never deleted by rsync
EXCLUDE_PROTECTED=(
  "--exclude=index.md"
  "--exclude=.gitkeep"
)

if [[ ! -d "$VAULT_RAW" ]]; then
  echo "⚠️  WARNING: Vault raw/ not found at $VAULT_RAW — skipping sync"
  exit 2
fi

# rsync options:
#   -a       archive mode (preserve permissions, timestamps, etc.)
#   -v       verbose (show what's being done)
#   --delete remove files from dest that don't exist in source
#   --exclude skip protected files from deletion
echo "🔄 Syncing vault → content/ ..."
rsync -av --delete \
  "${EXCLUDE_PROTECTED[@]}" \
  "$VAULT_RAW/" "$CONTENT_DIR/"

echo ""
echo "Sync complete."
