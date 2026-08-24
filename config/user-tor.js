// FoxAI Browser - profile overrides (copied to profile\foxai\user.js by build.ps1)
user_pref("xpinstall.signatures.required", false);
user_pref("extensions.installDistroAddons", true);
user_pref("extensions.autoDisableScopes", 0);
user_pref("privacy.trackingprotection.enabled", true);
user_pref("privacy.trackingprotection.socialtracking.enabled", true);
user_pref("privacy.trackingprotection.cryptomining.enabled", true);
user_pref("privacy.trackingprotection.fingerprinting.enabled", true);
user_pref("privacy.fingerprintingProtection", true);
user_pref("privacy.fingerprintingProtection.pbmode", true);
user_pref("browser.newtabpage.activity-stream.enabled", false);
user_pref("datareporting.policy.dataSubmissionEnabled", false);
user_pref("browser.search.suggest.enabled", false);

// ---- privacy hardening ----
user_pref("extensions.formautofill.addresses.enabled", false);
user_pref("extensions.formautofill.creditCards.enabled", false);
user_pref("browser.formfill.enable", false);
user_pref("network.prefetch-next", false);
user_pref("network.predictor.enabled", false);
user_pref("network.dns.disablePrefetch", true);
user_pref("network.http.referer.defaultPolicy", 0);
user_pref("network.http.referer.trimmingPolicy", 2);
user_pref("network.http.referer.sendRefererHeader", 0);
user_pref("beacon.enabled", false);
user_pref("browser.send_pings", false);
user_pref("device.sensors.enabled", false);
user_pref("dom.battery.enabled", false);
user_pref("media.navigator.enabled", false);
user_pref("media.peerconnection.enabled", false);
user_pref("privacy.firstparty.isolate", true);
user_pref("network.IDN_show_punycode", true);
user_pref("dom.security.https_only_mode", true);
user_pref("network.dns.echconfig.enabled", true);
user_pref("network.http.echconfig.enabled", true);
user_pref("extensions.pocket.enabled", false);
user_pref("media.recorder.enabled", false);
user_pref("intl.accept_languages", "en-US,en");
user_pref("intl.locale.requested", "");
user_pref("browser.uitour.enabled", false);
user_pref("browser.tabs.crashReporting.sendReport", false);

// ---- Firefox-fork hardening (LibreWolf / Arkenfox style) ----
user_pref("privacy.resistFingerprinting", true);
user_pref("privacy.resistFingerprinting.pbmode", true);
user_pref("privacy.resistFingerprinting.reduceTimerPrecision", true);
user_pref("privacy.resistFingerprinting.autoDeclineNoUserInputCanvasPrompts", true);
user_pref("privacy.resistFingerprinting.letterboxing", false);
user_pref("privacy.trackingprotection.emailtracking.enabled", true);
user_pref("network.cookie.cookieBehavior", 5);
user_pref("privacy.sanitize.sanitizeOnShutdown", true);
user_pref("privacy.clearOnShutdown.cache", true);
user_pref("privacy.clearOnShutdown.cookies", false);
user_pref("privacy.clearOnShutdown.downloads", false);
user_pref("privacy.clearOnShutdown.formdata", true);
user_pref("privacy.clearOnShutdown.history", true);
user_pref("privacy.clearOnShutdown.offlineApps", false);
user_pref("privacy.clearOnShutdown.sessions", true);
user_pref("privacy.clearOnShutdown.siteSettings", false);
user_pref("webgl.disabled", true);
user_pref("media.eme.enabled", false);
user_pref("browser.pagethumbnails.capturing_disabled", true);
user_pref("browser.cache.disk_cache_ssl", false);
user_pref("browser.download.useDownloadDir", false);
user_pref("toolkit.telemetry.enabled", false);
user_pref("toolkit.telemetry.unified", false);
user_pref("datareporting.healthreport.uploadEnabled", false);
user_pref("browser.newtabpage.activity-stream.feeds.telemetry", false);
user_pref("browser.ping-centre.telemetry", false);
user_pref("breakpad.reportURL", "");
user_pref("browser.sessionstore.privacy_level", 2);

// ---- Tab behaviour (fork style) ----
user_pref("browser.tabs.insertAfterCurrent", true);
user_pref("browser.tabs.loadDivertedInBackground", true);
user_pref("browser.tabs.closeWindowWithLastTab", false);
user_pref("browser.tabs.warnOnOpen", false);
user_pref("browser.tabs.unloadOnLowMemory", true);
user_pref("browser.tabs.allowTabDetach", true);
user_pref("browser.sessionstore.restore_on_demand", true);
user_pref("browser.sessionstore.resume_from_crash", false);

