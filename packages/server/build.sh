#!/bin/bash

export NODE_OPTIONS="--max-old-space-size=4096"

echo -e "\nBuilding server..."

./clean.sh
tsc -b tsconfig.build.json

echo -e "Server build complete!\n"
