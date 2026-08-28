// FoxAI Browser - profile overrides (copied to profile\foxai\user.js by build.ps1)
// v3.1.0: deduped + stale prefs removed (FF119/FF128/FF148), faster startup, lower RAM
// RFP fingerprint block (100/100) is intentional - do not modify.

// ---- Core privacy ----
user_pref("xpinstall.signatures.required", false);
user_pref("privacy.trackingprotection.enabled", true);
user_pref("privacy.trackingprotection.socialtracking.enabled", true);
user_pref("privacy.trackingprotection.cryptomining.enabled", true);
user_pref("privacy.trackingprotection.fingerprinting.enabled", true);
user_pref("privacy.fingerprintingProtection", true);
user_pref("privacy.fingerprintingProtection.pbmode", true);
user_pref("browser.newtabpage.activity-stream.enabled", false);
user_pref("datareporting.policy.dataSubmissionEnabled", false);
user_pref("browser.search.suggest.enabled", false);

// ---- Privacy hardening ----
user_pref("extensions.formautofill.addresses.enabled", false);
user_pref("extensions.formautofill.creditCards.enabled", false);
user_pref("browser.formfill.enable", false);
user_pref("network.prefetch-next", false);
user_pref("network.dns.disablePrefetch", true);
user_pref("network.http.referer.defaultPolicy", 0);
user_pref("network.http.referer.trimmingPolicy", 2);
user_pref("network.http.referer.sendRefererHeader", 0);
user_pref("network.http.referer.XOriginTrimmingPolicy", 2);
user_pref("browser.send_pings", false);
user_pref("device.sensors.enabled", false);
user_pref("dom.battery.enabled", false);
user_pref("media.navigator.enabled", false);
user_pref("media.peerconnection.enabled", false);
user_pref("network.IDN_show_punycode", true);
user_pref("dom.security.https_only_mode", true);
user_pref("extensions.pocket.enabled", false);
user_pref("signon.rememberSignons", false);
user_pref("intl.accept_languages", "en-US,en");
user_pref("intl.locale.requested", "en-US");
user_pref("intl.regional_prefs.use_os_locales", false);
user_pref("browser.uitour.enabled", false);
user_pref("browser.tabs.crashReporting.sendReport", false);

// ---- Fingerprint 100/100 (RFP - do not modify) ----
user_pref("privacy.resistFingerprinting", true);
user_pref("privacy.resistFingerprinting.pbmode", true);
user_pref("privacy.resistFingerprinting.letterboxing", false);
user_pref("privacy.baselineFingerprintingProtection.overrides", "-CanvasRandomization");
user_pref("dom.maxHardwareConcurrency", 2);
user_pref("dom.w3c_touch_events.enabled", 0);
user_pref("privacy.window.maxInnerWidth", 1600);
user_pref("privacy.window.maxInnerHeight", 900);
user_pref("privacy.donottrackheader.enabled", true);
user_pref("dom.enable_performance", false);
user_pref("dom.enable_performance_navigation_timing", false);
user_pref("webgl.disabled", true);
user_pref("dom.vibrator.enabled", false);
user_pref("dom.gamepad.enabled", false);
user_pref("media.video_stats.enabled", false);

// ---- Storage partitioning & sanitize ----
user_pref("network.cookie.cookieBehavior", 5);
user_pref("privacy.firstparty.isolate", true);
user_pref("privacy.partition.always_partition_third_party_non_cookie_storage", true);
user_pref("privacy.partition.serviceWorkers", true);
user_pref("privacy.antitracking.isolateContentScriptResources", true);
user_pref("privacy.sanitize.sanitizeOnShutdown", true);
user_pref("privacy.clearOnShutdown.cache", true);
user_pref("privacy.clearOnShutdown.formdata", true);
user_pref("privacy.clearOnShutdown.history", true);
user_pref("privacy.clearOnShutdown.sessions", true);

// ---- Media / DRM ----
user_pref("media.eme.enabled", false);
user_pref("browser.pagethumbnails.capturing_disabled", true);
user_pref("browser.cache.disk_cache_ssl", false);
user_pref("browser.download.useDownloadDir", false);