// ---- DNS-over-HTTPS (kills DNS leak tests) ----
user_pref("network.trr.mode", 2);
user_pref("network.trr.uri", "https://mozilla.cloudflare-dns.com/dns-query");

// ---- Extra leak hardening ----
user_pref("privacy.trackingprotection.fingerprinting.enabled", true);
user_pref("privacy.trackingprotection.cryptomining.enabled", true);
user_pref("media.peerconnection.ice.no_host", true);
user_pref("media.peerconnection.ice.default_address_only", true);
user_pref("browser.safebrowsing.provider.google.gsbReportURL", "");
user_pref("browser.safebrowsing.provider.mozilla.gsbReportURL", "");
user_pref("browser.safebrowsing.downloads.remote.url", "");
user_pref("browser.safebrowsing.provider.google4.gsbReportURL", "");
user_pref("browser.safebrowsing.provider.google4.dataSharingURL", "");

// ---- Kill all remote/phone-home connections ----
user_pref("app.update.enabled", false);
user_pref("app.update.auto", false);
user_pref("app.update.autoInstallEnabled", false);
user_pref("app.update.service.enabled", false);
user_pref("extensions.update.enabled", false);
user_pref("extensions.update.autoUpdateDefault", false);
user_pref("extensions.webservice.discoverURL", "");
user_pref("app.normandy.enabled", false);
user_pref("app.shield.optoutstudies.enabled", false);
user_pref("browser.region.network.url", "");
user_pref("browser.region.update.enabled", false);
user_pref("network.captive-portal-service.enabled", false);
user_pref("network.connectivity-service.enabled", false);
user_pref("browser.messaging-system.whatsNewPanel.enabled", false);
user_pref("browser.aboutwelcome.enabled", false);
user_pref("browser.tabs.firefox-view", false);
user_pref("extensions.screenshots.disabled", true);
user_pref("extensions.htmlaboutaddons.recommendations.enabled", false);
user_pref("browser.urlbar.suggest.quicksuggest.sponsored", false);
user_pref("browser.urlbar.suggest.quicksuggest.nonsponsored", false);
user_pref("browser.urlbar.suggest.searches", false);
user_pref("devtools.debugger.remote-enabled", false);

// ---- Remaining fingerprint/leak vectors ----
user_pref("dom.vibrator.enabled", false);
user_pref("dom.gamepad.enabled", false);
user_pref("media.video_stats.enabled", false);
user_pref("privacy.partition.always_partition_third_party_non_cookie_storage", true);
user_pref("privacy.partition.serviceWorkers", true);
user_pref("security.ssl.enable_0rtt_data", false);
user_pref("security.cert_pinning.enforcement_level", 2);

// ---- Performance (fewer wasted connections, more cache, lighter writes) ----
user_pref("network.http.speculative-parallel-limit", 0);
user_pref("browser.places.speculativeConnectEnabled", false);
user_pref("network.http.max-connections", 1200);
user_pref("network.http.max-persistent-connections-per-server", 9);
user_pref("browser.cache.disk.capacity", 524288);
user_pref("browser.cache.disk.smart_size.enabled", false);
user_pref("browser.sessionstore.interval", 180000);
user_pref("browser.sessionstore.max_tabs_undo", 8);
user_pref("browser.sessionhistory.max_entries", 30);
user_pref("places.history.enabled", false);
user_pref("browser.shell.checkDefaultBrowser", false);
user_pref("browser.disableResetPrompt", true);

