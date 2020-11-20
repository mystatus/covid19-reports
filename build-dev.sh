#!/bin/bash

export NODE_OPTIONS="--max-old-space-size=2048"

rescripts build
mkdir ./build/public
mv ./build/*.* ./build/public
mv ./build/static ./build/public/static

tsc --project ./server
mv ./server/build/* ./build
rmdir ./server/build
