#!/bin/bash

rm -rf ./build
rm -f ./*.tsbuildinfo

yarn workspaces run clean