# ---- Maximum Performance (Startup/Render Optimization) ----
user_pref("browser.startup.blankWindow", true);
user_pref("browser.startup.homepage_override.mstone", "ignore");
user_pref("startup.homepage_welcome_url", "");
user_pref("startup.homepage_welcome_url.additional", "");
user_pref("browser.aboutwelcome.enabled", false);
user_pref("browser.aboutConfig.showWarning", false);
user_pref("toolkit.startup.max_resumed_crashes", "-1");
user_pref("browser.sessionstore.max_resumed_crashes", -1);
user_pref("browser.sessionstore.max_tabs_undo", 5);
user_pref("browser.sessionstore.max_windows_undo", 2);
user_pref("dom.max_script_run_time", 10);
user_pref("dom.max_chrome_script_run_time", 0);
user_pref("javascript.options.jit", true);
user_pref("javascript.options.baselinejit", true);
user_pref("javascript.options.ion", true);
user_pref("javascript.options.wasm", true);
user_pref("javascript.options.wasm_baselinejit", true);
user_pref("javascript.options.wasm_ion", true);
user_pref("layers.acceleration.force-enabled", true);
user_pref("layers.gpu-process.enabled", true);
user_pref("gfx.webrender.all", true);
user_pref("gfx.webrender.enabled", true);
user_pref("gfx.webrender.compositor", true);
user_pref("layers.acceleration.disabled", false);
user_pref("layout.frame_rate", 0);
user_pref("layout.frame_rate.precise", true);
user_pref("image.mem.min_discard_timeout_ms", 1000);
user_pref("image.mem.max_decoding_threads", 4);
user_pref("image.decode.cache_optimization.enabled", true);
user_pref("image.decode.cache_optimization.max_decode_size_bytes", 4194304);
user_pref("browser.display.use_document_fonts", 1);
user_pref("browser.display.auto_quality_min_font_size", 14);
user_pref("browser.display.document_color_use", 2);
user_pref("browser.display.use_system_colors", false);
user_pref("browser.urlbar.maxRichResults", 0);
user_pref("browser.urlbar.suggest.searches", false);
user_pref("browser.urlbar.suggest.topsites", false);
user_pref("browser.urlbar.suggest.bookmark", false);
user_pref("browser.urlbar.suggest.history", false);
user_pref("browser.urlbar.suggest.openpage", false);
user_pref("browser.urlbar.suggest.searchengine", false);
user_pref("browser.urlbar.autoFill", false);
user_pref("browser.urlbar.trimURLs", true);
user_pref("browser.urlbar.trim.http", true);
user_pref("browser.urlbar.trim.https", true);
user_pref("browser.urlbar.trim.ftp", true);
user_pref("browser.urlbar.trim.file", true);
user_pref("browser.urlbar.trim.other", true);
user_pref("browser.fixup.alternate.enabled", false);
user_pref("browser.fixup.alternate.suffix", "");
user_pref("browser.fixup.alternate.prefix", "");
user_pref("network.http.connection-retry-timeout", 30);
user_pref("network.http.connection-timeout", 60);
user_pref("network.http.request.max-start-delay", 0);
user_pref("network.http.max-persistent-connections-per-proxy", 32);
user_pref("network.http.pipelining", true);
user_pref("network.http.proxy.pipelining", true);
user_pref("network.http.max-persistent-connections-per-server", 8);
user_pref("network.http.max-connections", 256);
user_pref("network.http.max-persistent-connections-per-proxy", 32);
user_pref("network.http.redirection-limit", 20);
user_pref("network.ftp.idleConnectionTimeout", 300);
user_pref("network.auth.force-generic-ntlm", false);
user_pref("network.auth.subresource.http-auth-allow", 2);
user_pref("network.cookie.lifetimePolicy", 2);
user_pref("network.cookie.cookieBehavior", 5);
user_pref("privacy.clearOnShutdown.cache", true);
user_pref("privacy.clearOnShutdown.cookies", false);
user_pref("privacy.clearOnShutdown.downloads", false);
user_pref("privacy.clearOnShutdown.formdata", true);
user_pref("privacy.clearOnShutdown.history", true);
user_pref("privacy.clearOnShutdown.offlineApps", false);
user_pref("privacy.clearOnShutdown.sessions", true);
user_pref("privacy.clearOnShutdown.siteSettings", false);
user_pref("browser.cache.disk.enable", true);
user_pref("browser.cache.disk.capacity", 1048576);
user_pref("browser.cache.disk.smart_size.enabled", false);
user_pref("browser.cache.disk.smart_size.first_run", false);
user_pref("browser.cache.disk.smart_size_cached_value", 1048576);
user_pref("browser.cache.disk.enable", true);
user_pref("browser.cache.memory.enable", true);
user_pref("browser.cache.memory.capacity", 131072);
user_pref("browser.cache.offline.enable", false);
user_pref("browser.safebrowsing.provider.google4.gsbReportURL", "");
user_pref("browser.safebrowsing.provider.google4.dataSharingURL", "");
user_pref("browser.safebrowsing.downloads.remote.url", "");
user_pref("browser.safebrowsing.provider.google.gsbReportURL", "");
user_pref("browser.safebrowsing.provider.mozilla.gsbReportURL", "");
user_pref("browser.safebrowsing.downloads.remote.url", "");
user_pref("browser.safebrowsing.provider.google4.gsbReportURL", "");
user_pref("browser.safebrowsing.provider.google4.dataSharingURL", "");
user_pref("browser.safebrowsing.downloads.enabled", false);
user_pref("browser.safebrowsing.malware.enabled", false);
user_pref("browser.safebrowsing.phishing.enabled", false);
user_pref("browser.safebrowsing.downloads.enabled", false);

