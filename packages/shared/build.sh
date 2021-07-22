#!/bin/bash

export NODE_OPTIONS="--max-old-space-size=4096"

echo -e "\nBuilding shared..."

./clean.sh
tsc -b tsconfig.build.json

echo "Shared build complete!"
