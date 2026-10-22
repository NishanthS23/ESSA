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
                echo '>>> [1/4] Checking out repository in Jenkins...'
                checkout scm
            }
        }

        stage('Deploy to EC2 via SSH') {
            steps {
                echo '>>> [2/4] Authenticating with SSH key and deploying to EC2...'
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

                        $targetHost = $env:EC2_HOST
                        $targetUser = if ($env:EC2_USER) { $env:EC2_USER } else { $env:SSH_USER }
                        $targetDir  = if ($env:REMOTE_DIR) { $env:REMOTE_DIR } else { "/home/$targetUser/essa" }
                        $sshKey     = $env:SSH_KEY_FILE

                        if (-not $targetHost -or -not $targetUser) {
                            Write-Error "ERROR: EC2_HOST or EC2_USER is not defined."
                            exit 1
                        }

                        # 2. Fix permissions on temporary private key file created by Jenkins on Windows
                        if ($sshKey -and (Test-Path $sshKey)) {
                            Write-Host ">>> Securing SSH private key permissions..."
                            & icacls.exe "$sshKey" /reset /c /q
                            & icacls.exe "$sshKey" /inheritance:r /c /q
                            & icacls.exe "$sshKey" /grant:r "*S-1-5-32-544:(R)" /c /q
                            & icacls.exe "$sshKey" /grant:r "*S-1-5-18:(R)" /c /q
                            if ($env:USERNAME) {
                                & icacls.exe "$sshKey" /grant:r "$($env:USERNAME):(R)" /c /q
                            }
                        }

                        $sshOpts = @("-i", "$sshKey", "-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=/dev/null", "-o", "LogLevel=ERROR")

                        Write-Host "Connecting to: $targetUser@$targetHost : $targetDir"

                        # 3. Ensure remote directory exists on EC2
                        Write-Host ">>> Ensuring target directory exists on EC2..."
                        & ssh @sshOpts "$targetUser@$targetHost" "mkdir -p $targetDir"
                        if ($LASTEXITCODE -ne 0) { throw "SSH mkdir failed with exit code $LASTEXITCODE" }

                        # 4. Package and transfer project files to EC2
                        Write-Host ">>> Packaging and uploading project files..."
                        $archive = "essa-deploy.tar.gz"
                        if (Test-Path $archive) { Remove-Item -Force $archive }
                        & tar.exe --exclude='.git' --exclude='node_modules' --exclude='dist' --exclude='*.tar.gz' -czf $archive .
                        $remoteDest = "$targetUser@$targetHost" + ":$targetDir/$archive"
                        & scp @sshOpts $archive "$remoteDest"
                        if ($LASTEXITCODE -ne 0) { throw "SCP upload failed with exit code $LASTEXITCODE" }
                        Remove-Item -Force $archive

                        # 5. Extract archive on EC2
                        Write-Host ">>> Extracting files on EC2..."
                        & ssh @sshOpts "$targetUser@$targetHost" "tar -xzf $targetDir/$archive -C $targetDir && rm -f $targetDir/$archive"
                        if ($LASTEXITCODE -ne 0) { throw "SSH extract failed with exit code $LASTEXITCODE" }

                        # 6. Build and launch Docker container on EC2 port 80
                        Write-Host ">>> Building and starting frontend container on EC2..."
                        $deployCmd = "cd $targetDir && docker compose -f Deployment/docker-compose.yml up -d --build --remove-orphans && docker image prune -f"
                        & ssh @sshOpts "$targetUser@$targetHost" $deployCmd
                        if ($LASTEXITCODE -ne 0) { throw "Docker deployment failed with exit code $LASTEXITCODE" }

                        Write-Host ">>> Deployment completed successfully!"
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

                        $targetHost = $env:EC2_HOST
                        Write-Host "Pinging http://$targetHost on port 80..."

                        $healthy = $false
                        for ($i = 1; $i -le 6; $i++) {
                            try {
                                $res = Invoke-WebRequest -Uri "http://$targetHost" -UseBasicParsing -TimeoutSec 10 -Method Head -ErrorAction Stop
                                Write-Host "Attempt $i: HTTP Response Code: $($res.StatusCode)"
                                if ($res.StatusCode -eq 200 -or $res.StatusCode -eq 304) {
                                    Write-Host "SUCCESS: Remote EC2 is responding with HTTP $($res.StatusCode) OK!"
                                    $healthy = $true
                                    break
                                }
                            } catch {
                                Write-Host "Attempt $i: Waiting for container to respond... ($($_.Exception.Message))"
                                Start-Sleep -Seconds 5
                            }
                        }

                        if (-not $healthy) {
                            throw "Health check failed: http://$targetHost did not return HTTP 200/304 within 30 seconds"
                        }
                    '''
                }
            }
        }

        stage('Cleanup Remote Workspace') {
            steps {
                echo '>>> [4/4] Removing cloned deployment repository on EC2...'
                withCredentials([
                    file(credentialsId: env.EC2_SECRET_FILE_ID, variable: 'SECRET_CONFIG'),
                    sshUserPrivateKey(credentialsId: env.SSH_KEY_ID, keyFileVariable: 'SSH_KEY_FILE', usernameVariable: 'SSH_USER')
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

                        $targetHost = $env:EC2_HOST
                        $targetUser = if ($env:EC2_USER) { $env:EC2_USER } else { $env:SSH_USER }
                        $targetDir  = if ($env:REMOTE_DIR) { $env:REMOTE_DIR } else { "/home/$targetUser/essa" }
                        $sshKey     = $env:SSH_KEY_FILE

                        if ($sshKey -and (Test-Path $sshKey)) {
                            & icacls.exe "$sshKey" /reset /c /q
                            & icacls.exe "$sshKey" /inheritance:r /c /q
                            & icacls.exe "$sshKey" /grant:r "*S-1-5-32-544:(R)" /c /q
                            & icacls.exe "$sshKey" /grant:r "*S-1-5-18:(R)" /c /q
                            if ($env:USERNAME) {
                                & icacls.exe "$sshKey" /grant:r "$($env:USERNAME):(R)" /c /q
                            }
                        }

                        $sshOpts = @("-i", "$sshKey", "-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=/dev/null", "-o", "LogLevel=ERROR")

                        if (-not $targetDir -or $targetDir -eq "/" -or $targetDir -eq "/home/$targetUser") {
                            Write-Error "Invalid target directory for cleanup: '$targetDir'"
                            exit 1
                        }

                        Write-Host ">>> Cleaning up remote repository at $targetDir on $targetHost..."
                        & ssh @sshOpts "$targetUser@$targetHost" "rm -rf $targetDir"
                        if ($LASTEXITCODE -ne 0) { throw "Remote directory removal failed with exit code $LASTEXITCODE" }

                        Write-Host ">>> Remote repository $targetDir successfully removed from EC2."
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
