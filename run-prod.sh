#!/bin/bash

export NODE_ENV=production

yarn run migration-run

node ./build/app.js
