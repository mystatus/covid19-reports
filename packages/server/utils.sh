#!/bin/bash

database_unittest() {
  if [ "$1" = "start" ]; then
    if ! pg_isready -V; then
      echo "You need the Postgres utility, pg_isready, to run this test."
      exit
    fi
    if ! pg_isready -h localhost -p 5432; then
      echo "Starting docker DB..."
      i=0
      docker run -itd --name unittestpg -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres
      while ! pg_isready -h localhost -p 5432; do
        if [ "$i" -le 10 ]; then
          sleep 1
          ((i++))
        else
          echo "Something is wrong with the database.  Aborting..."
          exit
        fi
      done
    fi
  elif [ "$1" = "stop" ]; then
    echo "Stopping docker DB..."
    docker rm -f unittestpg || true
  fi
}

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
