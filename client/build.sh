#!/bin/bash

export NODE_OPTIONS="--max-old-space-size=4096"

echo "Building client..."

npx craco build
mkdir ./build/public
mv ./build/*.* ./build/public
mv ./build/static ./build/public/static

echo "Client build complete!"
echo ""
