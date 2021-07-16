#!/bin/bash

rm -rf ./build
rm -f ./*.tsbuildinfo

cd client || exit
./clean.sh
cd ..

cd server || exit
./clean.sh
cd ..

cd shared || exit
./clean.sh
cd ..
