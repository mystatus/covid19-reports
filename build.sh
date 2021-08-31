#!/bin/bash

export NODE_OPTIONS="--max-old-space-size=4096"

./clean.sh
mkdir build

# Server
yarn run server build || exit 1

mv ./packages/server/build/* ./build
rmdir ./packages/server/build

# Client
yarn run client build || exit 1

mv ./packages/client/build/* ./build
rmdir ./packages/client/build
