param(
  [string]$Version = "1.1.1"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$toolsDir = Join-Path $repoRoot "tools"
if (!(Test-Path $toolsDir)) {
  New-Item -ItemType Directory -Path $toolsDir | Out-Null
}

$archiveName = "ckb-debugger_v$Version" + "_windows.tar.gz"
$archivePath = Join-Path $toolsDir $archiveName
$url = "https://github.com/nervosnetwork/ckb-standalone-debugger/releases/download/v$Version/ckb-debugger_v$Version" + "_x86_64-pc-windows-msvc.tar.gz"

Write-Host "Downloading ckb-debugger v$Version..."
Invoke-WebRequest -Uri $url -OutFile $archivePath

Write-Host "Extracting into tools/..."
tar -xf $archivePath -C $toolsDir

$exePath = Join-Path $toolsDir "ckb-debugger.exe"
if (!(Test-Path $exePath)) {
  throw "ckb-debugger.exe was not found after extraction."
}

Write-Host "Done. Installed: $exePath"
