# Deployment Guide

This directory contains containerization and deployment configurations for the ESAA frontend.

## Files

- **`docker-compose.yml`**: Docker Compose service configuration.
- **`nginx.conf`**: Optimized Nginx web server configuration (SPA routing, gzip, media asset caching).
- **`../frontend/Dockerfile`**: Multi-stage Dockerfile (Node.js build stage + lightweight Nginx runner).

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

## Running with Docker Compose

From the project root:

```bash
docker compose -f Deployment/docker-compose.yml up --build -d
```

Or from inside the `Deployment/` folder:

```bash
docker compose up --build -d
```

### Accessing the Application

- Open your browser at: **`http://localhost:3000`**
- To change the host port, set the `PORT` environment variable:
  ```bash
  PORT=8080 docker compose -f Deployment/docker-compose.yml up -d
  ```

### Stopping the Service

```bash
docker compose -f Deployment/docker-compose.yml down
```

### Viewing Logs

```bash
docker compose -f Deployment/docker-compose.yml logs -f frontend
```

## Building with Docker CLI Directly

From the project root:

```bash
docker build -t essa-frontend -f frontend/Dockerfile .
docker run -d --name essa-frontend -p 3000:80 essa-frontend
```
