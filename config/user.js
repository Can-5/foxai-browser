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
user_pref("signon.rememberSignons", false);
user_pref("browser.uitour.enabled", false);
user_pref("browser.tabs.crashReporting.sendReport", false);

// ---- Firefox-fork hardening (LibreWolf / Arkenfox style) ----
user_pref("privacy.resistFingerprinting", true);
user_pref("privacy.resistFingerprinting.pbmode", true);
user_pref("privacy.resistFingerprinting.reduceTimerPrecision", true);
user_pref("privacy.resistFingerprinting.autoDeclineNoUserInputCanvasPrompts", true);
user_pref("privacy.resistFingerprinting.letterboxing", true);
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
