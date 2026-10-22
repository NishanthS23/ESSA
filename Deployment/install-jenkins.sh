#!/bin/bash
set -e

# ==============================================================================
# Jenkins Installation Script for Ubuntu EC2
# ==============================================================================

echo ">>> [1/6] Updating package repositories..."
sudo apt-get update -y
sudo apt-get install -y curl wget gnupg fontconfig openjdk-17-jre

echo ">>> [2/6] Verifying Java 17 installation..."
java -version

echo ">>> [3/6] Adding official Jenkins Debian repository..."
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /etc/apt/keyrings/jenkins-keyring.asc > /dev/null

echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

echo ">>> [4/6] Installing Jenkins..."
sudo apt-get update -y
sudo apt-get install -y jenkins

echo ">>> [5/6] Configuring Docker permissions for Jenkins..."
# Ensure Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt-get install -y docker.io docker-compose-v2
    sudo systemctl enable --now docker
fi

# Add Jenkins user to the docker group so pipelines can build and run containers
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

# Enable Jenkins on system boot
sudo systemctl enable jenkins

echo ">>> [6/6] Waiting for Jenkins to initialize..."
sleep 10

PUBLIC_IP=$(curl -s http://checkip.amazonaws.com || echo "<EC2_PUBLIC_IP>")
ADMIN_PASSWORD=$(sudo cat /var/lib/jenkins/secrets/initialAdminPassword 2>/dev/null || echo "Run 'sudo cat /var/lib/jenkins/secrets/initialAdminPassword' to view")

echo ""
echo "================================================================================"
echo " Jenkins installed and running successfully!"
echo "================================================================================"
echo " Dashboard URL:          http://${PUBLIC_IP}:8080"
echo " Initial Admin Password: ${ADMIN_PASSWORD}"
echo "================================================================================"
echo " NOTE: Make sure Port 8080 is allowed in your AWS EC2 Security Group Inbound rules!"
echo "================================================================================"
