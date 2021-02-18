#!/bin/bash

LOG_LEVEL="test"

while [[ "$#" -gt 0 ]]; do
  case $1 in
  --debug)
    LOG_LEVEL="debug"
    shift
    ;;
  esac
  shift
done

export NODE_ENV="test"
export SYNC_DATABASE="false"
export SQL_DATABASE="dds_test"
export LOG_LEVEL="$LOG_LEVEL"
export SQL_HOST=${SQL_HOST:=localhost}
export SQL_PORT=${SQL_PORT:=5432}
export SQL_USER=${SQL_USER:=postgres}
export SQL_PASSWORD=${SQL_PASSWORD:=postgres}
export PGPASSWORD=$SQL_PASSWORD

# Create test database if it doesn't exist.
if ! psql -h "$SQL_HOST" -p "$SQL_PORT" -U "$SQL_USER" -lqt | cut -d \| -f 1 | grep -qw "$SQL_DATABASE"; then
  echo -n "Creating '$SQL_DATABASE' database... "
  createdb -h "$SQL_HOST" -p "$SQL_PORT" -U "$SQL_USER" "$SQL_DATABASE" || {
    echo "failed to create '$SQL_DATABASE' database. Aborting..."
    exit
  }
  echo "success!"
fi

../migration-run.sh
npx --silent ts-mocha \
  --project "tsconfig.json" \
  --config "./.mocharc.yml" \
  --exit \
  "./**/*.spec.ts"
