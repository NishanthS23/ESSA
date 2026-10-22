pipeline {
    agent any

    options {
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        ansiColor('xterm')
    }

    environment {
        // Jenkins Credential IDs
        SSH_KEY_ID         = 'ec2-ssh-key'      // SSH Username with private key (ESSA.pem)
        EC2_SECRET_FILE_ID = 'ec2-secret-file'  // Secret file credential (with EC2_HOST, EC2_USER, REMOTE_DIR)
    }

    stages {
        stage('Checkout') {
            steps {
                echo '>>> [1/4] Checking out repository in Jenkins...'
                checkout scm
            }
        }

        stage('Transfer & Deploy to EC2') {
            steps {
                echo '>>> [2/4] Authenticating with SSH key and deploying to EC2...'
                withCredentials([
                    file(credentialsId: env.EC2_SECRET_FILE_ID, variable: 'SECRET_CONFIG'),
                    sshUserPrivateKey(credentialsId: env.SSH_KEY_ID, keyFileVariable: 'SSH_KEY_FILE', usernameVariable: 'SSH_USER')
                ]) {
                    sh '''
                        # 1. Load host and user from secret file (or workspace fallback)
                        if [ -n "${SECRET_CONFIG}" ] && [ -f "${SECRET_CONFIG}" ]; then
                            set -a
                            . "${SECRET_CONFIG}"
                            set +a
                        elif [ -f "Deployment/ec2-secret.env" ]; then
                            set -a
                            . "Deployment/ec2-secret.env"
                            set +a
                        fi

                        # Use SSH_USER from Jenkins credential if not specified in file
                        EC2_USER="${EC2_USER:-${SSH_USER}}"

                        if [ -z "${EC2_HOST}" ] || [ -z "${EC2_USER}" ]; then
                            echo "ERROR: EC2_HOST or EC2_USER is not defined in the secret file."
                            exit 1
                        fi

                        TARGET_DIR="${REMOTE_DIR:-/home/${EC2_USER}/essa}"
                        echo "Target destination: ${EC2_USER}@${EC2_HOST}:${TARGET_DIR}"

                        # Configure SSH command using the keyfile provided by Jenkins
                        SSH_CMD="ssh -i ${SSH_KEY_FILE} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"

                        # 2. Ensure remote directory exists
                        echo "Creating target directory on EC2..."
                        ${SSH_CMD} ${EC2_USER}@${EC2_HOST} "mkdir -p ${TARGET_DIR}"

                        # 3. Stream files to EC2 (excludes node_modules and .git for speed)
                        echo "Syncing code files to EC2..."
                        tar --exclude='.git' --exclude='node_modules' --exclude='dist' -czf - . | \
                            ${SSH_CMD} ${EC2_USER}@${EC2_HOST} "tar -xzf - -C ${TARGET_DIR}"

                        # 4. Verify Docker is running on EC2
                        ${SSH_CMD} ${EC2_USER}@${EC2_HOST} "
                            if ! command -v docker &> /dev/null || ! docker compose version &> /dev/null; then
                                echo 'Installing Docker on EC2...'
                                sudo apt-get update -y && sudo apt-get install -y docker.io docker-compose-v2
                                sudo systemctl enable --now docker
                                sudo usermod -aG docker ${EC2_USER} || true
                            fi
                        "

                        # 5. Build and launch container on EC2 port 80
                        echo "Building and launching frontend container on EC2..."
                        ${SSH_CMD} ${EC2_USER}@${EC2_HOST} "
                            cd ${TARGET_DIR}
                            docker compose -f Deployment/docker-compose.yml up -d --build --remove-orphans
                            docker image prune -f
                        "
                    '''
                }
            }
        }

        stage('Remote Health Check') {
            steps {
                echo '>>> [3/4] Performing remote health check on EC2...'
                withCredentials([
                    file(credentialsId: env.EC2_SECRET_FILE_ID, variable: 'SECRET_CONFIG')
                ]) {
                    sh '''
                        if [ -n "${SECRET_CONFIG}" ] && [ -f "${SECRET_CONFIG}" ]; then
                            set -a
                            . "${SECRET_CONFIG}"
                            set +a
                        elif [ -f "Deployment/ec2-secret.env" ]; then
                            set -a
                            . "Deployment/ec2-secret.env"
                            set +a
                        fi

                        echo "Pinging http://${EC2_HOST} on port 80..."
                        sleep 5

                        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 http://${EC2_HOST} || echo "000")
                        echo "HTTP Response Status Code: ${HTTP_STATUS}"

                        if [ "${HTTP_STATUS}" -eq 200 ] || [ "${HTTP_STATUS}" -eq 304 ]; then
                            echo "SUCCESS: Remote EC2 is responding with HTTP ${HTTP_STATUS} OK!"
                        else
                            echo "WARNING: Expected 200/304, got ${HTTP_STATUS}. Please ensure AWS Security Group allows Port 80."
                        fi
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "================================================================================"
            echo "DEPLOYMENT COMPLETED SUCCESSFULLY!"
            echo "================================================================================"
        }
        failure {
            echo "================================================================================"
            echo "DEPLOYMENT FAILED. Check console output above for error details."
            echo "================================================================================"
        }
    }
}
