#!/bin/bash

LOG_LEVEL="test"
CLEAN=false
TYPE='-r tsconfig-paths/register "**/*.it.ts" -r tsconfig-paths/register "**/*.spec.ts"'

while [[ "$#" -gt 0 ]]; do
  case $1 in
    "--it" | "--spec")
      VAR=${1:2}
      TYPE="-r tsconfig-paths/register \"**/*.$VAR.ts\""
  esac
  shift
done

npx ts-mocha \
  --project "tsconfig.json" \
  --exit \
  $TYPE 2> /dev/null

TEST_EXIT_CODE=$?
exit $TEST_EXIT_CODE
