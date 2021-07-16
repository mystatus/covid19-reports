#!/bin/bash

export NODE_OPTIONS="--max-old-space-size=4096"

echo -e "\nBuilding client..."

./clean.sh
npx craco build
mkdir ./build/public
mv ./build/*.* ./build/public
mv ./build/static ./build/public/static

echo -e "Client build complete!\n"
