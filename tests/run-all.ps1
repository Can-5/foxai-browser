# run-all.ps1 - start FoxAI headless, run all tests, stop.
param([string]$Port = "9223")
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Runtime = "$Root\firefox-foxai\runtime\firefox.exe"
$Profile = "$Root\firefox-foxai\profile\foxai"

if (-not (Test-Path $Runtime)) { Write-Host "runtime not found: $Runtime"; exit 1 }
if (-not (Test-Path $Profile)) { Write-Host "profile not found: $Profile - run build.ps1 first"; exit 1 }

Get-Process firefox -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "==> Starting FoxAI headless (port $Port)"
$p = Start-Process -FilePath $Runtime -ArgumentList "-profile `"$Profile`" -no-remote -headless --remote-debugging-port=$Port about:blank" -PassThru
Start-Sleep -Seconds 12

$tests = @(
  "test-01-newtab.ps1",
  "test-02-persistence.ps1",
  "test-03-search-engine.ps1",
  "test-04-settings.ps1",
  "test-05-ai-sidebar.ps1",
  "test-06-hardening.ps1"
)
$passed = 0
foreach ($t in $tests) {
  Write-Host ""
  Write-Host "----- $t -----"
  & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot $t) -Port $Port
  if ($LASTEXITCODE -eq 0) { $passed++; Write-Host "$t -> PASS" } else { Write-Host "$t -> FAIL" }
}

if (-not $p.HasExited) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
Get-Process firefox -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=== $passed/$($tests.Count) tests passed ==="
exit $(if ($passed -eq $tests.Count) { 0 } else { 1 })
