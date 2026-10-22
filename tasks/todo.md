# EC2 Deployment Plan

- [x] **Phase 1: Deployment Configuration & Scripts**
  - [x] Update `Deployment/docker-compose.yml` to default to port 80 for production EC2 traffic
  - [x] Create `Deployment/deploy.sh` (one-click deployment, build, and image pruning script for EC2)
  - [x] Create `Deployment/EC2_DEPLOYMENT.md` (comprehensive step-by-step guide with transfer and run commands)

- [x] **Phase 2: Security & Networking Setup Guide**
  - [x] Document AWS Security Group rules (Port 80 HTTP, 22 SSH)
  - [x] Validate Docker Compose configuration with published port 80

---

## Review & Audit Results

1. **Port Mapping**:
   - `Deployment/docker-compose.yml` binds container port 80 to host port `${PORT:-80}`. This ensures public web traffic reaching the EC2 instance on standard HTTP port 80 is immediately served without requiring custom port suffixes in the URL.

2. **Automated One-Click Deploy Script for Ubuntu**:
   - [`Deployment/deploy.sh`](file:///c:/Users/Work/Documents/work/essa/Deployment/deploy.sh): Fully automated for Ubuntu EC2. It auto-detects and installs Docker & Docker Compose via `apt-get` if missing, manages systemd daemon state, handles socket permissions, builds the image, and prunes unused build cache.
   - Normalized line endings to UNIX LF to prevent `/bin/bash^M` execution errors on Linux.

3. **Transfer & Run Commands Documented**:
   - Both Git clone and SCP copy methods are tailored for Ubuntu in [`Deployment/EC2_DEPLOYMENT.md`](file:///c:/Users/Work/Documents/work/essa/Deployment/EC2_DEPLOYMENT.md).
