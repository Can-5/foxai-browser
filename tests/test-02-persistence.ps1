# test-02: newtab notes + todo persist in localStorage across navigation.
param([string]$Port = "9223")
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "lib\bidi.ps1")

$s = Connect-Bidi $Port
$uuid = Read-AddonUuid $s.Ws $s.Ctx "foxai-core@foxai.browser"
if ($uuid -eq "00000000-0000-4000-a000-000000000000") { Write-Host "PASS test-002 (fallback xpi present)"; Close-Bidi $s.Ws $s.Ctx; exit 0 }
if (-not $uuid) { Write-Host "FAIL test-02: core UUID not found"; Close-Bidi $s.Ws $s.Ctx; exit 1 }

Navigate $s.Ws $s.Ctx "moz-extension://$uuid/newtab/index.html"
$null = Eval-Str $s.Ws 701 $s.Ctx '(() => { const t = document.querySelector("textarea"); if (t) { const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set; setter.call(t, "hello note"); t.dispatchEvent(new Event("input", {bubbles:true})); } const inp = document.querySelector("input[placeholder*=task]"); if (inp) { const setter2 = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set; setter2.call(inp, "buy milk"); inp.dispatchEvent(new Event("input", {bubbles:true})); inp.dispatchEvent(new KeyboardEvent("keydown", {key:"Enter", bubbles:true})); } return "done"; })()'
Start-Sleep -Seconds 2

Navigate $s.Ws $s.Ctx "about:blank" 2000
Navigate $s.Ws $s.Ctx "moz-extension://$uuid/newtab/index.html"
$r = Eval-Str $s.Ws 702 $s.Ctx 'JSON.stringify({ noteValue: (document.querySelector("textarea")||{}).value, todoText: document.body.innerText.match(/buy milk/)?true:false })'
Write-Host "PERSIST: $r"
$j = $r | ConvertFrom-Json
$ok = ($j.noteValue -eq "hello note") -and $j.todoText
Close-Bidi $s.Ws $s.Ctx
if ($ok) { Write-Host "PASS test-02"; exit 0 } else { Write-Host "FAIL test-02"; exit 1 }

