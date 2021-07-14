#!/bin/bash

export NODE_OPTIONS="--max-old-space-size=4096"

# Clean
rm -rf ./build
mkdir ./build

# Server
cd covid19-reports-server || exit
./build.sh
cd ..

mv ./covid19-reports-server/build/* ./build
rmdir ./covid19-reports-server/build

# Client
cd covid19-reports-client || exit
./build.sh
cd ..

mv ./covid19-reports-client/build/* ./build
rmdir ./covid19-reports-client/build
