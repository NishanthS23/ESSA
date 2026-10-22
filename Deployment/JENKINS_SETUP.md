# Local Jenkins to Remote Ubuntu EC2 Deployment Guide

This guide explains how to configure your **Local Jenkins** to deploy to your **Ubuntu EC2 instance** securely using a separate secret file for host and user credentials.

---

## Security Architecture

No sensitive server information (IP address, username, private key) is hardcoded in the codebase:
- **`ec2-ssh-key`**: Jenkins SSH private key credential (your `ESSA.pem` file).
- **`ec2-secret-file`**: Jenkins Secret file credential containing `EC2_HOST`, `EC2_USER`, and `REMOTE_DIR`.

---

## Step 1: Create Your Secret File

Create a small file on your local computer named `ec2-secret.env` (or any name you like) with the following content:

```env
EC2_HOST=15.206.174.225
EC2_USER=ubuntu
REMOTE_DIR=/home/ubuntu/essa
```

*(You can refer to the template in [`Deployment/ec2-secret.env.example`](./ec2-secret.env.example)).*

---

## Step 2: Add Credentials in Local Jenkins

Open your Local Jenkins dashboard (`http://localhost:8080`) and go to:
**Manage Jenkins** -> **Credentials** -> Click **(global)** under System -> **Add Credentials**.

### Credential 1: The Secret File (`ec2-secret-file`)
1. Click **Add Credentials**:
   - **Kind**: Select `Secret file`.
   - **File**: Choose your `ec2-secret.env` file created in Step 1.
   - **ID**: `ec2-secret-file` *(Must match the `EC2_SECRET_FILE_ID` in `Jenkinsfile`)*.
   - **Description**: `EC2 Host and User Secret Configuration`.
2. Click **Create**.

### Credential 2: The SSH Key (`ec2-ssh-key`)
1. Click **Add Credentials**:
   - **Kind**: Select `SSH Username with private key`.
   - **ID**: `ec2-ssh-key` *(Must match `SSH_KEY_ID` in `Jenkinsfile`)*.
   - **Username**: `ubuntu`.
   - **Private Key**: Select **Enter directly** -> **Add** -> paste the entire contents of your `ESSA.pem` file.
   - **Description**: `EC2 Ubuntu Private Key`.
2. Click **Create**.

---

## Step 3: Ensure "SSH Agent Plugin" is Installed

In Jenkins -> **Manage Jenkins** -> **Plugins** -> **Installed plugins**:
Ensure **SSH Agent Plugin** is installed (if not, search and install it from **Available plugins**).

---

## Step 4: Run the Pipeline

1. In Jenkins, create or open your Pipeline job.
2. In the job configuration under **Pipeline**:
   - **Definition**: `Pipeline script from SCM`
   - **SCM**: `Git`
   - **Repository URL**: Your repository URL.
   - **Branch Specifier**: `*/main`.
   - **Script Path**: `Jenkinsfile`.
3. Click **Save** and then click **Build Now**.

### Pipeline Execution Flow:
1. Jenkins checks out the repository.
2. Securely loads `EC2_HOST` and `EC2_USER` from the secret file via `withCredentials`.
3. Opens the SSH session with `ec2-ssh-key`.
4. Streams the project files to the EC2 directory (`/home/ubuntu/essa`).
5. Executes `docker compose -f Deployment/docker-compose.yml up -d --build` on the remote EC2 instance.
6. Runs an automated remote health check on `http://${EC2_HOST}`.
7. Shuts down and cleans up credentials in memory.

---

## Changing Server IP or User in the Future

If you ever change EC2 instances, elastic IPs, or users:
- **You do NOT need to touch or modify any code in Git.**
- Simply update the `ec2-secret-file` credential in Jenkins with the new IP address.
