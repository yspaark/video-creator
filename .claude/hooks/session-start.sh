#!/bin/bash
set -euo pipefail

cd "$CLAUDE_PROJECT_DIR"

# Install npm deps only if missing or stale, so repeat session starts are fast.
if [ ! -d node_modules ] || [ package.json -nt node_modules ]; then
  npm install
fi
