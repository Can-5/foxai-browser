# FoxAI-Launcher.ps1 - launch, version check and auto-update for FoxAI Browser.
#
# Usage:
#   FoxAI-Launcher.ps1                 launch the browser
#   FoxAI-Launcher.ps1 -Launch         launch the browser (explicit)
#   FoxAI-Launcher.ps1 -Private        launch a private window
#   FoxAI-Launcher.ps1 -Check          check GitHub for a newer version (no download)
#   FoxAI-Launcher.ps1 -Update         download + install the newest version, then launch
#   FoxAI-Launcher.ps1 -Version        print the local version
#
# Everything is resolved relative to this script, so the whole folder can be
# moved anywhere or run straight from the unzipped release.

param(
  [switch]$Launch,
  [switch]$Private,
  [switch]$Check,
  [switch]$Update,
  [switch]$Version
)

$ErrorActionPreference = "Stop"

$Root = $PSScriptRoot
$Exe = Join-Path $Root "firefox-foxai\runtime\firefox.exe"
$ProfileDir = Join-Path $Root "firefox-foxai\profile\foxai"
$VersionFile = Join-Path $Root "version.txt"
$Repo = "Can-5/foxai-browser"
$ReleaseApi = "https://api.github.com/repos/$Repo/releases/latest"

function Get-LocalVersion {
  try {
    if (Test-Path $VersionFile) {
      $v = (Get-Content $VersionFile -Raw).Trim()
      if ($v) { return $v }
    }
  } catch {}
  return "0.0.0"
}

function Compare-Version {
  param([string]$a, [string]$b)
  $pa = @(($a -split "\.") | ForEach-Object { if ($_ -match "^\d+$") { [int]$_ } else { 0 } })
  $pb = @(($b -split "\.") | ForEach-Object { if ($_ -match "^\d+$") { [int]$_ } else { 0 } })
  while ($pa.Count -lt 3) { $pa += 0 }
  while ($pb.Count -lt 3) { $pb += 0 }
  for ($i = 0; $i -lt 3; $i++) {
    if ($pa[$i] -gt $pb[$i]) { return 1 }
    if ($pa[$i] -lt $pb[$i]) { return -1 }
  }
  return 0
}

function Get-LatestRelease {
  $rel = Invoke-RestMethod -Uri $ReleaseApi -Headers @{ "User-Agent" = "foxai-launcher" } -TimeoutSec 30
  $tag = $rel.tag_name
  if ($tag -like "v*") { $tag = $tag.Substring(1) }
  $asset = $rel.assets | Where-Object { $_.name -match "^FoxAI-Browser-v.*\.zip$" } | Select-Object -First 1
  if (-not $asset) { throw "No FoxAI-Browser zip asset found on GitHub." }
  return @{ Version = $tag; Url = $asset.browser_download_url; Name = $asset.name }
}

function Invoke-LaunchBrowser {
  if (-not (Test-Path $Exe)) {
    Write-Host "Firefox runtime not found: $Exe"
    exit 1
  }
  $running = @(Get-Process firefox -ErrorAction SilentlyContinue | Where-Object { $_.Path -eq $Exe })
  if ($running.Count -gt 0) {
    Write-Host "FoxAI Browser is already running."
    return
  }
  # This Firefox build can crash on startup in some environments (xul.dll
  # breakpoint / limited_access_features); disable the child-sandbox tokens to
  # avoid it. Trade-off: weaker process sandboxing in exchange for a working start.
  $env:MOZ_DISABLE_CONTENT_SANDBOX = "1"
  $env:MOZ_DISABLE_GMP_SANDBOX = "1"
  $env:MOZ_DISABLE_RDD_SANDBOX = "1"
  $env:MOZ_DISABLE_SOCKET_PROCESS = "1"
  $argList = @("-profile", "`"$ProfileDir`"", "-no-remote")
  if ($Private) { $argList += "-private-window" }
  else { $argList += "about:blank" }
  Start-Process -FilePath $Exe -ArgumentList $argList
  Write-Host "FoxAI Browser started."
}

function Invoke-Check {
  $local = Get-LocalVersion
  Write-Host "Local:  v$local"
  $latest = Get-LatestRelease
  Write-Host "Latest: v$($latest.Version)"
  $cmp = Compare-Version $latest.Version $local
  if ($cmp -gt 0) {
    Write-Host "An update is available: v$($latest.Version)"
  } else {
    Write-Host "FoxAI Browser is up to date."
  }
  return @{ Local = $local; Latest = $latest; Cmp = $cmp }
}

function Invoke-Update {
  $info = Invoke-Check
  if ($info.Cmp -le 0) {
    Write-Host "Nothing to update."
    return
  }
  $running = @(Get-Process firefox -ErrorAction SilentlyContinue | Where-Object { $_.Path -eq $Exe })
  if ($running.Count -gt 0) {
    $ans = Read-Host "FoxAI Browser is running. Close it and continue? [y/N]"
    if ($ans -notmatch "^y") { Write-Host "Update cancelled."; return }
    $running | Stop-Process -Force
    Start-Sleep 2
  }
  $tmp = Join-Path $env:TEMP ("foxai-update-" + [guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Force -Path $tmp | Out-Null
  try {
    $zipPath = Join-Path $tmp $info.Latest.Name
    Write-Host "Downloading v$($info.Latest.Version) ..."
    Invoke-WebRequest -Uri $info.Latest.Url -OutFile $zipPath
    Write-Host "Extracting ..."
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath, $tmp)
    $newDir = Join-Path $tmp "firefox-foxai"
    if (-not (Test-Path (Join-Path $newDir "runtime\firefox.exe"))) {
      throw "Downloaded archive is missing firefox-foxai\runtime\firefox.exe"
    }
    # Preserve the user profile (settings, notes, logins) across the update.
    $profileBackup = Join-Path $tmp "profile-backup"
    if (Test-Path $ProfileDir) { Copy-Item $ProfileDir $profileBackup -Recurse -Force }
    $current = Join-Path $Root "firefox-foxai"
    if (Test-Path $current) { Remove-Item $current -Recurse -Force }
    Move-Item $newDir $current
    if (Test-Path $profileBackup) {
      if (-not (Test-Path $ProfileDir)) { New-Item -ItemType Directory -Force -Path $ProfileDir | Out-Null }
      Copy-Item "$profileBackup\*" $ProfileDir -Recurse -Force
    }
    [IO.File]::WriteAllText($VersionFile, $info.Latest.Version, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Updated to v$($info.Latest.Version)."
  } finally {
    Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
  }
}

if ($Version) { Write-Host (Get-LocalVersion); return }
if ($Check) { $null = Invoke-Check; return }
if ($Update) { Invoke-Update; Invoke-LaunchBrowser; return }
Invoke-LaunchBrowser
