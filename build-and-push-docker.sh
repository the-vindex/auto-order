#!/bin/bash

# This script builds the frontend and backend Docker images and pushes them
# to the Google Cloud Artifact Registry.
#
# It reads the VITE_API_BASE_URL from the 'production.env' file.

# Exit immediately if a command exits with a non-zero status.
set -e

GCP_PROJECT_ID="balmy-chain-467222-a1"
GCP_REGION="europe-west3" # Change this if your repository is in a different region.
IMAGE_REPO_NAME="auto-order-artifactory"

# Check if the production.env file exists.
if [ ! -f "production.env" ]; then
    echo "Error: production.env file not found."
    echo "Please ensure the configuration file exists in the project root."
    exit 1
fi

# Source environment variables from production.env.
# This makes VITE_API_BASE_URL and other variables available to this script.
export $(grep -v '^#' production.env | xargs)

# --- Image Definitions ---
FRONTEND_IMAGE="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${IMAGE_REPO_NAME}/frontend:latest"
BACKEND_IMAGE="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${IMAGE_REPO_NAME}/backend:latest"

echo "--- Building and Pushing Docker Images ---"
echo "Project ID: ${GCP_PROJECT_ID}"
echo "Frontend Image: ${FRONTEND_IMAGE}"
echo "Backend Image: ${BACKEND_IMAGE}"
echo "API Base URL for Frontend Build: ${VITE_API_BASE_URL}"
echo ""

# --- Build Frontend ---
echo "Building frontend image..."
docker build \
  --build-arg VITE_API_BASE_URL=${VITE_API_BASE_URL} \
  -t $FRONTEND_IMAGE \
  ./react

# --- Build Backend ---
echo "Building backend image..."
docker build -t $BACKEND_IMAGE ./backend

# --- Push Images ---
echo "Pushing frontend image to Artifact Registry..."
docker push $FRONTEND_IMAGE

echo "Pushing backend image to Artifact Registry..."
docker push $BACKEND_IMAGE

echo "---"
echo "✅ Build and push complete!"
