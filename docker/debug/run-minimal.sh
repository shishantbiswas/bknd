#!/bin/bash

# Build the minimal Alpine image with Node.js
docker build -f Dockerfile.minimal -t userbase-minimal .

# Run the container with the whole app/src directory mapped
docker run -it --rm \
  -v "$(pwd)/../app:/app/app" \
  -w /app \
  -p 1337:1337 \
  userbase-minimal