# ---- Maximum Fingerprint Protection (100/100 goal) ----
# Core RFP (works in vanilla Firefox ESR)
user_pref("privacy.resistFingerprinting", true);
user_pref("privacy.resistFingerprinting.pbmode", true);
user_pref("privacy.resistFingerprinting.reduceTimerPrecision", true);
user_pref("privacy.resistFingerprinting.autoDeclineNoUserInputCanvasPrompts", true);
user_pref("privacy.resistFingerprinting.letterboxing", false);
user_pref("privacy.resistFingerprinting.randomDataNoise.enabled", true);

# RFP: force consistent hardware concurrency (clamp to 2)
user_pref("dom.maxHardwareConcurrency", 2);

# RFP: force timezone to UTC
user_pref("privacy.resistFingerprinting.timezone", "UTC");

# RFP: force consistent touch support
user_pref("dom.w3c_touch_events.enabled", 0);

# Hard disable WebGL, WebRTC, sensors, battery
user_pref("webgl.disabled", true);
user_pref("media.navigator.enabled", false);
user_pref("media.peerconnection.enabled", false);
user_pref("media.recorder.enabled", false);
user_pref("media.recorder.enabled", false);
user_pref("device.sensors.enabled", false);
user_pref("dom.battery.enabled", false);
user_pref("dom.vibrator.enabled", false);
user_pref("dom.gamepad.enabled", false);

# Performance APIs - disable for fingerprinting resistance
user_pref("dom.enable_performance", false);
user_pref("dom.enable_performance_navigation_timing", false);
user_pref("dom.enable_performance_navigation_timing_v2", false);
user_pref("dom.enable_performance_resource_timing", false);
user_pref("dom.enable_user_timing", false);

# Force UTC timezone (RFP should do this but enforce via locale)
user_pref("intl.accept_languages", "en-US,en");
user_pref("intl.locale.requested", "");
user_pref("javascript.options.use_fake_canvas", true);

# DNT
user_pref("privacy.donottrackheader.enabled", true);
user_pref("privacy.donottrackheader.value", 1);

# Additional hardening
user_pref("media.peerconnection.ice.no_host", true);
user_pref("media.peerconnection.ice.default_address_only", true);
user_pref("privacy.trackingprotection.fingerprinting.enabled", true);

# Disable all telemetry and phone-home
user_pref("toolkit.telemetry.enabled", false);
user_pref("toolkit.telemetry.unified", false);
user_pref("datareporting.healthreport.uploadEnabled", false);
user_pref("datareporting.policy.dataSubmissionEnabled", false);
user_pref("breakpad.reportURL", "");
user_pref("browser.uitour.enabled", false);
user_pref("browser.tabs.crashReporting.sendReport", false);
user_pref("extensions.pocket.enabled", false);

# Network privacy
user_pref("network.trr.mode", 2);
user_pref("network.trr.uri", "https://mozilla.cloudflare-dns.com/dns-query");
user_pref("network.dns.echconfig.enabled", true);
user_pref("network.http.echconfig.enabled", true);
user_pref("dom.security.https_only_mode", true);
user_pref("network.http.referer.sendRefererHeader", 0);
user_pref("network.http.referer.defaultPolicy", 0);
user_pref("beacon.enabled", false);
user_pref("browser.send_pings", false);

# Storage partitioning
user_pref("network.cookie.cookieBehavior", 5);
user_pref("privacy.firstparty.isolate", true);
user_pref("privacy.partition.always_partition_third_party_non_cookie_storage", true);
user_pref("privacy.partition.serviceWorkers", true);

# Disable updates for supply-chain security
user_pref("app.update.enabled", false);
user_pref("app.update.auto", false);
user_pref("app.update.autoInstallEnabled", false);
user_pref("extensions.update.enabled", false);
user_pref("extensions.webservice.discoverURL", "");
user_pref("app.normandy.enabled", false);
user_pref("app.shield.optoutstudies.enabled", false);

