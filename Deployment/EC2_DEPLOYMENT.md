# Ubuntu EC2 Deployment Guide for ESAA Frontend

This guide is tailored specifically for **Ubuntu (20.04 / 22.04 / 24.04 LTS)** on AWS EC2.

---

## Quick Start (Automated in 3 Steps)

### Step 1: Ensure Port 80 is Open in AWS EC2
In **AWS Console** -> **EC2** -> **Instances** -> Select your instance -> **Security** tab -> Click your **Security Group**:
- Ensure an **Inbound Rule** allows:
  - **Type**: `HTTP`
  - **Port**: `80`
  - **Source**: `0.0.0.0/0` (Anywhere IPv4)

---

### Step 2: Transfer Code to Your Ubuntu EC2

#### Option A: Clone from Git (Recommended)
SSH into your Ubuntu instance:
```bash
ssh -i /path/to/your-key.pem ubuntu@<EC2-PUBLIC-IP>
git clone <YOUR_GIT_REPO_URL>
cd essa
```

#### Option B: Direct Copy via SCP (from your local terminal)
```bash
scp -i /path/to/your-key.pem -r . ubuntu@<EC2-PUBLIC-IP>:~/essa
```

---

### Step 3: Run the Auto-Deploy Script

SSH into your Ubuntu instance:
```bash
ssh -i /path/to/your-key.pem ubuntu@<EC2-PUBLIC-IP>
cd ~/essa
chmod +x Deployment/deploy.sh
./Deployment/deploy.sh
```

> **Note**: `deploy.sh` automatically detects if Docker or Docker Compose is installed on Ubuntu. If not, it installs them via `apt-get`, configures system permissions, builds the image, and launches the container on port 80.

---

## Verification

1. **Test on the server terminal**:
   ```bash
   curl -I http://localhost
   ```
   *(You should receive an `HTTP/1.1 200 OK` response from Nginx)*

2. **Open in your web browser**:
   ```
   http://<EC2-PUBLIC-IP>
   ```

---

## Helpful Commands on Ubuntu

- **Check container status**:
  ```bash
  docker compose -f Deployment/docker-compose.yml ps
  ```

- **View live logs**:
  ```bash
  docker compose -f Deployment/docker-compose.yml logs -f
  ```

- **Restart the frontend**:
  ```bash
  docker compose -f Deployment/docker-compose.yml restart
  ```

- **Stop the frontend**:
  ```bash
  docker compose -f Deployment/docker-compose.yml down
  ```

- **Redeploy after code updates**:
  ```bash
  git pull
  ./Deployment/deploy.sh
  ```
