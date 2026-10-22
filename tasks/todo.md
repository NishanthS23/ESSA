# Streamline Deployment (Remove Extra Scripts & Inline into Jenkinsfile)

- [x] **Phase 1: Inline All Steps into Jenkinsfile**
  - [x] Consolidate SSH, SCP, and Docker Compose execution directly into `Jenkinsfile` using native Windows `powershell`
  - [x] Embed the health check directly into `Jenkinsfile`

- [x] **Phase 2: Remove Redundant Scripts**
  - [x] Removed `Deployment/deploy.sh`
  - [x] Removed `Deployment/deploy-remote.ps1`
  - [x] Removed `Deployment/deploy-remote.sh`
  - [x] Removed `Deployment/health-check.ps1`
  - [x] Removed `Deployment/health-check.sh`
  - [x] Removed `Deployment/install-jenkins.sh`

- [x] **Phase 3: Fix PowerShell Variable Conflict in Jenkinsfile**
  - [x] Rename `$HOST` to `$targetHost` (resolving PowerShell `$Host` read-only variable conflict)
  - [x] Rename `$USER` to `$targetUser`, `$DIR` to `$targetDir`, `$KEY` to `$sshKey`
  - [x] Update `$remoteDest` for SCP
  - [x] Update health check block to use `$targetHost`
  - [x] Commit and push changes to GitHub

- [x] **Phase 4: Fix OpenSSH Key Permissions on Windows (Jenkins Agent)**
  - [x] Identified that Jenkins creates temporary key files inheriting `BUILTIN\Users` permissions under `C:\ProgramData`
  - [x] Applied `icacls.exe` to strip inheritance and restrict access strictly to Administrators, SYSTEM, and the current user
  - [x] Added `-o LogLevel=ERROR` to suppress non-fatal `Warning: Permanently added ...` stderr output
  - [x] Added `$LASTEXITCODE` validation for robust error trapping
  - [x] Tested flow end-to-end with remote EC2 host

---

## Review & Audit Results

1. **Zero External Script Dependencies**:
   - [`Jenkinsfile`](file:///c:/Users/Work/Documents/work/essa/Jenkinsfile) handles the full deployment lifecycle (reading credentials, tar streaming over SCP, executing Docker Compose on EC2, and health check) directly inline.
   - All 6 redundant `.sh` and `.ps1` helper scripts have been removed, leaving a clean, minimal repository.

2. **PowerShell & OpenSSH Compatibility**:
   - Resolved built-in read-only variable collision (`$Host`) by using distinct variable names (`$targetHost`, `$targetUser`, `$targetDir`, `$sshKey`).
   - Hardened OpenSSH private key file permissions via `icacls` so Jenkins's Windows agent passes OpenSSH strict key checks.
   - Configured `-o LogLevel=ERROR` to eliminate benign stderr warnings that trigger PowerShell CI wrapper failures.


