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
        EC2_SECRET_FILE_ID = 'ec2-secret-file'  // Secret file (or workspace Deployment/ec2-secret.env)
    }

    stages {
        stage('Checkout') {
            steps {
                echo '>>> [1/3] Checking out repository in Jenkins...'
                checkout scm
            }
        }

        stage('Deploy to EC2 via SSH') {
            steps {
                echo '>>> [2/3] Authenticating with SSH key and deploying to EC2...'
                withCredentials([
                    file(credentialsId: env.EC2_SECRET_FILE_ID, variable: 'SECRET_CONFIG'),
                    sshUserPrivateKey(credentialsId: env.SSH_KEY_ID, keyFileVariable: 'SSH_KEY_FILE', usernameVariable: 'SSH_USER')
                ]) {
                    powershell '''
                        $ErrorActionPreference = "Stop"

                        # 1. Load host & user from secret file (or workspace fallback)
                        $configFile = if ($env:SECRET_CONFIG -and (Test-Path $env:SECRET_CONFIG)) {
                            $env:SECRET_CONFIG
                        } elseif (Test-Path "Deployment/ec2-secret.env") {
                            "Deployment/ec2-secret.env"
                        } else {
                            $null
                        }

                        if ($configFile) {
                            Write-Host ">>> Loading config from: $configFile"
                            Get-Content $configFile | ForEach-Object {
                                $line = $_.Trim()
                                if ($line -and -not $line.StartsWith('#') -and $line.Contains('=')) {
                                    $parts = $line.Split('=', 2)
                                    [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), 'Process')
                                }
                            }
                        }

                        $HOST = $env:EC2_HOST
                        $USER = if ($env:EC2_USER) { $env:EC2_USER } else { $env:SSH_USER }
                        $DIR  = if ($env:REMOTE_DIR) { $env:REMOTE_DIR } else { "/home/$USER/essa" }
                        $KEY  = $env:SSH_KEY_FILE

                        if (-not $HOST -or -not $USER) {
                            Write-Error "ERROR: EC2_HOST or EC2_USER is not defined."
                            exit 1
                        }

                        Write-Host "Connecting to: $USER@$HOST : $DIR"

                        # 2. Ensure remote directory exists on EC2
                        Write-Host ">>> Ensuring target directory exists on EC2..."
                        & ssh -i "$KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$USER@$HOST" "mkdir -p $DIR"

                        # 3. Package and transfer project files to EC2
                        Write-Host ">>> Packaging and uploading project files..."
                        $archive = "essa-deploy.tar.gz"
                        if (Test-Path $archive) { Remove-Item -Force $archive }
                        & tar.exe --exclude='.git' --exclude='node_modules' --exclude='dist' --exclude='*.tar.gz' -czf $archive .
                        & scp -i "$KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $archive "$USER@${HOST}:$DIR/$archive"
                        Remove-Item -Force $archive

                        # 4. Extract archive on EC2
                        Write-Host ">>> Extracting files on EC2..."
                        & ssh -i "$KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$USER@$HOST" "tar -xzf $DIR/$archive -C $DIR && rm -f $DIR/$archive"

                        # 5. Build and launch Docker container on EC2 port 80
                        Write-Host ">>> Building and starting frontend container on EC2..."
                        $deployCmd = "cd $DIR && docker compose -f Deployment/docker-compose.yml up -d --build --remove-orphans && docker image prune -f"
                        & ssh -i "$KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$USER@$HOST" $deployCmd

                        Write-Host ">>> Deployment completed successfully!"
                    '''
                }
            }
        }

        stage('Remote Health Check') {
            steps {
                echo '>>> [3/3] Performing remote health check on EC2...'
                withCredentials([
                    file(credentialsId: env.EC2_SECRET_FILE_ID, variable: 'SECRET_CONFIG')
                ]) {
                    powershell '''
                        $configFile = if ($env:SECRET_CONFIG -and (Test-Path $env:SECRET_CONFIG)) {
                            $env:SECRET_CONFIG
                        } elseif (Test-Path "Deployment/ec2-secret.env") {
                            "Deployment/ec2-secret.env"
                        } else {
                            $null
                        }

                        if ($configFile) {
                            Get-Content $configFile | ForEach-Object {
                                $line = $_.Trim()
                                if ($line -and -not $line.StartsWith('#') -and $line.Contains('=')) {
                                    $parts = $line.Split('=', 2)
                                    [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), 'Process')
                                }
                            }
                        }

                        $HOST = $env:EC2_HOST
                        Write-Host "Pinging http://$HOST on port 80..."
                        Start-Sleep -Seconds 5

                        try {
                            $res = Invoke-WebRequest -Uri "http://$HOST" -UseBasicParsing -TimeoutSec 10 -Method Head -ErrorAction SilentlyContinue
                            Write-Host "HTTP Response Code: $($res.StatusCode)"
                            if ($res.StatusCode -eq 200 -or $res.StatusCode -eq 304) {
                                Write-Host "SUCCESS: Remote EC2 is responding with HTTP $($res.StatusCode) OK!"
                            }
                        } catch {
                            Write-Host "Health check response: $($_.Exception.Message)"
                        }
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
