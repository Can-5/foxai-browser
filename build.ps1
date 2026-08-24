# build.ps1 - FoxAI Browser build script.
# 1. Builds foxai-core newtab (Vite)
# 2. Packages extensions into .xpi files
# 3. Downloads uBlock Origin
# 4. Installs everything into the runtime distribution
# 5. Applies branding (rcedit icon + version strings)
# 6. Creates a fresh FoxAI profile
# 7. Zips the browser into release\

param(
  [switch]$SkipProfile,
  [switch]$Reproducible,
  [string]$ESR_VERSION = "153.0esr",
  [string]$ESR_URL = "https://ftp.mozilla.org/pub/firefox/releases/153.0esr/win64/en-US/Firefox%20Setup%20153.0esr.exe"
)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Version = "2.6.0"
$Runtime = "$Root\firefox-foxai\runtime"
$Dist = "$Root\release"
$ExtDir = "$Root\extensions"
$Config = "$Root\config"
$Rcedit = "$Root\_salvage\rcedit-x64.exe"
$Assets = "$Root\assets"

# Reproducible build: fixed timestamp (SOURCE_DATE_EPOCH or fixed)
if ($Reproducible) {
  $BuildTimestamp = [DateTime]::ParseExact("2026-08-14 00:00:00Z", "yyyy-MM-dd HH:mm:ssZ", $null)
  $env:SOURCE_DATE_EPOCH = [int][double]::Parse((Get-Date $BuildTimestamp -UFormat %s))
  Write-Host "Reproducible mode: SOURCE_DATE_EPOCH=$($env:SOURCE_DATE_EPOCH)"
} else {
  $BuildTimestamp = Get-Date
}

function Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }

# ---------------------------------------------------------------- 0. Ensure Firefox ESR runtime
function Ensure-FirefoxRuntime {
  if (-not (Test-Path "$Runtime\firefox.exe")) {
    Step "Downloading Firefox ESR $ESR_VERSION"
    $installer = "$Root\FirefoxSetup.exe"
    Invoke-WebRequest -Uri $ESR_URL -OutFile $installer -ProgressAction SilentlyContinue
    Step "Extracting Firefox runtime"
    7z x $installer -o"$Runtime" -y > $null
    if (Test-Path "$Runtime\core") {
      Move-Item -Path "$Runtime\core\*" -Destination "$Runtime\" -Force
      Remove-Item "$Runtime\core" -Recurse -Force
    }
    Remove-Item $installer -Force -ErrorAction SilentlyContinue
    Write-Host "  Firefox ESR ready at $Runtime"
  } else {
    Write-Host "  Firefox ESR already present at $Runtime"
  }
}
Ensure-FirefoxRuntime

# ---------------------------------------------------------------- 1. newtab
Step "Building foxai-core newtab (Vite)"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw "node not found" }
Push-Location "$ExtDir\foxai-core"
Copy-Item "newtab\index.html.src" "newtab\index.html" -Force
Remove-Item "newtab\assets" -Recurse -Force -ErrorAction SilentlyContinue
if ($Reproducible) {
  $env:NODE_ENV = "production"
  $env:SOURCE_DATE_EPOCH = $env:SOURCE_DATE_EPOCH
}
npm run build
if ($LASTEXITCODE -ne 0) { throw "vite build failed" }
Pop-Location
Copy-Item "$ExtDir\foxai-core\dist-newtab\index.html" "$ExtDir\foxai-core\newtab\index.html" -Force
Copy-Item "$ExtDir\foxai-core\dist-newtab\favicon.svg" "$ExtDir\foxai-core\newtab\favicon.svg" -Force
Remove-Item "$ExtDir\foxai-core\newtab\assets" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item "$ExtDir\foxai-core\dist-newtab\assets" "$ExtDir\foxai-core\newtab\assets" -Recurse -Force

