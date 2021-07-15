#!/bin/bash

cd server || exit
./run-tests.sh "$@"
