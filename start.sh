#!/bin/bash

export NODE_ENV=production

yarn run server migration-run

node ./build/index.js
