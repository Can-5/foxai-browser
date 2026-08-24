# diag-noise.ps1 - hangi katman canvas'i rastgelelestiriyor?
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "lib\bidi.ps1")
$Root = Split-Path -Parent $PSScriptRoot

$variants = [ordered]@{
  "A_rfp_only"   = 'user_pref("privacy.resistFingerprinting", true);'
  "B_no_rfp"     = ''
  "C_baseline_off" = 'user_pref("privacy.resistFingerprinting", false); user_pref("privacy.fingerprintingProtection", false);'
}

$js = @'
(() => { const c=document.createElement("canvas"); c.width=100;c.height=100;
const x=c.getContext("2d"); x.fillStyle="rgb(120,40,90)"; x.fillRect(0,0,100,100);
const d1=c.toDataURL();
const c2=document.createElement("canvas"); c2.width=100;c2.height=100;
const x2=c2.getContext("2d"); x2.fillStyle="rgb(120,40,90)"; x2.fillRect(0,0,100,100);
const d2=c2.toDataURL();
return JSON.stringify({same:d1===d2}); })()
'@

foreach ($name in $variants.Keys) {
  $prof = "$Root\firefox-foxai\profile\noise-$name"
  if (Test-Path $prof) { Remove-Item $prof -Recurse -Force }
  New-Item -ItemType Directory -Force -Path $prof | Out-Null
  Set-Content "$prof\user.js" ("// t`n" + $variants[$name]) -Encoding ascii
  $env:MOZ_DISABLE_CONTENT_SANDBOX="1"; $env:MOZ_DISABLE_GMP_SANDBOX="1"
  $env:MOZ_DISABLE_RDD_SANDBOX="1"; $env:MOZ_DISABLE_SOCKET_PROCESS="1"
  $p = Start-Process "$Root\firefox-foxai\runtime\firefox.exe" -ArgumentList "-profile `"$prof`" -no-remote -headless --remote-debugging-port=9245 about:blank" -PassThru
  Start-Sleep 12
  try {
    $s = Connect-Bidi 9245
    $r = Eval-Str $s.Ws 1 $s.Ctx $js | ConvertFrom-Json
    "{0,-16} -> sameDraw={1}" -f $name, $r.same
    Close-Bidi $s.Ws $s.Ctx
  } catch { "{0,-16} -> ERR {1}" -f $name, $_.Exception.Message }
  if (-not $p.HasExited) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
}
Get-Process firefox -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*firefox-foxai*"} | Stop-Process -Force -ErrorAction SilentlyContinue
