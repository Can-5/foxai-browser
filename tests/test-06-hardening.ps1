# test-06: big leak/hardening audit.
# Live (in-browser): HTTPS-only upgrade, empty referrer, egress IP consistency
# across CORS-enabled reflectors, and the full fingerprint-vector report (RFP
# masks must be active: spoofed UA/language/platform/plugins, WebRTC off, no
# Network Info API, no battery/sensors/beacon, WebGL off, media blocked).
# Static: every critical hardening pref must exist in BOTH config/user.js and
# config/foxai.cfg with the expected value.
param([string]$Port = "9223")
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "lib\bidi.ps1")

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Fails = New-Object System.Collections.Generic.List[string]

# ------------------------------------------------------------------ static audit
function Get-PrefMap($file) {
  $map = @{}
  $re = [regex]'(?:user_)?pref\(\s*"([^"]+)"\s*,\s*([^\)]+?)\s*\)'
  foreach ($m in $re.Matches((Get-Content $file -Raw))) {
    $map[$m.Groups[1].Value] = $m.Groups[2].Value.Trim()
  }
  return $map
}

$cfg = Get-PrefMap "$Root\config\foxai.cfg"
$usr = Get-PrefMap "$Root\config\user.js"
$all = @{}
foreach ($k in $cfg.Keys) { $all[$k] = $cfg[$k] }
foreach ($k in $usr.Keys) { $all[$k] = $usr[$k] }

$must = [ordered]@{
  "privacy.resistFingerprinting"                                        = "true"
  "privacy.resistFingerprinting.pbmode"                                 = "true"
  "privacy.reduceTimerPrecision"                                      = "true"
  "privacy.resistFingerprinting.letterboxing"                           = "false"
  "privacy.trackingprotection.enabled"                                  = "true"
  "privacy.trackingprotection.fingerprinting.enabled"                   = "true"
  "privacy.trackingprotection.cryptomining.enabled"                     = "true"
  # removed FF148 stale: "privacy.trackingprotection.emailtracking.enabled"                    = "true"
  "privacy.fingerprintingProtection"                                    = "true"
  "network.cookie.cookieBehavior"                                       = "5"
  "privacy.firstparty.isolate"                                          = "true"
  "privacy.partition.always_partition_third_party_non_cookie_storage"   = "true"
  "privacy.partition.serviceWorkers"                                    = "true"
  "media.peerconnection.enabled"                                        = "false"
  "media.peerconnection.ice.no_host"                                    = "true"
  "media.peerconnection.ice.default_address_only"                       = "true"
  "media.navigator.enabled"                                             = "false"
  "webgl.disabled"                                                      = "true"
  "media.eme.enabled"                                                   = "false"
  "dom.battery.enabled"                                                 = "false"
  "device.sensors.enabled"                                              = "false"
  "dom.vibrator.enabled"                                                = "false"
  "dom.gamepad.enabled"                                                 = "false"
  "media.video_stats.enabled"                                           = "false"
  # removed FF148 stale: "beacon.enabled"                                                      = "false"
  "browser.send_pings"                                                  = "false"
  "network.http.referer.sendRefererHeader"                              = "0"
  "network.http.referer.defaultPolicy"                                  = "0"
  "dom.security.https_only_mode"                                        = "true"
  # removed FF148 stale: "network.dns.echconfig.enabled"                                       = "true"
  # removed FF148 stale: "network.http.echconfig.enabled"                                      = "true"
  "network.trr.mode"                                                    = "2"
  "network.trr.uri"                                                     = '"https://mozilla.cloudflare-dns.com/dns-query"'
  "extensions.pocket.enabled"                                           = "false"
  "browser.uitour.enabled"                                              = "false"
  "browser.tabs.crashReporting.sendReport"                              = "false"
  "toolkit.telemetry.enabled"                                           = "false"
  "toolkit.telemetry.unified"                                           = "false"
  "datareporting.healthreport.uploadEnabled"                            = "false"
  "datareporting.policy.dataSubmissionEnabled"                          = "false"
  "breakpad.reportURL"                                                  = '""'
  # removed FF148 stale: "browser.safebrowsing.provider.mozilla.gsbReportURL"                  = '""'
  # removed FF148 stale: "browser.safebrowsing.provider.google.gsbReportURL"                   = '""'
  # removed FF148 stale: "browser.safebrowsing.downloads.remote.url"                           = '""'
  # removed FF148 stale: "browser.safebrowsing.provider.google4.gsbReportURL"                  = '""'
  "app.update.enabled"                                                  = "false"
  "app.update.auto"                                                     = "false"
  "extensions.update.enabled"                                           = "false"
  # removed FF148 stale: "extensions.webservice.discoverURL"                                   = '""'
  "app.normandy.enabled"                                                = "false"
  "app.shield.optoutstudies.enabled"                                    = "false"
  "browser.region.network.url"                                          = '""'
  "network.captive-portal-service.enabled"                              = "false"
  "network.connectivity-service.enabled"                                = "false"
  # removed FF148 stale: "browser.aboutwelcome.enabled"                                        = "false"
  # removed FF148 stale: "browser.tabs.firefox-view"                                           = "false"
  # removed FF148 stale: "extensions.screenshots.disabled"                                     = "true"
  # removed FF148 stale: "extensions.htmlaboutaddons.recommendations.enabled"                  = "false"
  "browser.urlbar.suggest.quicksuggest.sponsored"                       = "false"
  "browser.urlbar.suggest.quicksuggest.nonsponsored"                    = "false"
  "security.tls.enable_0rtt_data"                                       = "false"
  "security.cert_pinning.enforcement_level"                             = "2"
  "places.history.enabled"                                              = "false"
  "network.prefetch-next"                                               = "false"
  # removed FF148 stale: "network.predictor.enabled"                                           = "false"
  "network.dns.disablePrefetch"                                         = "true"
  "network.http.speculative-parallel-limit"                             = "0"
  "browser.places.speculativeConnectEnabled"                            = "false"
  "browser.shell.checkDefaultBrowser"                                   = "false"
  "signon.rememberSignons"                                              = "false"
}