# EME/DRM
user_pref("media.eme.enabled", false);

# Speculative connections
user_pref("network.prefetch-next", false);
user_pref("network.predictor.enabled", false);
user_pref("network.dns.disablePrefetch", true);
user_pref("network.http.speculative-parallel-limit", 0);
user_pref("browser.places.speculativeConnectEnabled", false);

# SafeBrowsing (disable remote URLs)
user_pref("browser.safebrowsing.provider.google.gsbReportURL", "");
user_pref("browser.safebrowsing.provider.mozilla.gsbReportURL", "");
user_pref("browser.safebrowsing.downloads.remote.url", "");
user_pref("browser.safebrowsing.provider.google4.gsbReportURL", "");
user_pref("browser.safebrowsing.provider.google4.dataSharingURL", "");
user_pref("browser.safebrowsing.malware.enabled", false);
user_pref("browser.safebrowsing.phishing.enabled", false);
user_pref("browser.safebrowsing.downloads.enabled", false);
#   E n a b l e   u s e r C h r o m e . c s s  
 u s e r _ p r e f ( " t o o l k i t . l e g a c y U s e r P r o f i l e C u s t o m i z a t i o n s . s t y l e s h e e t s " ,   t r u e ) ;  
 u s e r _ p r e f ( " t o o l k i t . l e g a c y U s e r P r o f i l e C u s t o m i z a t i o n s . w i n d o w I c o n " ,   t r u e ) ;  
 u s e r _ p r e f ( " t o o l k i t . l e g a c y U s e r P r o f i l e C u s t o m i z a t i o n s . e n a b l e d " ,   t r u e ) ;  
  
 #   B r a n d i n g   o v e r r i d e s   ( s o m e   w o r k   i n   L i b r e W o l f )  
 u s e r _ p r e f ( " b r o w s e r . b r a n d i n g . n a m e " ,   " F o x A I   B r o w s e r " ) ;  
 u s e r _ p r e f ( " b r o w s e r . b r a n d i n g . s h o r t N a m e " ,   " F o x A I " ) ;  
 u s e r _ p r e f ( " a p p . b r a n d i n g . n a m e " ,   " F o x A I   B r o w s e r " ) ;  
 u s e r _ p r e f ( " a p p . b r a n d i n g . s h o r t N a m e " ,   " F o x A I " ) ;  
  
 #   L i b r e W o l f   s p e c i f i c   b r a n d i n g   p r e f s  
 u s e r _ p r e f ( " l i b r e w o l f . b r a n d i n g . n a m e " ,   " F o x A I   B r o w s e r " ) ;  
 u s e r _ p r e f ( " l i b r e w o l f . b r a n d i n g . s h o r t N a m e " ,   " F o x A I " ) ;  
  
 #   W i n d o w   t i t l e  
 u s e r _ p r e f ( " b r o w s e r . t i t l e b a r . s h o w " ,   t r u e ) ;  
 
// ============================================================
// v2.2.0 â€” Privacy Shield v2
// ============================================================

# Query stripping (Brave list)
user_pref("privacy.query_stripping.strip_list", "__hsfp __hssc __hstc __s _bhlid _branch_match_id _gl _hsenc _openstat fbclid gclid mc_eid msclkid ttclid twclid yclid");
user_pref("privacy.query_stripping.enabled", true);
user_pref("privacy.query_stripping.enabled.pbmode", true);

# Global Privacy Control (GPC)
user_pref("privacy.globalprivacycontrol.enabled", true);
user_pref("privacy.globalprivacycontrol.pbmode.enabled", true);
user_pref("privacy.globalprivacycontrol.functionality.enabled", true);

# Cookie banner auto-reject
user_pref("cookiebanners.service.mode", 1);
user_pref("cookiebanners.service.mode.privateBrowsing", 1);

# Anti-fingerprint: canvas/WebGL/AudioContext
user_pref("canvas.capturestream.enabled", false);
user_pref("canvas.focusprompt.enabled", false);
user_pref("gfx.webrender.software", false);
user_pref("dom.webaudio.enabled", true);
user_pref("media.webspeech.synth.enabled", false);

# Tracker isolation
user_pref("privacy.antitracking.isolateContentScriptResources", true);
user_pref("privacy.trackingprotection.allow_list.baseline.enabled", true);
user_pref("privacy.trackingprotection.allow_list.convenience.enabled", true);

