#!/bin/sh
set -e

echo "[entrypoint] Applying database migrations..."
npx prisma migrate deploy

echo "[entrypoint] Seeding admin user / API key (idempotent)..."
npx ts-node prisma/seed.ts || echo "[entrypoint] seed step failed, continuing"

echo "[entrypoint] Starting API..."
exec node dist/src/main.js