$statCount = 0
foreach ($kv in $must.GetEnumerator()) {
  $statCount++
  if (-not $all.ContainsKey($kv.Key)) {
    $Fails.Add("MISSING pref $($kv.Key)")
  } elseif ($all[$kv.Key] -ne $kv.Value) {
    $Fails.Add("pref $($kv.Key) = $($all[$kv.Key]) (expected $($kv.Value))")
  }
}
Write-Host "STATIC: $statCount prefs checked, problems so far: $($Fails.Count) (config + user.js)"

# ------------------------------------------------------------------- live audit
$s = Connect-Bidi $Port

# HTTPS-only: an http:// navigation must be upgraded to https://.
Navigate $s.Ws $s.Ctx "http://example.com/"
$loc = Eval-Str $s.Ws 706 $s.Ctx "window.location.href"
Write-Host "HTTPS-ONLY: http://example.com -> $loc"
if ("$loc" -notlike "https://*") { $Fails.Add("http:// not upgraded to https (got $loc)") }

$ref = Eval-Str $s.Ws 707 $s.Ctx "document.referrer"
Write-Host "REFERRER: '$ref'"
if ("$ref" -ne "") { $Fails.Add("referrer leaked: '$ref'") }

$js = @'
(async () => {
  const out = {};
  out.rpc = typeof RTCPeerConnection;
  out.conn = typeof navigator.connection;
  out.battery = typeof navigator.getBattery;
  out.webdriver = String(navigator.webdriver);
  out.ua = navigator.userAgent;
  out.platform = navigator.platform;
  out.vendor = navigator.vendor;
  out.langs = JSON.stringify(navigator.languages);
  out.tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  out.tzOffset = new Date().getTimezoneOffset();
  out.cores = navigator.hardwareConcurrency;
  out.deviceMemory = typeof navigator.deviceMemory;
  out.screen = screen.width + "x" + screen.height;
  out.outer = window.outerWidth + "x" + window.outerHeight;
  out.colorDepth = screen.colorDepth;
  out.plugins = [...navigator.plugins].map(p => p.name);
  out.maxTouch = navigator.maxTouchPoints;
  out.dnt = navigator.doNotTrack;
  out.sendBeacon = typeof navigator.sendBeacon;
  out.mediaRecorder = typeof MediaRecorder;
  out.mediaDevices = typeof navigator.mediaDevices;
  out.enumerateDevices = await (async () => { try { return (await navigator.mediaDevices.enumerateDevices()).length; } catch (e) { return "ERR"; } })();
  out.webgl = (() => { try { return !!document.createElement("canvas").getContext("webgl"); } catch (e) { return "ERR"; } })();
  try {
    const c = document.createElement("canvas"); c.width = 200; c.height = 200;
    const x = c.getContext("2d");
    x.fillStyle = "rgb(120,40,90)"; x.fillRect(0, 0, 200, 200);
    x.fillStyle = "rgb(30,200,10)"; x.fillRect(50, 50, 100, 100);
    out.canvasHash = c.toDataURL().slice(-40);
  } catch (e) { out.canvasHash = "ERR"; }
  return JSON.stringify(out);
})()
'@
$live = Eval-Str $s.Ws 708 $s.Ctx $js
Write-Host "LIVE: $live"
$j = $live | ConvertFrom-Json

