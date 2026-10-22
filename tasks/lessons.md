# Lessons Learned

## PowerShell Scripting in CI/CD (Jenkins on Windows)

### 1. Avoid Built-in and Read-Only Automatic Variables
- **Pattern**: `$Host` (case-insensitive in PowerShell) is a reserved, read-only automatic variable that references the host application (`System.Management.Automation.Internal.Host.InternalHost`). Assigning to `$HOST = ...` will throw: `Cannot overwrite variable Host because it is read-only or constant`.
- **Rule**: Never use `$HOST` as a variable name in PowerShell. Always use prefixed, descriptive names such as `$targetHost`, `$remoteHost`, `$targetUser`, `$targetDir`, `$sshKey`.
- **String Interpolation**: When formatting SSH/SCP target destinations with colons (e.g., `user@host:/path`), avoid `$targetUser@$targetHost:$path` which PowerShell can interpret as a variable drive scope (`$targetHost:`). Instead use string concatenation: `"$targetUser@$targetHost" + ":$path"` or subexpression `"$targetUser@$($targetHost):$path"`.

### 2. Jenkins Temporary SSH Key Permissions on Windows
- **Pattern**: When Jenkins exports a private key on Windows via `withCredentials([sshUserPrivateKey(...)])`, it creates a temporary file under `%WORKSPACE%@tmp\secretFiles\...`. Under `C:\ProgramData`, files inherit permissions granting read access to `BUILTIN\Users`. Windows OpenSSH (`ssh.exe` / `scp.exe`) refuses to use private keys accessible by others (`WARNING: UNPROTECTED PRIVATE KEY FILE! Bad permissions. Try removing permissions for user: BUILTIN\Users`).
- **Rule**: In Jenkins pipelines on Windows using native OpenSSH, reset and restrict the permissions of `$env:SSH_KEY_FILE` using `icacls.exe` immediately after loading credentials:
  ```powershell
  & icacls.exe "$sshKey" /reset /c /q
  & icacls.exe "$sshKey" /inheritance:r /c /q
  & icacls.exe "$sshKey" /grant:r "*S-1-5-32-544:(R)" /c /q
  & icacls.exe "$sshKey" /grant:r "*S-1-5-18:(R)" /c /q
  if ($env:USERNAME) { & icacls.exe "$sshKey" /grant:r "$($env:USERNAME):(R)" /c /q }
  ```
- **SSH Logging**: Always add `-o LogLevel=ERROR` to SSH/SCP command arguments to suppress harmless `Permanently added ... to the list of known hosts` stderr warnings that can trigger error conditions in PowerShell wrappers.

