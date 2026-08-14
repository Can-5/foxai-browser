# test-04: settings modal - widget toggles, background radios, file input.
param([string]$Port = "9223")
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "lib\bidi.ps1")

$s = Connect-Bidi $Port
$uuid = Read-AddonUuid $s.Ws $s.Ctx "foxai-core@foxai.browser"
if (-not $uuid) { Write-Host "FAIL test-04: core UUID not found"; Close-Bidi $s.Ws $s.Ctx; exit 1 }

Navigate $s.Ws $s.Ctx "moz-extension://$uuid/newtab/index.html"
$null = Eval-Str $s.Ws 704 $s.Ctx '(() => { const b = [...document.querySelectorAll("button")].find(x => x.className.includes("fixed bottom-4")); if (b) b.click(); return b ? "ok" : "no-btn"; })()'
Start-Sleep -Seconds 2
$r = Eval-Str $s.Ws 705 $s.Ctx 'JSON.stringify({ modal: !!document.querySelector(".modal-open"), radios: [...document.querySelectorAll("input[type=radio]")].map(x => x.value), labels: [...document.querySelectorAll(".modal-open label span")].map(s => s.textContent.trim()).filter(t => /Notes|To-do|Bookmarks/.test(t)), files: !!document.querySelector("input[type=file]") })'
Write-Host "SETTINGS: $r"
$j = $r | ConvertFrom-Json
$ok = $j.modal -and $j.radios.Count -ge 3 -and $j.files -and ($j.labels -contains "Notes") -and ($j.labels -contains "To-do") -and ($j.labels -contains "Bookmarks")
Close-Bidi $s.Ws $s.Ctx
if ($ok) { Write-Host "PASS test-04"; exit 0 } else { Write-Host "FAIL test-04"; exit 1 }

