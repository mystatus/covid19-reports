#!/bin/bash

cd covid19-reports-server || exit
./run-tests.sh "$@"
