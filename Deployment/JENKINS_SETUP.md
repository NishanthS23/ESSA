# Local Jenkins to Remote Ubuntu EC2 Deployment Guide

This guide explains how to configure your **Local Jenkins** instance to automatically build and deploy the ESAA frontend to your **remote Ubuntu EC2 instance (`15.206.174.225`)** over SSH.

---

## Architecture Overview

```
[ Local Machine / Local Jenkins ]
       │
       │  1. Clones repository code locally
       │  2. Connects over SSH using ESSA.pem
       │  3. Syncs project files to EC2 (~/essa)
       │  4. Runs "docker compose up -d --build" remotely
       ▼
[ Remote Ubuntu EC2 (15.206.174.225) ]
       │
       ▼  Serves live frontend on Port 80
```

---

## Step 1: Install "SSH Agent" Plugin in Local Jenkins

1. Open your Local Jenkins dashboard (e.g. `http://localhost:8080`).
2. Go to **Manage Jenkins** -> **Plugins** -> **Installed plugins**.
3. Check if **"SSH Agent Plugin"** is installed.
   - If not installed, go to **Available plugins**, search for **SSH Agent**, and click **Install**.

---

## Step 2: Add your `ESSA.pem` Key to Jenkins Credentials

1. On your Local Jenkins dashboard, go to:
   **Manage Jenkins** -> **Credentials** -> Click **(global)** under System -> **Add Credentials**.
2. Fill in the fields:
   - **Kind**: Select `SSH Username with private key`.
   - **ID**: `ec2-ssh-key` *(Must match the `SSH_KEY_ID` in `Jenkinsfile`)*.
   - **Description**: `EC2 Ubuntu SSH Key`.
   - **Username**: `ubuntu`.
   - **Private Key**: Select **Enter directly**, click **Add**, and paste the full contents of your `ESSA.pem` file:
     ```
     -----BEGIN RSA PRIVATE KEY-----
     ...
     -----END RSA PRIVATE KEY-----
     ```
3. Click **Create**.

---

## Step 3: Create the Pipeline Job in Local Jenkins

1. On your Local Jenkins dashboard, click **New Item**.
2. Enter a job name (e.g., `essa-ec2-deployment`).
3. Select **Pipeline** and click **OK**.
4. In the job configuration page, scroll down to **Pipeline**:
   - **Definition**: `Pipeline script from SCM`
   - **SCM**: `Git`
   - **Repository URL**: Paste your repository URL.
   - **Credentials**: If the Git repository is private, add your Git credentials.
   - **Branch Specifier**: `*/main` (or `*/master`).
   - **Script Path**: `Jenkinsfile`.
5. Click **Save**.

---

## Step 4: Run the Pipeline

1. Click **Build Now** on the pipeline page.
2. Click on the build number (e.g., `#1`) -> **Console Output** to watch the deployment:
   - Connects to `ubuntu@15.206.174.225`.
   - Syncs project files (excluding `node_modules` and `.git` for fast transfer).
   - Executes `docker compose -f Deployment/docker-compose.yml up -d --build` on EC2.
   - Performs a remote health check on `http://15.206.174.225`.
3. Open your browser to verify:
   ```
   http://15.206.174.225
   ```

---

## Step 5: (Optional) Automatic Trigger on `git push`

If your Git repository is on GitHub:
1. In your pipeline configuration under **Build Triggers**, check:
   - **GitHub hook trigger for GITScm polling**
2. In your GitHub repository -> **Settings** -> **Webhooks** -> **Add webhook**:
   - **Payload URL**: `http://<YOUR_LOCAL_OR_TUNNELED_JENKINS_URL>/github-webhook/`
   - *(Note: If Local Jenkins is behind a home/office router, you can use [ngrok](https://ngrok.com) like `ngrok http 8080` to expose the webhook).*
