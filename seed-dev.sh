#!/bin/bash

source ./utils.sh

export NODE_ENV=development
export SQL_HOST=${SQL_HOST:=localhost}
export SQL_PORT=${SQL_PORT:=5432}
export SQL_USER=${SQL_USER:=postgres}
export SQL_PASSWORD=${SQL_PASSWORD:=postgres}
export SQL_DATABASE=${SQL_DATABASE:=dds}
export PGPASSWORD=$SQL_PASSWORD

read -r -p "Are you sure? This will delete existing data in your local '$SQL_DATABASE' database. [y/N] " response
case "$response" in
  [yY][eE][sS] | [yY])
    if [[ "$(database_exists)" ]]; then
      drop_database
    fi

    if ! [[ "$(database_exists)" ]]; then
      create_database
    fi

    ./migration-run.sh
    npx ts-node --project "$(dir)/server/tsconfig.json" "$(dir)/server/sqldb/seed-dev.ts"
    ;;
  *)
    echo "Aborted"
    ;;
esac
