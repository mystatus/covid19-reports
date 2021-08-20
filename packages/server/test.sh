#!/bin/bash

source utils.sh

LOG_LEVEL="test"
CLEAN=false
TYPE='-r tsconfig-paths/register "**/*.it.ts" -r tsconfig-paths/register "**/*.spec.ts"'

while [[ "$#" -gt 0 ]]; do
  case $1 in
    --debug)
      LOG_LEVEL="debug"
      ;;
    --clean)
      CLEAN=true
      ;;
    "--it" | "--spec")
      VAR=${1:2}
      TYPE="-r tsconfig-paths/register \"**/*.$VAR.ts\""
  esac
  shift
done

# Start a docker container for Postgres if there isn't aready one
database_unittest "start"

export NODE_ENV="test"
export SYNC_DATABASE="false"
export SQL_DATABASE="dds_test"
export LOG_LEVEL="$LOG_LEVEL"
export SQL_HOST=${SQL_HOST:=localhost}
export SQL_PORT=${SQL_PORT:=5432}
export SQL_USER=${SQL_USER:=postgres}
export SQL_PASSWORD=${SQL_PASSWORD:=postgres}
export PGPASSWORD=$SQL_PASSWORD
export TYPEORM_CACHE=false

# If the clean flag is passed in, drop the database to start fresh.
if $CLEAN; then
  if [[ "$(database_exists)" ]]; then
    drop_database
  fi
fi

# Create test database if it doesn't exist.
if ! [[ "$(database_exists)" ]]; then
  create_database
  ./migration-run.sh
fi

# seeding DB takes too long when SQL debug is turned on
# resulting in mocha time out hence the ----timeout parameter
npx ts-mocha \
  --project "tsconfig.json" \
  --config ".mocharc.yml" \
  --exit \
  ----timeout 20000 \
  $TYPE 2> /dev/null
TEST_EXIT_CODE=$?

database_unittest "stop"

exit $TEST_EXIT_CODE