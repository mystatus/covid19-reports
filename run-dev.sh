#!/bin/bash

concurrently \
  --kill-others-on-fail \
  --names server,client \
  --prefix-colors green,blue \
  "./run-dev-server.sh" \
  "./run-dev-client.sh"