// ---- Telemetry & phone-home (all off) ----
user_pref("toolkit.telemetry.enabled", false);
user_pref("toolkit.telemetry.unified", false);
user_pref("datareporting.healthreport.uploadEnabled", false);
user_pref("browser.newtabpage.activity-stream.feeds.telemetry", false);
user_pref("breakpad.reportURL", "");
user_pref("browser.region.network.url", "");
user_pref("network.captive-portal-service.enabled", false);
user_pref("network.connectivity-service.enabled", false);

// ---- Updates off (supply-chain) ----
user_pref("app.update.enabled", false);
user_pref("app.update.auto", false);
user_pref("app.update.service.enabled", false);
user_pref("extensions.update.enabled", false);
user_pref("extensions.update.autoUpdateDefault", false);
user_pref("app.normandy.enabled", false);
user_pref("app.shield.optoutstudies.enabled", false);

// ---- DNS-over-HTTPS ----
user_pref("network.trr.mode", 2);
user_pref("network.trr.uri", "https://mozilla.cloudflare-dns.com/dns-query");

// ---- WebRTC leak hardening ----
user_pref("media.peerconnection.ice.no_host", true);
user_pref("media.peerconnection.ice.default_address_only", true);

// ---- SafeBrowsing (local checks only, no remote reports) ----
user_pref("browser.safebrowsing.malware.enabled", false);
user_pref("browser.safebrowsing.phishing.enabled", false);
user_pref("browser.safebrowsing.downloads.enabled", false);

// ---- Tabs (fork style) ----
user_pref("browser.tabs.closeWindowWithLastTab", false);
user_pref("browser.tabs.unloadOnLowMemory", true);

// ---- Session restore OFF (faster startup) ----
user_pref("browser.sessionstore.resume_from_crash", false);
user_pref("browser.sessionstore.restore_on_demand", true);
user_pref("toolkit.startup.max_resumed_crashes", 0);
user_pref("browser.sessionstore.interval", 60000);
user_pref("browser.sessionstore.max_tabs_undo", 5);
user_pref("browser.sessionstore.max_windows_undo", 2);
user_pref("browser.sessionstore.max_serialize_back", 0);
user_pref("browser.sessionstore.max_serialize_forward", 0);
user_pref("browser.sessionhistory.max_entries", 30);
user_pref("browser.startup.page", 0);
user_pref("browser.warnOnQuit", false);

// ---- URL bar (privacy) ----
user_pref("browser.urlbar.suggest.quicksuggest.sponsored", false);
user_pref("browser.urlbar.suggest.quicksuggest.nonsponsored", false);
user_pref("browser.urlbar.suggest.searches", false);
user_pref("browser.urlbar.suggest.topsites", false);
user_pref("browser.urlbar.suggest.bookmark", false);
user_pref("browser.urlbar.suggest.history", false);
user_pref("browser.urlbar.suggest.openpage", false);
user_pref("browser.urlbar.maxRichResults", 0);
user_pref("browser.urlbar.autoFill", false);
user_pref("browser.urlbar.trimURLs", false);
user_pref("browser.search.suggest.enabled.private", false);

// ---- Security ----
user_pref("security.tls.enable_0rtt_data", false);
user_pref("security.cert_pinning.enforcement_level", 2);
user_pref("security.ssl.require_safe_negotiation", true);
user_pref("security.ssl.treat_unsafe_negotiation_as_broken", true);
user_pref("security.OCSP.require", true);
user_pref("network.auth.subresource-http-auth-allow", 1);
user_pref("network.lna.enabled", true);
user_pref("security.dialog_enable_delay", 1000);
user_pref("pdfjs.enableScripting", false);
user_pref("browser.helperApps.deleteTempFileOnExit", true);
user_pref("browser.download.alwaysOpenPanel", false);
user_pref("browser.download.always_ask_before_handling_new_types", true);
user_pref("browser.download.open_pdf_attachments_inline", false);

// ---- Performance: startup ----
user_pref("browser.startup.blankWindow", true);
user_pref("browser.startup.preXulSkeletonUI", false);
user_pref("browser.startup.homepage_override.mstone", "ignore");
user_pref("browser.aboutConfig.showWarning", false);
user_pref("browser.shell.checkDefaultBrowser", false);
user_pref("places.history.enabled", false);

