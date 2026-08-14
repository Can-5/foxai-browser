# test-03: default search engine is DuckDuckGo (via extension page browser.search.get()).
param([string]$Port = "9223")
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "lib\bidi.ps1")

$s = Connect-Bidi $Port
$uuid = Read-AddonUuid $s.Ws $s.Ctx "foxai-core@foxai.browser"
if (-not $uuid) { Write-Host "FAIL test-03: core UUID not found"; Close-Bidi $s.Ws $s.Ctx; exit 1 }

Navigate $s.Ws $s.Ctx "moz-extension://$uuid/newtab/index.html"
$r = Eval-Str $s.Ws 703 $s.Ctx '(async () => { const eng = await browser.search.get(); return JSON.stringify({ defaultName: (eng.find(e => e.isDefault) || {}).name, hasDuck: !!eng.find(e => e.name === "DuckDuckGo"), names: eng.map(e => e.name) }); })()'
Write-Host "ENGINES: $r"
$j = $r | ConvertFrom-Json
$ok = ($j.defaultName -eq "DuckDuckGo") -and $j.hasDuck
Close-Bidi $s.Ws $s.Ctx
if ($ok) { Write-Host "PASS test-03"; exit 0 } else { Write-Host "FAIL test-03"; exit 1 }

