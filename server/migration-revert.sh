#!/bin/bash

npm run typeorm -- migration:revert --config src/ormconfig.ts
