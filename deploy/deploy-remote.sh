#!/usr/bin/env sh
set -eu
: "${IMAGE_TAG:?required}"
: "${GHCR_OWNER:?required}"
export IMAGE_TAG GHCR_OWNER
docker compose pull
docker compose up -d --remove-orphans
docker compose ps
