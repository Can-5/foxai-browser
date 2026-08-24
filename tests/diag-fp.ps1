# diag-fp.ps1 - iki instance parmak izini yan yana karsilastirir
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "lib\bidi.ps1")
$Root = Split-Path -Parent $PSScriptRoot

function Get-FP($port, $idx) {
  $Profile = "$Root\firefox-foxai\profile\foxai-diag-$idx"
  if (-not (Test-Path $Profile)) {
    New-Item -ItemType Directory -Force -Path $Profile | Out-Null
    Copy-Item "$Root\config\user.js" "$Profile\user.js" -Force
  }
  $env:MOZ_DISABLE_CONTENT_SANDBOX = "1"; $env:MOZ_DISABLE_GMP_SANDBOX = "1"
  $env:MOZ_DISABLE_RDD_SANDBOX = "1"; $env:MOZ_DISABLE_SOCKET_PROCESS = "1"
  $proc = Start-Process "$Root\firefox-foxai\runtime\firefox.exe" -ArgumentList "-profile `"$Profile`" -no-remote -headless --remote-debugging-port=$port about:blank" -PassThru
  Start-Sleep 14
  $s = Connect-Bidi $port
  Navigate $s.Ws $s.Ctx 'https://example.com/' 2500
  $js = @'
(async () => { const o={};
o.ua=navigator.userAgent; o.platform=navigator.platform;
o.langs=JSON.stringify(navigator.languages); o.tz=Intl.DateTimeFormat().resolvedOptions().timeZone;
o.cores=navigator.hardwareConcurrency; o.screen=screen.width+"x"+screen.height;
o.colorDepth=screen.colorDepth; o.plugins=[...navigator.plugins].map(p=>p.name).join("|");
o.maxTouch=navigator.maxTouchPoints; o.dnt=navigator.doNotTrack;
const c=document.createElement("canvas"); c.width=200;c.height=200; const x=c.getContext("2d");
x.fillStyle="rgb(120,40,90)";x.fillRect(0,0,200,200);x.fillStyle="rgb(30,200,10)";x.fillRect(50,50,100,100);
o.canvas=c.toDataURL().slice(-40);
// ikinci cizim ayni mi?
const c2=document.createElement("canvas"); const x2=c2.getContext("2d");
x2.fillStyle="rgb(120,40,90)";x2.fillRect(0,0,200,200);x2.fillStyle="rgb(30,200,10)";x2.fillRect(50,50,100,100);
o.canvasSameAsFirst=(c.toDataURL()===c2.toDataURL());
return JSON.stringify(o); })()
'@
  $fp = Eval-Str $s.Ws 1 $s.Ctx $js | ConvertFrom-Json
  Close-Bidi $s.Ws $s.Ctx
  if (-not $proc.HasExited) { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue }
  return $fp
}

$a = Get-FP 9233 0
$b = Get-FP 9234 1

Write-Host "`n=== DIFF ==="
foreach ($p in $a.PSObject.Properties) {
  $v1 = $p.Value; $v2 = $b.$($p.Name)
  $mark = if ("$v1" -eq "$v2") { "=" } else { "X" }
  "{0} {1,-12} : {2}" -f $mark, $p.Name, $(if ($mark -eq "X") { "$v1  <>  $v2" } else { "$v1" })
}
Get-Process firefox -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*firefox-foxai*"} | Stop-Process -Force -ErrorAction SilentlyContinue
