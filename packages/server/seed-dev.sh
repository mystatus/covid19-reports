#!/bin/bash

source utils.sh

export NODE_ENV=development
export SQL_HOST=${SQL_HOST:=localhost}
export SQL_PORT=${SQL_PORT:=5432}
export SQL_USER=${SQL_USER:=postgres}
export SQL_PASSWORD=${SQL_PASSWORD:=postgres}
export SQL_DATABASE=${SQL_DATABASE:=dds}
export PGPASSWORD=$SQL_PASSWORD


if ! [[ "$(database_exists)" ]]; then
  create_database
fi

./migration-run.sh

./node.sh ./src/sqldb/seed-dev.ts
