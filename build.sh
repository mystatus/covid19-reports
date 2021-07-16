#!/bin/bash

export NODE_OPTIONS="--max-old-space-size=4096"

./clean.sh
mkdir build

# Server
cd server || exit
./build.sh
cd ..

mv ./server/build/* ./build
rmdir ./server/build

# Client
#yarn workspace @covid19-reports/client run build
#mv ./client/build/* ./build
#rmdir ./client/build
