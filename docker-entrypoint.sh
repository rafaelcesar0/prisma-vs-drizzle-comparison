#!/usr/bin/env bash
set -euo pipefail

echo ">> Applying Drizzle schema..."
bun run drizzle:push

echo ">> Starting Next.js..."
exec bun run start
