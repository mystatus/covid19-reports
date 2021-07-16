#!/bin/bash

npx ts-node  -r tsconfig-paths/register ./node_modules/.bin/typeorm "$@"
