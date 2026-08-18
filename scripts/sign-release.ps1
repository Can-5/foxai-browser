# sign-release.ps1 — Sign release artifacts with minisign + generate CycloneDX SBOM
# Usage: .\sign-release.ps1 -ZipPath "release\FoxAI-Browser-v2.0.0.zip" -KeyPath "keys\minisign.key"

param(
  [Parameter(Mandatory=$true)][string]$ZipPath,
  [Parameter(Mandatory=$true)][string]$KeyPath,
  [string]$OutDir = "release",
  [switch]$GenerateSBOM
)
$ErrorActionPreference = "Stop"

if (-not (Test-Path $ZipPath)) { throw "ZIP not found: $ZipPath" }
if (-not (Test-Path $KeyPath)) { throw "Private key not found: $KeyPath" }

# Find minisign
$Minisign = "minisign"
if (-not (Get-Command $Minisign -ErrorAction SilentlyContinue)) {
  Write-Host "minisign not in PATH, downloading..." -ForegroundColor Yellow
  $MinisignUrl = "https://github.com/jedisct1/minisign/releases/download/0.11/minisign-0.11-win64.zip"
  $tmp = Join-Path $env:TEMP "minisign.zip"
  Invoke-WebRequest -Uri $MinisignUrl -OutFile $tmp
  Expand-Archive -Path $tmp -DestinationPath (Join-Path $env:TEMP "minisign") -Force
  $Minisign = Join-Path $env:TEMP "minisign\minisign.exe"
  if (-not (Test-Path $Minisign)) { throw "minisign download/extract failed" }
}

# Sign the ZIP
$SigPath = "$ZipPath.minisig"
Write-Host "Signing $ZipPath with $KeyPath..."
& $Minisign -Sm $ZipPath -k $KeyPath -o $SigPath
if (-not (Test-Path $SigPath)) { throw "Signing failed" }
Write-Host "Signature created: $SigPath"

# Verify signature
Write-Host "Verifying signature..."
$PubKey = $KeyPath -replace '\.key$', '.pub'
if (Test-Path $PubKey) {
  & $Minisign -Vm $ZipPath -P (Get-Content $PubKey -Raw).Trim()
  Write-Host "Signature verified ✓"
}

# Generate SBOM (CycloneDX JSON)
if ($GenerateSBOM) {
  $SbomPath = "$OutDir\$(Split-Path $ZipPath -Leaf).sbom.json"
  Write-Host "Generating SBOM: $SbomPath"

  $sbom = @{
    bomFormat = "CycloneDX"
    specVersion = "1.6"
    serialNumber = "urn:uuid:$([guid]::NewGuid())"
    version = 1
    metadata = @{
      timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
      tools = @(@{ name = "FoxAI Build"; version = "2.0.0" })
      component = @{
        type = "application"
        name = "FoxAI Browser"
        version = "2.0.0"
        description = "Privacy-focused Firefox-based browser"
        licenses = @(@{ license = @{ id = "MPL-2.0" } })
        hashes = @(
          @{ alg = "SHA-256"; content = (Get-FileHash $ZipPath -Algorithm SHA256).Hash }
          @{ alg = "SHA-512"; content = (Get-FileHash $ZipPath -Algorithm SHA512).Hash }
        )
      }
    }
    components = @()
  }

  # Add components from supply-chain-hashes.json if exists
  $HashFile = "config\supply-chain-hashes.json"
  if (Test-Path $HashFile) {
    $hashes = Get-Content $HashFile -Raw | ConvertFrom-Json
    function Add-Hashes($obj, $type) {
      foreach ($p in $obj.PSObject.Properties) {
        if ($p.Value -is [System.Management.Automation.PSCustomObject] -and $p.Value.psobject.properties.Count -gt 0 -and $p.Value.psobject.properties["sha256"]) {
          $sbom.components += @{
            type = "library"
            name = $p.Name
            version = "1.0.0"
            hashes = @(@{ alg = "SHA-256"; content = $p.Value.sha256 }, @{ alg = "SHA-512"; content = $p.Value.sha512 })
            purl = "pkg:generic/$($p.Name)?download_url=$type/$($p.Name)"
          }
        } elseif ($p.Value -is [System.Management.Automation.PSCustomObject]) {
          Add-Hashes $p.Value $type
        }
      }
    }
    Add-Hashes $hashes.firefox_runtime "firefox-runtime"
    Add-Hashes $hashes.xpi_files "xpi"
    Add-Hashes $hashes.ublock_source "ublock"
  }

  $json = $sbom | ConvertTo-Json -Depth 10 -Compress
  [IO.File]::WriteAllText($SbomPath, $json, [System.Text.Encoding]::UTF8)
  Write-Host "SBOM generated: $SbomPath"
}

Write-Host "=== SIGNING COMPLETE ===" -ForegroundColor Green
Write-Host "  ZIP: $ZipPath"
Write-Host "  SIG: $SigPath"
if ($GenerateSBOM) { Write-Host "  SBOM: $SbomPath" }