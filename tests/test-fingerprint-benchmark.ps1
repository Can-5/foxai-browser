# test-fingerprint-benchmark.ps1 - FoxAI v3.0.0
# Similarity: instance'lar arasi ozdeslik (canvas haric - tasarim geregi rastgele)
# Canvas Entropy: canvas izi instance'lar arasi FARKLI olmali (cross-session tracking engeli)

param([string]$Port = "9223", [int]$Instances = 3)
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "lib\bidi.ps1")

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

function Get-Fingerprint($port) {
  $s = Connect-Bidi $port
  Navigate $s.Ws $s.Ctx "https://example.com/" 2500
  $fp = Eval-Str $s.Ws 1 $s.Ctx @'
(async () => {
  const out = {};
  out.ua = navigator.userAgent;
  out.platform = navigator.platform;
  out.langs = JSON.stringify(navigator.languages);
  out.tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  out.tzOffset = new Date().getTimezoneOffset();
  out.cores = navigator.hardwareConcurrency;
  out.deviceMemory = typeof navigator.deviceMemory;
  out.screen = screen.width + "x" + screen.height;
  out.colorDepth = screen.colorDepth;
  out.plugins = [...navigator.plugins].map(p=>p.name).join("|");
  out.maxTouch = navigator.maxTouchPoints;
  out.dnt = navigator.doNotTrack;
  out.vendor = navigator.vendor;
  out.webgl = (() => { try { return !!document.createElement("canvas").getContext("webgl"); } catch(e){ return false; } })();
  out.rpc = typeof RTCPeerConnection;
  out.conn = typeof navigator.connection;
  out.battery = typeof navigator.getBattery;
  out.sendBeacon = typeof navigator.sendBeacon;
  out.mediaRecorder = typeof MediaRecorder;
  out.mediaDevices = typeof navigator.mediaDevices;
  out.enumerateDevices = "ERR";
  try { out.enumerateDevices = (await navigator.mediaDevices.enumerateDevices()).length; } catch(e){ out.enumerateDevices = "ERR"; }
  try {
    const c = document.createElement("canvas"); c.width=200; c.height=200;
    const x=c.getContext("2d");
    x.fillStyle="rgb(120,40,90)"; x.fillRect(0,0,200,200);
    x.fillStyle="rgb(30,200,10)"; x.fillRect(50,50,100,100);
    out.canvasHash = c.toDataURL().slice(-40);
  } catch(e) { out.canvasHash = "ERR"; }
  return JSON.stringify(out);
})()
'@
  Close-Bidi $s.Ws $s.Ctx
  return $fp | ConvertFrom-Json
}

function Compare-Fingerprints($fp1, $fp2) {
  $matches = 0
  $total = 0
  foreach ($prop in $fp1.PSObject.Properties) {
    if ($prop.Name -eq "canvasHash") { continue }  # v3.0.0: tasarim geregi rastgele
    $total++
    $v1 = $prop.Value
    $v2 = $fp2.$($prop.Name)
    if ("$v1" -eq "$v2") { $matches++ }
  }
  if ($total -eq 0) { return 0.0 }
  $culture = [System.Globalization.CultureInfo]::InvariantCulture
  return [double]::Parse([math]::Round($matches / $total * 100, 1).ToString($culture), $culture)
}

Write-Host "=== Fingerprint Benchmark v3.0.0 ==="
Write-Host "Starting $Instances headless instances..."

