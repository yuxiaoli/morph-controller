# Shell Configuration

- **OS**: Windows
- **Default Shell**: PowerShell 5.1
- **PATH**: `$env:PATH` in PowerShell, `$PATH` in POSIX shells

## Command Chaining
Use `;` to chain commands. The `&&` operator is **not** supported in PS 5.1.

## Useful Commands
- Print PATH: `$env:PATH`
- Check shell version: `$PSVersionTable.PSVersion`