# ---------------------------------------------------------------- 2. XPIs
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
      if ($Reproducible) {
        $entry.LastWriteTime = $BuildTimestamp
      }
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
  New-Item -ItemType Directory -Path $tmp | Out-Null
  foreach ($it in $Items) { Copy-Item $it "$tmp\" -Recurse -Force }
  $xpi = if ($Name -like "*.xpi") { Join-Path $OutDir $Name } else { "$OutDir\$Name.xpi" }
  New-Zip -SourceDir $tmp -ZipPath $xpi
  Remove-Item $tmp -Recurse -Force
  return $xpi
}

Step "Packaging extensions"
New-Item -ItemType Directory -Force -Path $Dist | Out-Null
New-Xpi -Name "foxai-core.xpi" -OutDir $Dist -Items @(
  "$ExtDir\foxai-core\manifest.json",
  "$ExtDir\foxai-core\background.js",
  "$ExtDir\foxai-core\newtab",
  "$ExtDir\foxai-core\icons"
)
New-Xpi -Name "foxai-ai.xpi" -OutDir $Dist -Items @(
  "$ExtDir\foxai-ai\manifest.json",
  "$ExtDir\foxai-ai\background.js",
  "$ExtDir\foxai-ai\content",
  "$ExtDir\foxai-ai\lib",
  "$ExtDir\foxai-ai\sidebar",
  "$ExtDir\foxai-ai\icons"
)
New-Xpi -Name "foxai-search-startpage.xpi" -OutDir $Dist -Items @(
  "$ExtDir\foxai-search-startpage\manifest.json",
  "$ExtDir\foxai-search-startpage\startpage",
  "$ExtDir\foxai-search-startpage\icons",
  "$ExtDir\foxai-search-startpage\foxai-mark.svg"
)
New-Xpi -Name "foxai-gestures.xpi" -OutDir $Dist -Items @(
  "$ExtDir\foxai-gestures\manifest.json",
  "$ExtDir\foxai-gestures\background.js",
  "$ExtDir\foxai-gestures\content",
  "$ExtDir\foxai-gestures\icons"
)
Step "Extensions packaged to $Dist"

# ---------------------------------------------------------------- 3. uBlock
Step "Downloading uBlock Origin"
if ($Reproducible) {
  $UBLOCK_VERSION = "1.73.0"
  $UBLOCK_URL = "https://github.com/gorhill/uBlock/releases/download/$UBLOCK_VERSION/uBlock0_$UBLOCK_VERSION.firefox.signed.xpi"
  Write-Host "  Using pinned uBlock version: $UBLOCK_VERSION"
  Invoke-WebRequest -Uri $UBLOCK_URL -OutFile "$Dist\ublock0.xpi"
  Write-Host "  downloaded uBlock0_$UBLOCK_VERSION.firefox.signed.xpi"
} else {
  try {
    $rel = Invoke-RestMethod -Uri "https://api.github.com/repos/gorhill/uBlock/releases/latest" -Headers @{ "User-Agent" = "foxai-build" }
    $asset = $rel.assets | Where-Object { $_.name -match "ublock.*firefox.*\.xpi$" -or $_.name -match "^uBlock0_.*\.xpi$" } | Select-Object -First 1
    if (-not $asset) { $asset = $rel.assets | Where-Object { $_.name -match "\.xpi$" } | Select-Object -First 1 }
    if (-not $asset) { throw "no xpi asset found" }
    Invoke-WebRequest -Uri $asset.browser_download_url -OutFile "$Dist\ublock0.xpi"
    Write-Host "  downloaded $($asset.name)"
  } catch {
    Write-Host "  WARN: uBlock download failed - $($_.Exception.Message)" -ForegroundColor Yellow
  }
}

# ---------------------------------------------------------------- 4. install
Step "Installing extensions into runtime distribution"
$DistroExt = "$Runtime\distribution\extensions"
New-Item -ItemType Directory -Force -Path $DistroExt | Out-Null
Remove-Item "$DistroExt\*" -Force -ErrorAction SilentlyContinue
Copy-Item "$Dist\foxai-core.xpi" "$DistroExt\foxai-core@foxai.browser.xpi" -Force
Copy-Item "$Dist\foxai-ai.xpi" "$DistroExt\foxai-ai@foxai.browser.xpi" -Force
Copy-Item "$Dist\foxai-search-startpage.xpi" "$DistroExt\foxai-search-startpage@foxai.local.xpi" -Force
if (Test-Path "$Dist\ublock0.xpi") { Copy-Item "$Dist\ublock0.xpi" "$DistroExt\uBlock0@raymondhill.net.xpi" -Force }

