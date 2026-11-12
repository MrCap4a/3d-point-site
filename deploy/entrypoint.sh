#!/bin/sh
set -eu
[ "$DATABASE_URL" = 'file:/app/data/dev.db' ] || exit 1
[ -s /app/data/dev.db ] || { echo 'Import production database before starting' >&2; exit 1; }
[ -w /app/data ] && [ -d /app/uploads ] && [ -w /app/uploads ]
./node_modules/.bin/prisma migrate deploy
exec npm start