# Referrer + hyperlink auditing
user_pref("network.http.referer.XOriginTrimmingPolicy", 2);
user_pref("network.http.referer.hideReferrerControlledTransition", true);
user_pref("browser.send_to_device_locales", "");

# Local Network Access protection
user_pref("network.lna.enabled", true);

// ============================================================
// v2.3.0 â€” Performance Turbo
// ============================================================

# Startup boost
user_pref("browser.startup.preXulSkeletonUI", true);
user_pref("browser.startup.homepage_override.mstone", "ignore");
user_pref("toolkit.telemetry.reportingpolicy.firstRun", false);
user_pref("browser.shell.skipDefaultBrowserCheckOnFirstRun", true);
user_pref("browser.sessionstore.resume_session_once", false);

# Content process tuning (daha az RAM, hÄ±zlÄ± sekme)
user_pref("dom.ipc.processCount", 8);
user_pref("dom.ipc.keepProcessAliveInBackground", 5);
user_pref("dom.ipc.processCount.webLargeAllocation", 4);

# JS engine turbo
user_pref("javascript.options.mem.gc_incremental_slice_ms", 10);
user_pref("javascript.options.mem.high_water_mark", 128);
user_pref("javascript.options.parallel_parsing", true);
user_pref("javascript.options.streams", true);
user_pref("javascript.options.offthread_compilation", true);
user_pref("javascript.options.speculation", true);
user_pref("javascript.options.warp_builder", true);

# Network turbo
user_pref("network.buffer.cache.size", 262144);
user_pref("network.buffer.cache.count", 24);
user_pref("network.http.max-urgent-start-excessive-connections-per-host", 5);
user_pref("network.http.pacing.requests.min-parallelism", 10);
user_pref("network.dnsCacheEntries", 2000);
user_pref("network.dnsCacheExpiration", 3600);
user_pref("network.ssl_tokens_cache_capacity", 20480);

# Render turbo
user_pref("gfx.content.skia-font-cache-size", 32);
user_pref("layout.css.backdrop-filter.enabled", true);
user_pref("image.cache.size", 10485760);
user_pref("media.memory_caches_combined_limit_kb", 1048576);
user_pref("media.memory_cache_max_size", 16384);

# Memory management
user_pref("browser.low_commit_space_threshold_mb", 256);
user_pref("browser.tabs.unloadOnLowMemory", true);
user_pref("browser.low_commit_space_threshold_pct", 75);

// ============================================================
// v2.4.0 â€” Dark UI Complete
// ============================================================
user_pref("browser.theme.content-theme", 2);
user_pref("browser.theme.toolbar-theme", 2);
user_pref("layout.css.prefers-color-scheme.content-override", 2);
user_pref("ui.systemUsesDarkTheme", 1);
user_pref("extensions.activeThemeID", "firefox-compact-dark@mozilla.org");
user_pref("browser.uidensity", 1);
user_pref("browser.compactmode.show", true);
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);
user_pref("sidebar.verticalTabs", true);

// ============================================================
// v2.6.0 â€” Security Fortress
// ============================================================

# TLS/SSL sertleÅŸtirme
user_pref("security.tls.version.enable-deprecated", false);
user_pref("security.ssl.require_safe_negotiation", true);
user_pref("security.ssl.treat_unsafe_negotiation_as_broken", true);
user_pref("security.pki.crlite_mode", 2);
user_pref("security.remote_settings.crlite_filters.enabled", true);
user_pref("security.OCSP.enabled", 1);
user_pref("security.OCSP.require", true);

# Site isolation
user_pref("fission.autostart", true);
user_pref("security.sandbox.gpu.level", 1);
user_pref("dom.ipc.processCount.isolatedWebCoalesced", 1);

# Sertifikalar
user_pref("security.enterprise_roots.enabled", false);
user_pref("security.certerrors.mitm.auto_enable_enterprise_roots", false);
user_pref("security.cert_pinning.enforcement_level", 2);

# PDF + download guvenligi
user_pref("pdfjs.enableScripting", false);
user_pref("pdfjs.enableXfa", false);
user_pref("browser.helperApps.deleteTempFileOnExit", true);
user_pref("browser.download.alwaysOpenPanel", false);

# HTTP auth korumasi
user_pref("network.auth.subresource-http-auth-allow", 1);
user_pref("network.auth.prompt-auth-with-ring-on-ui", false);

