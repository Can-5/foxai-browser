$Root = (Get-Location).Path
$Version = '3.0.0'
$Runtime = "$Root\firefox-foxai\runtime\"
$Dist = "$Root\release\"
$ExtDir = "$Root\extensions\"
$Config = "$Root\config\"

# Package extensions
function New-Zip {
  param([string]$SourceDir, [string]$ZipPath)
  Add-Type -AssemblyName System.IO.Compression
  if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }
  $fs = [System.IO.File]::Create($ZipPath)
  $zip = New-Object System.IO.Compression.ZipArchive($fs, [System.IO.Compression.ZipArchiveMode]::Create)
  try {
    $base = (Resolve-Path $SourceDir).Path
    $files = Get-ChildItem $base -Recurse -File | Sort-Object { $_.FullName.Substring($base.Length + 1).Replace('\', '/') }
    foreach ($f in $files) {
      $rel = $f.FullName.Substring($base.Length + 1).Replace('\', '/')
      $entry = $zip.CreateEntry($rel, [System.IO.Compression.CompressionLevel]::Optimal)
      $in = [System.IO.File]::OpenRead($f.FullName)
      $out = $entry.Open()
      try { $in.CopyTo($out) } finally { $out.Dispose(); $in.Dispose() }
    }
  } finally { $zip.Dispose(); $fs.Dispose() }
}
function New-Xpi {
  param([string]$Name, [string[]]$Items, [string]$OutDir)
  $tmp = Join-Path $env:TEMP "xpi-$Name"
  if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
  New-Item -ItemType Directory -Force -Path $tmp | Out-Null
  foreach ($it in $Items) { Copy-Item $it "$tmp\" -Recurse -Force }
  $xpi = Join-Path $OutDir "$Name.xpi"
  New-Zip -SourceDir $tmp -ZipPath $xpi
  Remove-Item $tmp -Recurse -Force
  return $xpi
}

New-Item -ItemType Directory -Force -Path $Dist | Out-Null
New-Xpi -Name 'foxai-core' -OutDir $Dist -Items @(
  "$ExtDir\foxai-core\manifest.json",
  "$ExtDir\foxai-core\background.js",
  "$ExtDir\foxai-core\newtab",
  "$ExtDir\foxai-core\content"
  "$ExtDir\foxai-core\icons"
)
New-Xpi -Name 'foxai-ai' -OutDir $Dist -Items @(
  "$ExtDir\foxai-ai\manifest.json",
  "$ExtDir\foxai-ai\background.js",
  "$ExtDir\foxai-ai\content",
  "$ExtDir\foxai-ai\lib",
  "$ExtDir\foxai-ai\sidebar",
  "$ExtDir\foxai-ai\icons"
)
New-Xpi -Name 'foxai-search-startpage' -OutDir $Dist -Items @(
  "$ExtDir\foxai-search-startpage\manifest.json",
  "$ExtDir\foxai-search-startpage\startpage",
  "$ExtDir\foxai-search-startpage\icons",
  "$ExtDir\foxai-search-startpage\foxai-mark.svg"
)
New-Xpi -Name 'foxai-gestures' -OutDir $Dist -Items @(
  "$ExtDir\foxai-gestures\manifest.json",
  "$ExtDir\foxai-gestures\background.js",
  "$ExtDir\foxai-gestures\content",
  "$ExtDir\foxai-gestures\icons"
)
Write-Host 'Extensions packaged to' $Dist

# Install extensions
$DistroExt = "$Runtime\distribution\extensions\"
New-Item -ItemType Directory -Force -Path $DistroExt | Out-Null
Remove-Item "$DistroExt\*" -Force -ErrorAction SilentlyContinue
Copy-Item "$Dist\foxai-core.xpi" "$DistroExt\foxai-core@foxai.browser.xpi" -Force
Copy-Item "$Dist\foxai-ai.xpi" "$DistroExt\foxai-ai@foxai.browser.xpi" -Force
Copy-Item "$Dist\foxai-search-startpage.xpi" "$DistroExt\foxai-search-startpage@foxai.local.xpi" -Force
Write-Host 'Extensions installed'

# Install config
Copy-Item "$Config\foxai.cfg" "$Runtime\defaults\pref\foxai.cfg" -Force
$pol = Get-Content "$Config\policies.json" -Raw
function Get-FileUrl($p) { return "file:///" + ($p.Replace('\', '/') -replace ' ', '%20') }
$pol = $pol.Replace("%%CORE%%", (Get-FileUrl "$DistroExt\foxai-core@foxai.browser.xpi"))
$pol = $pol.Replace("%%SEARCH%%", (Get-FileUrl "$DistroExt\foxai-search-startpage@foxai.local.xpi"))
$pol = $pol.Replace("%%AI%%", (Get-FileUrl "$DistroExt\foxai-ai@foxai.browser.xpi"))
[System.IO.File]::WriteAllText("$Runtime\distribution\policies.json", $pol, (New-Object System.Text.UTF8Encoding($false)))
Write-Host 'Config installed'

# Create release zip
$ZipName = "FoxAI-Browser-v$Version.zip"
$ZipPath = "$Dist\$ZipName"
$Stage = "$Dist\stage-$Version"
if (Test-Path $Stage) { Remove-Item $Stage -Recurse -Force }
New-Item -ItemType Directory -Force -Path $Stage | Out-Null
Copy-Item "$Root\firefox-foxai" "$Stage\firefox-foxai" -Recurse -Force
Copy-Item "$Root\FoxAI-Launcher.ps1" "$Stage\FoxAI-Launcher.ps1" -Force
Copy-Item "$Root\FoxAI Browser.cmd" "$Stage\FoxAI Browser.cmd" -Force
Copy-Item "$Root\FoxAI Update.cmd" "$Stage\FoxAI Update.cmd" -Force
[System.IO.File]::WriteAllText("$Stage\version.txt", $Version, (New-Object System.Text.UTF8Encoding($false)))
New-Zip -SourceDir $Stage -ZipPath $ZipPath
Remove-Item $Stage -Recurse -Force
[System.IO.File]::WriteAllText("$Root\version.txt", $Version, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "==> Done. Release: $ZipPath"


