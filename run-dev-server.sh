#!/bin/bash

export NODE_ENV=development

# Load environment variables from .env file
set -o allexport
source .env
set +o allexport

cd covid19-reports-server || exit
./run-dev.sh
