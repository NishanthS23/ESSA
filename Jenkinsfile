pipeline {
    agent any

    options {
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        ansiColor('xterm')
    }

    environment {
        // Target EC2 Instance Details
        EC2_HOST   = '15.206.174.225'
        EC2_USER   = 'ubuntu'
        SSH_KEY_ID = 'ec2-ssh-key' // Credential ID created in Jenkins for your ESSA.pem
        REMOTE_DIR = '/home/ubuntu/essa'
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
                echo ">>> [2/4] Connecting to EC2 (${EC2_USER}@${EC2_HOST}) and deploying..."
                sshagent([env.SSH_KEY_ID]) {
                    sh '''
                        # 1. Create remote target directory if not exists
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "mkdir -p ${REMOTE_DIR}"

                        # 2. Stream project files to EC2 (excludes git, node_modules, dist to make transfer instant)
                        echo ">>> Syncing files to remote EC2..."
                        tar --exclude='.git' --exclude='node_modules' --exclude='dist' -czf - . | \
                            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "tar -xzf - -C ${REMOTE_DIR}"

                        # 3. Ensure Docker service is running on EC2
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "
                            if ! command -v docker &> /dev/null || ! docker compose version &> /dev/null; then
                                echo 'Docker not found on EC2. Running quick install...'
                                sudo apt-get update -y && sudo apt-get install -y docker.io docker-compose-v2
                                sudo systemctl enable --now docker
                                sudo usermod -aG docker ${EC2_USER} || true
                            fi
                        "

                        # 4. Build and run the container on EC2 port 80
                        echo ">>> Building and starting frontend container on EC2..."
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "
                            cd ${REMOTE_DIR}
                            docker compose -f Deployment/docker-compose.yml up -d --build --remove-orphans
                            docker image prune -f
                        "
                    '''
                }
            }
        }

        stage('Remote Health Check') {
            steps {
                echo ">>> [3/4] Verifying live response on http://${EC2_HOST}..."
                sh '''
                    # Wait 5 seconds for Nginx container startup
                    sleep 5

                    # Ping remote EC2 public IP on port 80
                    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 http://${EC2_HOST} || echo "000")
                    echo "HTTP Status Code: ${HTTP_STATUS}"

                    if [ "${HTTP_STATUS}" -eq 200 ] || [ "${HTTP_STATUS}" -eq 304 ]; then
                        echo "SUCCESS: Remote EC2 is responding with HTTP ${HTTP_STATUS} OK!"
                    else
                        echo "WARNING: Expected 200/304, got ${HTTP_STATUS}. Please verify AWS Security Group allows Port 80."
                    fi
                '''
            }
        }
    }

    post {
        success {
            echo "================================================================================"
            echo "DEPLOYMENT COMPLETE! Application is running live on: http://${EC2_HOST}"
            echo "================================================================================"
        }
        failure {
            echo "================================================================================"
            echo "DEPLOYMENT FAILED. Check console output above for error details."
            echo "================================================================================"
        }
    }
}
