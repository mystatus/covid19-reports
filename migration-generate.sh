#!/bin/bash

NAME=$1

if [ -z "$NAME" ]; then
  echo "You must provide a name as the first argument."
  exit
fi

npm run typeorm -- migration:generate -n "$NAME"
