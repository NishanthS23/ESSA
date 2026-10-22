pipeline {
    agent any

    options {
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        ansiColor('xterm')
    }

    environment {
        // Jenkins Credential IDs (Configured in Jenkins -> Manage Jenkins -> Credentials)
        SSH_KEY_ID         = 'ec2-ssh-key'      // SSH Username with private key (ESSA.pem)
        EC2_SECRET_FILE_ID = 'ec2-secret-file'  // Secret File containing EC2_HOST, EC2_USER, REMOTE_DIR
    }

    stages {
        stage('Checkout') {
            steps {
                echo '>>> [1/4] Checking out repository in Local Jenkins...'
                checkout scm
            }
        }

        stage('Transfer & Deploy to EC2') {
            steps {
                echo '>>> [2/4] Loading credentials and deploying to remote EC2...'
                withCredentials([file(credentialsId: env.EC2_SECRET_FILE_ID, variable: 'SECRET_CONFIG')]) {
                    sshagent([env.SSH_KEY_ID]) {
                        sh '''
                            # Load EC2_HOST and EC2_USER securely from the secret file
                            set -a
                            . "${SECRET_CONFIG}"
                            set +a

                            if [ -z "${EC2_HOST}" ] || [ -z "${EC2_USER}" ]; then
                                echo "ERROR: EC2_HOST or EC2_USER is missing in the secret file."
                                exit 1
                            fi

                            TARGET_DIR="${REMOTE_DIR:-/home/${EC2_USER}/essa}"
                            echo "Connecting to target: ${EC2_USER}@${EC2_HOST}:${TARGET_DIR}"

                            # 1. Create remote target directory if not exists
                            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "mkdir -p ${TARGET_DIR}"

                            # 2. Stream project files to EC2 (excludes node_modules and .git for fast transfer)
                            echo ">>> Syncing files to remote EC2..."
                            tar --exclude='.git' --exclude='node_modules' --exclude='dist' -czf - . | \
                                ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "tar -xzf - -C ${TARGET_DIR}"

                            # 3. Ensure Docker and Docker Compose are installed and running on EC2
                            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "
                                if ! command -v docker &> /dev/null || ! docker compose version &> /dev/null; then
                                    echo 'Installing Docker on EC2...'
                                    sudo apt-get update -y && sudo apt-get install -y docker.io docker-compose-v2
                                    sudo systemctl enable --now docker
                                    sudo usermod -aG docker ${EC2_USER} || true
                                fi
                            "

                            # 4. Build and run the container on EC2 port 80
                            echo ">>> Building and starting frontend container on EC2..."
                            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "
                                cd ${TARGET_DIR}
                                docker compose -f Deployment/docker-compose.yml up -d --build --remove-orphans
                                docker image prune -f
                            "
                        '''
                    }
                }
            }
        }

        stage('Remote Health Check') {
            steps {
                echo '>>> [3/4] Performing remote health check on EC2...'
                withCredentials([file(credentialsId: env.EC2_SECRET_FILE_ID, variable: 'SECRET_CONFIG')]) {
                    sh '''
                        # Load EC2_HOST from the secret file
                        set -a
                        . "${SECRET_CONFIG}"
                        set +a

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
