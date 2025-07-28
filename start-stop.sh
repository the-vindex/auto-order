#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Default environment file
ENV_FILE="production.env"
COMPOSE_FILE="docker-compose.prod.yml"
PUSH=true
START=true

# Read script parameters:
# --test or --prod determines env file we will use
# --stop stops and skips start
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --test) ENV_FILE="test.env"; COMPOSE_FILE="docker-compose.prod.yml"; shift ;;
        --prod) ENV_FILE="production.env"; COMPOSE_FILE="docker-compose.prod.gcp.yml"; shift ;;
        --stop) START=false; shift ;;
        --help) echo "Usage: $0 [--test | --prod] [--stop]"; exit 0 ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
done

# Some logging
echo "Using environment file: $ENV_FILE"
echo "Using docker compose file: $COMPOSE_FILE"


docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" down

if [ "$START" = true ]; then
    docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up --build -d
else
    echo "Skipping start of the containers."
fi

