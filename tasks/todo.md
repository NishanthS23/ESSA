# Local Jenkins to EC2 Deployment Plan

- [x] **Phase 1: Architecture Definition**
  - [x] Topology: Local Jenkins (running on host) -> SSH Deployment -> Remote Ubuntu EC2
  - [x] Authentication: SSH Key-based authentication using `ESSA.pem` (`ec2-ssh-key` credential)
  - [x] Secret Management: Decouple `EC2_HOST` and `EC2_USER` into a separate Jenkins "Secret file" credential (`ec2-secret-file`)

- [x] **Phase 2: Jenkinsfile Update**
  - [x] Update root `Jenkinsfile` to remove hardcoded IP and user
  - [x] Use `withCredentials([file(credentialsId: 'ec2-secret-file', variable: 'SECRET_CONFIG')])` to dynamically load `EC2_HOST` and `EC2_USER`
  - [x] Add template example file [`Deployment/ec2-secret.env.example`](file:///c:/Users/Work/Documents/work/essa/Deployment/ec2-secret.env.example)
  - [x] Ensure `.gitignore` ignores `*.pem` and `.env*`

- [x] **Phase 3: Local Jenkins Setup Guide**
  - [x] Step 1: Create secret file and add as Jenkins Secret File credential (`ec2-secret-file`)
  - [x] Step 2: Add `ESSA.pem` as Jenkins SSH credential (`ec2-ssh-key`)
  - [x] Step 3: Run pipeline and verify deployment

---

## Review & Audit Results

1. **Zero Hardcoded Secrets**:
   - Neither the EC2 IP address (`15.206.174.225`), the username (`ubuntu`), nor the SSH private key exist in the tracked code or `Jenkinsfile`.
   - All server connection details are loaded dynamically at runtime via Jenkins' encrypted credential store using the `ec2-secret-file` secret file.
2. **Easy Multi-Environment / Migration Support**:
   - Changing instances, switching IPs, or migrating servers only requires uploading a new secret file in Jenkins, with zero code changes needed.
