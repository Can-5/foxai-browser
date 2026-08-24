. (Join-Path $PSScriptRoot "tests/lib/bidi.ps1")
$s = Connect-Bidi 9223
$prefs = Eval-Str $s.Ws 1 $s.Ctx 'JSON.stringify({hw: navigator.hardwareConcurrency, mt: navigator.maxTouchPoints, dm: navigator.deviceMemory, mr: typeof MediaRecorder})'
Write-Host $prefs
Close-Bidi $s.Ws $s.Ctx