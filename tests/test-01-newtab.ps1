# test-01: FoxAI Start new tab renders (title, search input, widgets).
param([string]$Port = "9223")
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "lib\bidi.ps1")

$s = Connect-Bidi $Port
$uuid = Read-AddonUuid $s.Ws $s.Ctx "foxai-core@foxai.browser"
if (-not $uuid) { Write-Host "FAIL test-01: core UUID not found"; Close-Bidi $s.Ws $s.Ctx; exit 1 }

Navigate $s.Ws $s.Ctx "moz-extension://$uuid/newtab/index.html"
$r = Eval-Str $s.Ws 700 $s.Ctx 'JSON.stringify({ title: document.title, hasSearch: !!document.querySelector("input[type=text]"), notes: !!document.body.innerText.match(/Notes/), bookmarks: !!document.body.innerText.match(/Bookmarks/), toto: !!document.body.innerText.match(/To-do/) })'
Write-Host "NEWTAB: $r"
$j = $r | ConvertFrom-Json
$ok = ($j.title -eq "FoxAI Start") -and $j.hasSearch -and $j.notes -and $j.bookmarks -and $j.toto
Close-Bidi $s.Ws $s.Ctx
if ($ok) { Write-Host "PASS test-01"; exit 0 } else { Write-Host "FAIL test-01"; exit 1 }

