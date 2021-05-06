#!/bin/bash

database_exists() {
  if psql -h "$SQL_HOST" -p "$SQL_PORT" -U "$SQL_USER" -lqt | cut -d \| -f 1 | grep -qw "$SQL_DATABASE"; then
    echo "1"
  fi
}

create_database() {
  echo -n "Creating '$SQL_DATABASE' database... "
  createdb -h "$SQL_HOST" -p "$SQL_PORT" -U "$SQL_USER" "$SQL_DATABASE" || {
    echo "Failed to create '$SQL_DATABASE' database. Aborting..."
    exit
  }
  echo "success!"
}

drop_database() {
  echo -n "Dropping '$SQL_DATABASE' database... "
  dropdb -h "$SQL_HOST" -p "$SQL_PORT" -U "$SQL_USER" "$SQL_DATABASE" || {
    echo "Failed to drop '$SQL_DATABASE' database. Aborting..."
    exit
  }
  echo "success!"
}

dir() {
  cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd
}
