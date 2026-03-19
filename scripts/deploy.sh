#!/bin/bash
# Deploy to production: git add, commit, push to main
# Usage: ./scripts/deploy.sh "your commit message"

set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/deploy.sh \"commit message\""
  exit 1
fi

MSG="$1"

echo "→ Staging all changes..."
git add -A

STAGED=$(git diff --cached --name-only)
if [ -z "$STAGED" ]; then
  echo "Nothing to commit."
  exit 0
fi

echo "→ Committing: $MSG"
git commit -m "$MSG"

echo "→ Pushing to main..."
git push origin main

echo "✓ Deployed: $MSG"
