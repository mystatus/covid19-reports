#!/bin/bash

rm -rf ./build
rm -f ./*.tsbuildinfo

yarn run client clean
yarn run server clean
yarn run shared clean
