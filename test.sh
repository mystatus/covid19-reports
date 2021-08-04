#!/bin/bash

PACKAGES=('shared' 'server')

for PACKAGE in "${PACKAGES[@]}"
do
  yarn "$PACKAGE" test "$@"
done