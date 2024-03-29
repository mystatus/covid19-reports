#!/bin/bash

NAME=$1

if [ -z "$NAME" ]; then
  echo "You must provide a name as the first argument."
  exit
fi

./migration-run.sh
./typeorm.sh migration:generate -n "$NAME"
