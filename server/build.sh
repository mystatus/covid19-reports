#!/bin/bash

export NODE_OPTIONS="--max-old-space-size=4096"

echo "Building server..."

rm -rf ./build
tsc

echo "Server build complete!"
echo ""
