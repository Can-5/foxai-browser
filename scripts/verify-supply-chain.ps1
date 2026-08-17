# verify-supply-chain.ps1 — Supply-chain integrity verification.
# Computes and verifies hashes for all critical artifacts.
# Fails if any hash mismatches (supply-chain tampering detection).

param(
  [switch]$Generate,    # Generate baseline hashes (first run)
  [switch]$Verify       # Verify against baseline (default)
)
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$BaselineFile = "$Root\config\supply-chain-hashes.json"
$ReleaseDir = "$Root\release"

function Get-FileHashes($dir, $pattern) {
  $hashes = @{}
  foreach ($f in Get-ChildItem $dir -Filter $pattern -File -ErrorAction SilentlyContinue) {
    $sha256 = (Get-FileHash $f.FullName -Algorithm SHA256).Hash
    $sha512 = (Get-FileHash $f.FullName -Algorithm SHA512).Hash
    $hashes[$f.Name] = @{ sha256 = $sha256; sha512 = $sha512; size = $f.Length }
  }
  return $hashes
}

if ($Generate) {
  Write-Host "=== GENERATING BASELINE HASHES ==="
  $baseline = @{
    timestamp = (Get-Date -Format u)
    firefox_runtime = Get-FileHashes "$Root\firefox-foxai\runtime" "*.exe"
    xpi_files = Get-FileHashes $ReleaseDir "*.xpi"
    installer = Get-FileHashes $ReleaseDir "FoxAI-Browser-v*.zip"
    ublock_source = @{}  # filled after download
  }

  # uBlock hash from latest release (already in release/)
  $ublock = Get-ChildItem $ReleaseDir -Filter "ublock*.xpi" -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($ublock) {
    $baseline.ublock_source = Get-FileHashes $ReleaseDir "ublock*.xpi"
  }

  $json = $baseline | ConvertTo-Json -Depth 5 -Compress
  [IO.File]::WriteAllText($BaselineFile, $json, [System.Text.Encoding]::UTF8)
  Write-Host "Baseline written to $BaselineFile"
  exit 0
}

# ==== VERIFY MODE ====
if (-not (Test-Path $BaselineFile)) {
  Write-Host "Baseline not found: $BaselineFile. Run with -Generate first." -ForegroundColor Red
  exit 1
}

$raw = Get-Content $BaselineFile -Raw | ConvertFrom-Json
function To-Hash($obj) {
  $h = @{}
  foreach ($p in $obj.PSObject.Properties) {
    if ($p.Value -is [System.Management.Automation.PSCustomObject]) {
      $h[$p.Name] = To-Hash $p.Value
    } else {
      $h[$p.Name] = $p.Value
    }
  }
  return $h
}
$baseline = To-Hash $raw
$Fails = New-Object System.Collections.Generic.List[string]

function Verify-Hashes($label, $current, $expected) {
  foreach ($name in $expected.Keys) {
    if (-not $current.ContainsKey($name)) {
      $Fails.Add("${label}: MISSING file '$name'")
    } else {
      if ($current[$name].sha256 -ne $expected[$name].sha256) {
        $Fails.Add("${label}: SHA256 mismatch for '$name' (expected $($expected[$name].sha256), got $($current[$name].sha256))")
      }
      if ($current[$name].sha512 -ne $expected[$name].sha512) {
        $Fails.Add("${label}: SHA512 mismatch for '$name'")
      }
      if ($current[$name].size -ne $expected[$name].size) {
        $Fails.Add("${label}: Size mismatch for '$name'")
      }
    }
  }
  # Check for unexpected new files
  foreach ($name in $current.Keys) {
    if (-not $expected.ContainsKey($name)) {
      $Fails.Add("${label}: UNEXPECTED file '$name' (not in baseline)")
    }
  }
}

# Firefox runtime
$rtCurrent = Get-FileHashes "$Root\firefox-foxai\runtime" "*.exe"
Verify-Hashes "Firefox Runtime" $rtCurrent $baseline.firefox_runtime

# XPI files
$xpiCurrent = Get-FileHashes $ReleaseDir "*.xpi"
Verify-Hashes "Extensions (XPI)" $xpiCurrent $baseline.xpi_files

# Release zip
$zipCurrent = Get-FileHashes $ReleaseDir "FoxAI-Browser-v*.zip"
Verify-Hashes "Release ZIP" $zipCurrent $baseline.installer

# uBlock
$ublockCurrent = Get-FileHashes $ReleaseDir "ublock*.xpi"
Verify-Hashes "uBlock Origin" $ublockCurrent $baseline.ublock_source

# ==== REPRODUCIBLE BUILD CHECK ====
# Build twice, compare ZIP contents (deterministic build)
# Note: This requires running build twice; skip in CI unless explicitly requested.

if ($Fails.Count -gt 0) {
  Write-Host "=== SUPPLY-CHAIN VERIFICATION FAILED ($($Fails.Count) issues) ===" -ForegroundColor Red
  foreach ($f in $Fails) { Write-Host "  - $f" -ForegroundColor Red }
  exit 1
}
Write-Host "=== SUPPLY-CHAIN VERIFICATION PASSED ===" -ForegroundColor Green
Write-Host "All artifacts match baseline hashes."
exit 0