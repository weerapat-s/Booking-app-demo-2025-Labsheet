#!/bin/sh
set -e

DB_HOST=$(echo "$DATABASE_URL" | sed -E 's|.*@([^:/]+).*|\1|')
DB_PORT=$(echo "$DATABASE_URL" | sed -E 's|.*:([0-9]+)/[^?]*.*|\1|')
DB_PORT=${DB_PORT:-5432}

echo "Waiting for database at ${DB_HOST}:${DB_PORT}..."
MAX_RETRIES=30
RETRIES=0
while ! nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
  RETRIES=$((RETRIES + 1))
  if [ "$RETRIES" -ge "$MAX_RETRIES" ]; then
    echo "Warning: DB readiness check timed out — proceeding anyway"
    break
  fi
  echo "Database unavailable - waiting... ($RETRIES/$MAX_RETRIES)"
  sleep 2
done

echo "Running Prisma migrations..."
npx prisma migrate deploy --schema=prisma/schema.prisma

echo "Starting application..."
exec node server.js
