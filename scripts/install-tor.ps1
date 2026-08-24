# install-tor.ps1 - Tor Expert Bundle indirip FoxAI yanina kurar.
# Kullanim:  powershell -File scripts\install-tor.ps1
# Sonrasinda: "FoxAI Tor.cmd" ile tarayiciyi Tor uzerinden baslatabilirsin.

param([string]$Version = "")

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$TorDir = "$Root\firefox-foxai\tor"

if (Test-Path "$TorDir\tor\tor.exe") {
    Write-Host "Tor zaten kurulu: $TorDir\tor\tor.exe"
    exit 0
}

Write-Host "==> En yeni Tor Expert Bundle surumu aliniyor..."
$list = (Invoke-WebRequest -Uri "https://dist.torproject.org/torbrowser/" -UseBasicParsing).Content
$candidates = [regex]::Matches($list, 'href="(\d+\.\d+(\.\d+)?)/"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object { [version]$_ } -Descending
if (-not $Version) { $Version = $candidates | Select-Object -First 1 }
Write-Host "    Surum: $Version"

$url = "https://dist.torproject.org/torbrowser/$Version/tor-expert-bundle-windows-x86_64-$Version.tar.gz"
$oldUrl = "https://dist.torproject.org/torbrowser/$Version/tor-win64-$Version.zip"

$tmp = Join-Path $env:TEMP ("tor-dl-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $tmp, $TorDir | Out-Null

try {
    Write-Host "==> Indiriliyor: $url"
    try {
        Invoke-WebRequest -Uri $url -OutFile "$tmp\tor.tar.gz" -UseBasicParsing
        # .tar.gz -> iki asamali acma
        & "C:\Program Files\Git\usr\bin\tar.exe" -xzf "$tmp\tor.tar.gz" -C "$tmp"
        if ($LASTEXITCODE -ne 0) { throw "tar acilamadi" }
        Copy-Item "$tmp\tor" "$TorDir\tor" -Recurse -Force
    } catch {
        Write-Host "    Yeni format yok, eski zip deneniyor..."
        Invoke-WebRequest -Uri $oldUrl -OutFile "$tmp\tor.zip" -UseBasicParsing
        Expand-Archive "$tmp\tor.zip" "$tmp\x" -Force
        Copy-Item "$tmp\x\Tor" "$TorDir\tor" -Recurse -Force -ErrorAction SilentlyContinue
        if (-not (Test-Path "$TorDir\tor\tor.exe")) {
            Copy-Item "$tmp\x\tor" "$TorDir\tor" -Recurse -Force
        }
    }

    if (-not (Test-Path "$TorDir\tor\tor.exe")) { throw "tor.exe bulunamadi!" }

    Write-Host "==> Tor kuruldu: $TorDir\tor\tor.exe"
    Write-Host ""
    Write-Host "Kullanim:"
    Write-Host "   1) Tor'u baslat:  `"$TorDir\tor\tor.exe`" --SocksPort 9050"
    Write-Host "   2) Tarayici:      `"FoxAI Tor.cmd`" (masaustu)"
} finally {
    Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
}
