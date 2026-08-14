# launch.ps1 - starts the FoxAI Browser GUI with the FoxAI profile.
# Disables the Windows sandbox feature tokens that make Firefox crash on
# startup in this environment (xul.dll breakpoint, "limited_access_features").
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Exe = "$Root\firefox-foxai\runtime\firefox.exe"
$Profile = "$Root\firefox-foxai\profile\foxai"
Get-Process firefox -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep 2
$env:MOZ_DISABLE_CONTENT_SANDBOX = "1"
$env:MOZ_DISABLE_GMP_SANDBOX = "1"
$env:MOZ_DISABLE_RDD_SANDBOX = "1"
$env:MOZ_DISABLE_SOCKET_PROCESS = "1"
Start-Process -FilePath $Exe -ArgumentList "-profile `"$Profile`" -no-remote about:blank"
Write-Host "FoxAI Browser baslatildi."
