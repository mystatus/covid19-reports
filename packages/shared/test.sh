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

npx ts-mocha \
  --project "tsconfig.json" \
  --exit \
  $TYPE
