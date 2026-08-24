. "$PSScriptRoot\lib\bidi.ps1"
$s = Connect-Bidi 9246
$js = '((()=>{const c=document.createElement("canvas");c.width=100;c.height=100;const x=c.getContext("2d");x.fillStyle="rgb(120,40,90)";x.fillRect(0,0,100,100);const d1=c.toDataURL();const c2=document.createElement("canvas");c2.width=100;c2.height=100;const x2=c2.getContext("2d");x2.fillStyle="rgb(120,40,90)";x2.fillRect(0,0,100,100);return JSON.stringify({same:d1===c2.toDataURL()})})())'
$r = Eval-Str $s.Ws 1 $s.Ctx $js
Write-Host "RESULT: $r"
Close-Bidi $s.Ws $s.Ctx