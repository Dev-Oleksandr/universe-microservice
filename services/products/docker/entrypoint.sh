#!/usr/bin/env sh
set -e

# Ждём Postgres (если заданы переменные подключения)
if [ -n "$PGHOST" ]; then
  until pg_isready -h "$BIND_POSTGRES_HOST" -p "${$BIND_POSTGRES_PORT:-5432}" -U "${PGUSER:-postgres}"; do
    echo "Waiting for Postgres at $BIND_POSTGRES_HOST:${$BIND_POSTGRES_PORT:-5432}..."
    sleep 1
  done
fi

echo "Running DB migrations..."
npm run migrate:up

echo "Starting app..."
exec "$@"
