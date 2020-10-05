#!/bin/bash

export NODE_ENV=development
export SYNC_DATABASE=true

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
DB_NAME="dds"

read -r -p "Are you sure? This will delete existing data in your local dds database. [y/N] " response
case "$response" in
    [yY][eE][sS]|[yY])
        if [ "$( psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" )" = '1' ]; then
          dropdb dds || { echo "Failed to drop dds database. You may still have an open connection."; exit; }
          echo "Dropped existing dds database"
        fi

        createdb dds
        echo "Created dds database"

        cd "$DIR/server" || { echo "Failed to change directory."; exit; }

        ts-node ./sqldb/seed-dev.ts
        ;;
    *)
        echo "Aborted"
        ;;
esac
