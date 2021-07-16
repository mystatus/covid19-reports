#!/bin/bash

concurrently \
  --kill-others-on-fail \
  --names server,client \
  --prefix-colors green,blue \
  "./dev-server.sh" \
  "./dev-client.sh"
