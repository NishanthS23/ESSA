# Lessons Learned

## PowerShell Scripting in CI/CD (Jenkins on Windows)

### 1. Avoid Built-in and Read-Only Automatic Variables
- **Pattern**: `$Host` (case-insensitive in PowerShell) is a reserved, read-only automatic variable that references the host application (`System.Management.Automation.Internal.Host.InternalHost`). Assigning to `$HOST = ...` will throw: `Cannot overwrite variable Host because it is read-only or constant`.
- **Rule**: Never use `$HOST` as a variable name in PowerShell. Always use prefixed, descriptive names such as `$targetHost`, `$remoteHost`, `$targetUser`, `$targetDir`, `$sshKey`.
- **String Interpolation**: When formatting SSH/SCP target destinations with colons (e.g., `user@host:/path`), avoid `$targetUser@$targetHost:$path` which PowerShell can interpret as a variable drive scope (`$targetHost:`). Instead use string concatenation: `"$targetUser@$targetHost" + ":$path"` or subexpression `"$targetUser@$($targetHost):$path"`.