# Punycode + spoofing korumasi
user_pref("network.IDN_show_punycode", true);
user_pref("browser.urlbar.trimURLs", false);
user_pref("security.dialog_enable_delay", 1000);

# Remote debugging kapali
user_pref("devtools.debugger.remote-enabled", false);
user_pref("devtools.chrome.enabled", false);
user_pref("extensions.webextensions.background-delayed-startup", false);


// ============================================================
// v2.7.0 - Perfect Fingerprint 100%
// Deterministik RFP: tum instance'lar birebir ayni iz birakir.
# Canvas randomization kapali -> klasik RFP (bembeyaz canvas, her yerde ayni)

# Pencere metrikleri sabit
user_pref("privacy.window.maxInnerWidth", 1600);
user_pref("privacy.window.maxInnerHeight", 900);
user_pref("privacy.resistFingerprinting.letterboxing", false);

# Zaman dili UTC kilitli
user_pref("privacy.resistFingerprinting.timezone", "UTC");
user_pref("intl.locale.requested", "en-US");

// ============================================================
// v2.8.0 - Containers Pro
user_pref("privacy.userContext.enabled", true);
user_pref("privacy.userContext.ui.enabled", true);
user_pref("privacy.userContext.longPressBehavior", 2);
user_pref("privacy.userContext.newTabContainerOnLeftClick.selectContainer", false);

// ============================================================
// v2.10.0 - Media Lockdown
user_pref("media.autoplay.default", 5);
user_pref("media.block-autoplay-until-in-foreground", true);
user_pref("permissions.default.camera", 2);
user_pref("permissions.default.microphone", 2);
user_pref("permissions.default.geo", 2);
user_pref("permissions.default.desktop-notification", 2);
user_pref("media.gmp-provider.enabled", false);
user_pref("media.gmp-gmpopenh264.enabled", false);

// ============================================================
// v2.11.0 - Download Safety
user_pref("browser.download.always_ask_before_handling_new_types", true);
user_pref("browser.download.improvements_to_download_panel", true);
user_pref("browser.download.open_pdf_attachments_inline", false);
user_pref("browser.helperApps.neverAsk.saveToDisk", "");

// ============================================================
// v2.12.0 - Search Privacy
user_pref("browser.urlbar.suggest.engines", []);
user_pref("browser.search.suggest.enabled.private", false);
user_pref("browser.search.separatePrivateDefault.ui.enabled", true);
user_pref("keyword.enabled", true);

// ============================================================
// v2.14.0 - Startup Guard
user_pref("browser.startup.page", 0);
user_pref("browser.warnOnQuit", false);
user_pref("toolkit.startup.max_resumed_crashes", 0);
user_pref("browser.sessionstore.cleanup.forget_closed_after_days", 1);


# v2.7.0 FIX: gercek canvas randomization anahtarlari (xul.dll dogrulandi)
user_pref("privacy.resistFingerprinting.randomization.canvas.use", false);
user_pref("privacy.resistFingerprinting.randomization.daily", false);

// ============================================================
// v2.8.0 - TOR MODE (aktif) â€” tum trafik 127.0.0.1:9050 uzerinden
// Gereksinim: Tor calisiyor olmali (scripts\install-tor.ps1 ile kur, ya da
// Tor Browser / sistem servisi 9050 portunu dinliyor olmali)

// SOCKS5 proxy -> Tor
user_pref("network.proxy.type", 1);
user_pref("network.proxy.socks", "127.0.0.1");
user_pref("network.proxy.socks_port", 9050);
user_pref("network.proxy.socks_version", 5);
user_pref("network.proxy.socks_remote_dns", true);   // DNS sizintisi yok
user_pref("network.proxy.allow_bypass", false);

// DoH kapat (Tor DNS'i zaten anonimlestirir)
user_pref("network.trr.mode", 0);
user_pref("network.dns.disablePrefetch", true);

// WebRTC tamamen kapali (IP sizmasi imkansiz)
user_pref("media.peerconnection.enabled", false);
user_pref("media.peerconnection.turn.disable", true);

// First-party isolation + tor etiketli durum cubugu
user_pref("privacy.firstparty.isolate", true);
user_pref("extensions.torbutton.use_nontor_proxy", false);

// Otomatik guncelleme/telemetri Tor uzerinden de kapali kalir
user_pref("app.update.enabled", false);

