. (Join-Path $PSScriptRoot "tests/lib/bidi.ps1")
$s = Connect-Bidi 9223
$r = Eval-Str $s.Ws 1 $s.Ctx 'navigator.hardwareConcurrency'
Write-Host "hwConcurrency: $r"
Close-Bidi $s.Ws $s.Ctx