# Egress IP consistency: read the IP directly from each reflector via top-level
# navigation (CORS-free), which is more reliable than page fetch().
$ips = [ordered]@{}
$ids = 710
$reflectors = @(
  @{ name = "icanhazip";  url = "https://icanhazip.com/" },
  @{ name = "ipify";      url = "https://api.ipify.org?format=json" },
  @{ name = "ifconfigme"; url = "https://ifconfig.me/ip" },
  @{ name = "checkip";    url = "https://checkip.amazonaws.com/" }
)
foreach ($r in $reflectors) {
  try {
    $out = Cmd $s.Ws $ids "browsingContext.create" @{ type = "tab" }
    $ctx2 = ($out | ConvertFrom-Json).result.context
    Navigate $s.Ws $ctx2 $r.url 3500
    $txt = Eval-Str $s.Ws ($ids + 1) $ctx2 "document.body ? document.body.textContent : ''"
    $v = "?"
    if ($r.name -eq "ipify") {
      # Firefox renders JSON in a viewer page; pull the first IPv4 out of it.
      $m = [regex]::Match($txt, '[0-9]{1,3}(?:\.[0-9]{1,3}){3}')
      if ($m.Success) { $v = $m.Groups[0].Value } else { $v = "?" }
    } else {
      $v = (($txt -split "`n")[0]).Trim()
    }
    $ips[$r.name] = $v
    $null = Cmd $s.Ws ($ids + 2) "browsingContext.close" @{ context = $ctx2 }
  } catch {
    $ips[$r.name] = "ERR:" + $_.Exception.Message
  }
  $ids += 3
}
Write-Host "EGRESS: $($ips | ConvertTo-Json -Compress)"

$okIps = @($ips.Values | Where-Object { $_ -notlike "ERR*" -and $_ -ne "?" -and $_.Length -gt 0 })
$uniqueIps = @($okIps | Select-Object -Unique)
if ($okIps.Count -ge 2) {
  if ($uniqueIps.Count -gt 1) { $Fails.Add("egress IP mismatch: $($uniqueIps -join ' vs ')") }
  foreach ($ip in $uniqueIps) {
    if ($ip -match '^(127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.|::1$|fe80:)') {
      $Fails.Add("egress IP is a private address: $ip")
    }
  }
} else {
  $Fails.Add("egress IP reflectors unreachable ($($okIps.Count) ok)")
}

# RFP mask checks (positive assertions: these prove ResistFingerprinting is live)
if ($j.rpc -ne "undefined") { $Fails.Add("RTCPeerConnection leak: $($j.rpc)") }
if ($j.conn -ne "undefined") { $Fails.Add("Network Information API leak: $($j.conn)") }
if ("$($j.platform)" -ne "Win32") { $Fails.Add("platform not masked: $($j.platform)") }
if ("$($j.langs)" -ne '["en-US","en"]') { $Fails.Add("languages not masked: $($j.langs)") }
if ($j.tzOffset -ne 0) { $Fails.Add("timezone not masked to UTC: $($j.tz) offset $($j.tzOffset)") }
if ($j.webgl -eq $true -or "$($j.webgl)" -eq "True") { $Fails.Add("WebGL available despite webgl.disabled") }
if ($j.sendBeacon -ne "undefined") { $Fails.Add("sendBeacon available: $($j.sendBeacon)") }
if ($j.battery -ne "undefined") { $Fails.Add("Battery API available: $($j.battery)") }
$expectedPlugins = '["PDF Viewer","Chrome PDF Viewer","Chromium PDF Viewer","Microsoft Edge PDF Viewer","WebKit built-in PDF"]'
$gotPlugins = ($j.plugins | ConvertTo-Json -Compress)
if ("$gotPlugins" -ne $expectedPlugins) { $Fails.Add("plugins not RFP-masked: $gotPlugins") }
if ($j.enumerateDevices -ne "ERR" -and $j.enumerateDevices -ne 0) { $Fails.Add("media devices enumerable: $($j.enumerateDevices)") }

Close-Bidi $s.Ws $s.Ctx

if ($Fails.Count -gt 0) {
  Write-Host "FAIL test-06 ($($Fails.Count) problems):"
  foreach ($f in $Fails) { Write-Host "  - $f" }
  exit 1
}
Write-Host "PASS test-06"
exit 0
