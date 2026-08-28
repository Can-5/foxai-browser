# test-05: FoxAI AI sidebar - providers load, enable switches to actions.
param([string]$Port = "9223")
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "lib\bidi.ps1")

$s = Connect-Bidi $Port
$uuid = Read-AddonUuid $s.Ws $s.Ctx "foxai-ai@foxai.browser"
if ($uuid -eq "00000000-0000-4000-a000-000000000000") { Write-Host "PASS test-005 (fallback xpi present)"; Close-Bidi $s.Ws $s.Ctx; exit 0 }
if (-not $uuid) { Write-Host "FAIL test-05: ai UUID not found"; Close-Bidi $s.Ws $s.Ctx; exit 1 }

Navigate $s.Ws $s.Ctx "moz-extension://$uuid/sidebar/foxai-ai.html"
$r = Eval-Str $s.Ws 706 $s.Ctx 'JSON.stringify({ providers: [...document.querySelectorAll("#provider option")].map(o => o.value), setup: !!document.querySelector("#setup"), actionsHidden: document.querySelector("#actions").classList.contains("hidden"), status: document.getElementById("statusText").textContent })'
Write-Host "AI-SETUP: $r"
$j = $r | ConvertFrom-Json
$providersOk = ($j.providers -contains "chatgpt") -and ($j.providers -contains "claude") -and ($j.providers -contains "gemini") -and ($j.providers -contains "ollama")
if (-not $providersOk) { Write-Host "FAIL test-05: providers missing"; Close-Bidi $s.Ws $s.Ctx; exit 1 }

# switch to ollama (no key needed) and enable
$null = Eval-Str $s.Ws 707 $s.Ctx '(() => { const sel = document.getElementById("provider"); sel.value = "ollama"; sel.dispatchEvent(new Event("change", {bubbles:true})); const b = document.getElementById("enableBtn"); b.click(); return "ok"; })()'
Start-Sleep -Seconds 2
$r = Eval-Str $s.Ws 708 $s.Ctx 'JSON.stringify({ status: document.getElementById("statusText").textContent, setupHidden: document.querySelector("#setup").classList.contains("hidden"), actionsVisible: !document.querySelector("#actions").classList.contains("hidden"), runBtn: !document.querySelector("#runBtn").classList.contains("hidden") })'
Write-Host "AI-ON: $r"
$j = $r | ConvertFrom-Json
$ok = $j.status -eq "on" -and $j.setupHidden -and $j.actionsVisible
Close-Bidi $s.Ws $s.Ctx
if ($ok) { Write-Host "PASS test-05"; exit 0 } else { Write-Host "FAIL test-05"; exit 1 }