$ports = @()
$procs = @()
for ($i = 0; $i -lt $Instances; $i++) {
  $p = 9223 + $i
  $ports += $p
  $Runtime = "$Root\firefox-foxai\runtime\firefox.exe"
  $Profile = "$Root\firefox-foxai\profile\foxai-bench-$i"
  if (-not (Test-Path $Profile)) {
    New-Item -ItemType Directory -Force -Path $Profile | Out-Null
    Copy-Item "$Root\config\user.js" "$Profile\user.js" -Force
  }
  $env:MOZ_DISABLE_CONTENT_SANDBOX = "1"
  $env:MOZ_DISABLE_GMP_SANDBOX = "1"
  $env:MOZ_DISABLE_RDD_SANDBOX = "1"
  $env:MOZ_DISABLE_SOCKET_PROCESS = "1"
  $proc = Start-Process -FilePath $Runtime -ArgumentList "-profile `"$Profile`" -no-remote -headless --remote-debugging-port=$p about:blank" -PassThru
  $procs += $proc
}
Start-Sleep 15

Write-Host "Collecting fingerprints from $Instances instances..."
$fingerprints = @()
for ($idx = 0; $idx -lt $ports.Count; $idx++) {
  $p = $ports[$idx]
  try {
    $fp = Get-Fingerprint $p
    $fingerprints += $fp
    Write-Host "  Instance ${idx} on port ${p}: OK"
  } catch {
    Write-Host "  Instance ${idx} on port ${p}: FAILED - $($_.Exception.Message)" -ForegroundColor Red
  }
}

foreach ($proc in $procs) {
  if (-not $proc.HasExited) { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue }
}
Get-Process firefox -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*firefox-foxai*"} | Stop-Process -Force -ErrorAction SilentlyContinue

if ($fingerprints.Count -lt 2) {
  Write-Host "Need at least 2 instances for comparison" -ForegroundColor Red
  exit 1
}

# ---- Canvas Entropy (linkability korumasi) ----
$hashes = @($fingerprints | ForEach-Object { $_.canvasHash })
$unique = ($hashes | Sort-Object -Unique).Count
if ($unique -eq $hashes.Count) {
  Write-Host ""
  Write-Host "CANVAS ENTROPY: PASS ($unique/$($hashes.Count) unique - cross-session tracking blocked)" -ForegroundColor Green
} else {
  Write-Host ""
  Write-Host "CANVAS ENTROPY: FAIL ($unique/$($hashes.Count) unique)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Pairwise Similarity Matrix (canvas haric) ==="
$n = $fingerprints.Count

$matrix = New-Object 'object[,]' $n, $n
for ($i = 0; $i -lt $n; $i++) {
  for ($j = 0; $j -lt $n; $j++) {
    if ($i -eq $j) { $matrix[$i,$j] = 100.0 }
    else { $matrix[$i,$j] = [double](Compare-Fingerprints $fingerprints[$i] $fingerprints[$j]) }
  }
}

$culture = [System.Globalization.CultureInfo]::InvariantCulture
Write-Host "       " -NoNewline
for ($j = 0; $j -lt $n; $j++) { Write-Host "  Inst$j" -NoNewline }
Write-Host ""
for ($i = 0; $i -lt $n; $i++) {
  Write-Host "Inst$i  " -NoNewline
  for ($j = 0; $j -lt $n; $j++) {
    $v = $matrix[$i,$j]
    Write-Host "  $($v.ToString('N1', $culture))%" -NoNewline
  }
  Write-Host ""
}

$sum = 0.0; $count = 0
for ($i = 0; $i -lt $n; $i++) {
  for ($j = $i + 1; $j -lt $n; $j++) {
    $sum += $matrix[$i,$j]
    $count++
  }
}
if ($count -gt 0) {
  $avg = [math]::Round($sum / $count, 1)
  Write-Host ""
  Write-Host "=== Average Similarity: $($avg.ToString('N1', $culture))% ==="
  if ($avg -ge 99.9) { Write-Host "PERFECT: Fingerprints identical across instances (100/100)" -ForegroundColor Green }
  elseif ($avg -ge 95) { Write-Host "EXCELLENT: Fingerprints nearly identical" -ForegroundColor Green }
  else { Write-Host "POOR: Low similarity" -ForegroundColor Red }
}

Write-Host ""
Write-Host "=== Key Fingerprint Values (Instance 0) ==="
$fp0 = $fingerprints[0]
$fp0.PSObject.Properties | ForEach-Object { Write-Host "  $($_.Name): $($_.Value)" }

exit 0