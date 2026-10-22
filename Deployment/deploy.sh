#!/bin/bash
set -e

# ==============================================================================
# ESAA Frontend Deployment Script for Ubuntu EC2
# ==============================================================================

echo ">>> [1/4] Checking and preparing Docker on Ubuntu..."

# Auto-install Docker & Docker Compose if missing
if ! command -v docker &> /dev/null || ! docker compose version &> /dev/null; then
    echo "Docker or Docker Compose not found. Installing via apt-get..."
    sudo apt-get update -y
    sudo apt-get install -y docker.io docker-compose-v2
    sudo systemctl enable --now docker
    sudo usermod -aG docker "$USER" || true
    echo "Docker installed successfully."
fi

# Ensure docker daemon is running
if ! sudo systemctl is-active --quiet docker; then
    echo "Starting Docker service..."
    sudo systemctl start docker
fi

# Determine docker compose execution prefix (with sudo if user not yet in docker group session)
DOCKER_CMD="docker"
COMPOSE_CMD="docker compose"

if ! docker info &> /dev/null; then
    echo "Configuring permissions (using sudo for Docker operations in this session)..."
    DOCKER_CMD="sudo docker"
    COMPOSE_CMD="sudo docker compose"
fi

# Locate project root (one directory up from Deployment/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$ROOT_DIR"

echo ">>> [2/4] Building and launching frontend container on port 80..."
$COMPOSE_CMD -f Deployment/docker-compose.yml up -d --build --remove-orphans

echo ">>> [3/4] Cleaning up unused build cache & dangling images..."
$DOCKER_CMD image prune -f

echo ">>> [4/4] Verifying running services..."
$COMPOSE_CMD -f Deployment/docker-compose.yml ps

echo ""
echo "================================================================================"
echo "Deployment successful! ESAA Frontend is running on port 80."
echo "Test on EC2 terminal: curl -I http://localhost"
echo "Public browser URL:   http://$(curl -s http://checkip.amazonaws.com || echo '<EC2_PUBLIC_IP>')"
echo "================================================================================"
