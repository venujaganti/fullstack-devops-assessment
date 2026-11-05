#!/usr/bin/env sh
set -eu

: "${IMAGE_TAG:?IMAGE_TAG is required}"
: "${GHCR_OWNER:?GHCR_OWNER is required}"

export IMAGE_TAG GHCR_OWNER

echo "Validating Docker Compose configuration..."
docker compose config --quiet

echo "Pulling latest application images..."
docker compose pull

echo "Starting application services..."
docker compose up -d --remove-orphans

echo "Checking container status..."
docker compose ps

echo "Deployment completed."