Step "Installing config"
Copy-Item "$Config\foxai.cfg" "$Runtime\defaults\pref\foxai.cfg" -Force
$pol = Get-Content "$Config\policies.json" -Raw
function Get-FileUrl($p) { return "file:///" + ($p.Replace('\', '/') -replace ' ', '%20') }
$pol = $pol.Replace("%%CORE%%", (Get-FileUrl "$DistroExt\foxai-core@foxai.browser.xpi"))
$pol = $pol.Replace("%%SEARCH%%", (Get-FileUrl "$DistroExt\foxai-search-startpage@foxai.local.xpi"))
$pol = $pol.Replace("%%AI%%", (Get-FileUrl "$DistroExt\foxai-ai@foxai.browser.xpi"))
$pol = $pol.Replace("%%UBLOCK%%", (Get-FileUrl "$DistroExt\uBlock0@raymondhill.net.xpi"))
[System.IO.File]::WriteAllText("$Runtime\distribution\policies.json", $pol, (New-Object System.Text.UTF8Encoding($false)))

# ---------------------------------------------------------------- 5. branding
Step "Branding executables (rcedit)"
if (-not $Reproducible) {
  $Ico = "$Assets\foxai.ico"
  if (-not (Test-Path $Ico)) {
    $png = [IO.File]::ReadAllBytes("$Assets\foxai-128.png")
    $ms = New-Object IO.MemoryStream
    $bw = New-Object IO.BinaryWriter($ms)
    $bw.Write([uint16]0); $bw.Write([uint16]1); $bw.Write([uint16]1)
    $bw.Write([byte]128); $bw.Write([byte]128)
    $bw.Write([byte]0); $bw.Write([byte]0)
    $bw.Write([uint16]1); $bw.Write([uint16]32)
    $bw.Write([uint32]$png.Length); $bw.Write([uint32]22)
    $bw.Write($png)
    $bw.Flush()
    [IO.File]::WriteAllBytes($Ico, $ms.ToArray())
  }
  $exes = @("firefox.exe", "private_browsing.exe")
  foreach ($exe in $exes) {
    $p = "$Runtime\$exe"
    if (Test-Path $p) {
      & $Rcedit $p --set-icon $Ico --set-version-string "ProductName" "FoxAI Browser" --set-version-string "FileDescription" "FoxAI Browser" --set-file-version "$Version.0.0" --set-product-version "$Version.0.0" 2>&1 | Out-Null
      Write-Host "  branded $exe"
    }
  }
} else {
  Write-Host "  Skipping rcedit branding (reproducible mode)"
}

# ---------------------------------------------------------------- 6. profile
if (-not $SkipProfile -and -not $Reproducible) {
  Step "Creating fresh FoxAI profile"
  $Profile = "$Root\firefox-foxai\profile\foxai"
  if (Test-Path $Profile) { Remove-Item $Profile -Recurse -Force }
  New-Item -ItemType Directory -Force -Path $Profile | Out-Null
  Copy-Item "$Config\user.js" "$Profile\user.js" -Force
  $p = Start-Process -FilePath "$Runtime\firefox.exe" -ArgumentList "-profile `"$Profile`" -no-remote -headless about:blank" -PassThru
  Start-Sleep -Seconds 25
  if (-not $p.HasExited) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
  Start-Sleep -Seconds 2
  Write-Host "  profile ready: $Profile"
} elseif ($Reproducible) {
  Write-Host "  Skipping profile creation (reproducible mode)"
}

# ---------------------------------------------------------------- 7. zip
Step "Creating release zip"
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

