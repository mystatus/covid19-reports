#!/bin/bash

database_exists() {
  if psql -h "$SQL_HOST" -p "$SQL_PORT" -U "$SQL_USER" -lqt | cut -d \| -f 1 | grep -qw "$SQL_DATABASE"; then
    echo "1"
  fi
}

drop_connections() {
  echo -n "Terminating connections..."
  psql -h "$SQL_HOST" -p "$SQL_PORT" -U "$SQL_USER" -c "select pg_terminate_backend(pid) from pg_stat_activity where datname='$SQL_DATABASE'";
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
  # drop_connections

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
