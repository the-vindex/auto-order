#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Trap to clean up background processes on exit
trap 'kill $(jobs -p); docker-compose -f backend/docker-compose.yml down' EXIT

# Start postgres
echo "Starting postgres..."
docker-compose -f backend/docker-compose.yml up -d

# Start backend
(cd backend && stdbuf -oL npm run dev) | sed -e 's/^/BE | /' &

# Start frontend
(cd react && stdbuf -oL npm run dev) | sed -e 's/^/\x1b[32mFE | /' | sed -e 's/$/\x1b[0m/' &

# Wait for all background processes to complete
wait
