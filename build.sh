#!/bin/bash

export NODE_OPTIONS="--max-old-space-size=4096"

# Clean
rm -rf ./build
mkdir ./build

# Server
cd server || exit
./build.sh
cd ..

mv ./server/build/* ./build
rmdir ./server/build

# Client
cd client || exit
./build.sh
cd ..

mv ./client/build/* ./build
rmdir ./client/build