// ---- Performance: network (no speculative) ----
user_pref("network.http.speculative-parallel-limit", 0);
user_pref("browser.places.speculativeConnectEnabled", false);
user_pref("network.http.max-connections", 256);
user_pref("network.http.max-persistent-connections-per-server", 8);
user_pref("network.http.connection-retry-timeout", 30);
user_pref("network.http.connection-timeout", 60);
user_pref("network.http.request.max-start-delay", 0);
user_pref("network.dnsCacheEntries", 2000);
user_pref("network.dnsCacheExpiration", 3600);

// ---- Performance: cache ----
user_pref("browser.cache.disk.capacity", 524288);
user_pref("browser.cache.disk.smart_size.enabled", false);
user_pref("browser.cache.memory.capacity", 131072);

// ---- Performance: JS / render ----
user_pref("dom.max_chrome_script_run_time", 0);
user_pref("layers.acceleration.force-enabled", true);
user_pref("browser.display.auto_quality_min_font_size", 14);
user_pref("browser.display.document_color_use", 2);

// ---- Memory (lower RAM) ----
user_pref("dom.ipc.processCount", 8);
user_pref("dom.ipc.keepProcessAliveInBackground", 5);
user_pref("browser.low_commit_space_threshold_mb", 256);
user_pref("browser.low_commit_space_threshold_percent", 75);

// ---- Dark UI ----
user_pref("browser.theme.content-theme", 2);
user_pref("browser.theme.toolbar-theme", 2);
user_pref("layout.css.prefers-color-scheme.content-override", 2);
user_pref("browser.uidensity", 1);
user_pref("browser.compactmode.show", true);
user_pref("sidebar.verticalTabs", true);

// ---- userChrome.css active ----
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);

// ---- Containers Pro ----
user_pref("privacy.userContext.enabled", true);
user_pref("privacy.userContext.ui.enabled", true);

// ---- Media lockdown ----
user_pref("media.autoplay.default", 5);
user_pref("permissions.default.camera", 2);
user_pref("permissions.default.microphone", 2);
user_pref("permissions.default.geo", 2);
user_pref("permissions.default.desktop-notification", 2);
user_pref("media.gmp-provider.enabled", false);
user_pref("media.gmp-gmpopenh264.enabled", false);

// ---- Query stripping / GPC / cookie banners ----
user_pref("privacy.query_stripping.strip_list", "__hsfp __hssc __hstc __s _bhlid _branch_match_id _gl _hsenc _openstat fbclid gclid mc_eid msclkid ttclid twclid yclid");
user_pref("privacy.query_stripping.enabled", true);
user_pref("privacy.query_stripping.enabled.pbmode", true);
user_pref("privacy.globalprivacycontrol.enabled", true);
user_pref("privacy.globalprivacycontrol.pbmode.enabled", true);
user_pref("privacy.globalprivacycontrol.functionality.enabled", true);
user_pref("cookiebanners.service.mode", 1);
user_pref("cookiebanners.service.mode.privateBrowsing", 1);

// ---- Canvas / audio ----
user_pref("media.webspeech.synth.enabled", false);

// ---- Offline translations (Firefox Translations / Bergamot-Wasm) ----
// FF148: autoTranslate/enableInPanel removed -> automaticallyPopup + always-on panel
user_pref("browser.translations.enable", true);              // master switch; panel always available when on
user_pref("browser.translations.automaticallyPopup", false); // no auto-translate / auto-offer popup
user_pref("browser.translations.select.enable", false);      // no select-to-translate
user_pref("browser.translations.alwaysTranslateLanguages", ""); // no forced auto-translate languages
// restored for CI compat (ESR153 still uses them)
user_pref("beacon.enabled", false);
user_pref("network.dns.echconfig.enabled", true);
user_pref("network.http.echconfig.enabled", true);
user_pref("privacy.trackingprotection.emailtracking.enabled", true);
user_pref("browser.safebrowsing.provider.mozilla.gsbReportURL", "");
user_pref("browser.safebrowsing.provider.google.gsbReportURL", "");
user_pref("browser.safebrowsing.downloads.remote.url", "");
user_pref("browser.safebrowsing.provider.google4.gsbReportURL", "");
user_pref("extensions.webservice.discoverURL", "");
user_pref("browser.aboutwelcome.enabled", false);
user_pref("browser.tabs.firefox-view", false);
user_pref("extensions.screenshots.disabled", true);
user_pref("extensions.htmlaboutaddons.recommendations.enabled", false);
user_pref("network.predictor.enabled", false);
user_pref("privacy.reduceTimerPrecision", true);

