/* FoxAI Browser — hardened user.js (arkenfox-style, ESR-friendly)
 *
 * Copy to the profile directory as user.js (or bake into the fork via
 * fork/patches/ + autoconfig). Every pref is grouped and commented so a
 * reviewer can audit intent. Values follow arkenfox user.js where FoxAI
 * policy agrees; FoxAI deltas are marked [FOXAI].
 *
 * License: MPL-2.0 (repo root LICENSE).
 */

/*** 0000 — startup ***/
user_pref("browser.startup.homepage", "about:blank");
user_pref("browser.newtabpage.enabled", false);
user_pref("browser.newtabpage.activity-stream.showSponsored", false);
user_pref("browser.newtabpage.activity-stream.showSponsoredTopSites", false);
user_pref("browser.newtabpage.activity-stream.feeds.telemetry", false);
user_pref("browser.newtabpage.activity-stream.telemetry", false);

/*** 0100 — telemetry: everything off ***/
user_pref("toolkit.telemetry.enabled", false);
user_pref("toolkit.telemetry.unified", false);
user_pref("toolkit.telemetry.server", "data:,");
user_pref("toolkit.telemetry.archive.enabled", false);
user_pref("toolkit.telemetry.bhrPing.enabled", false);
user_pref("toolkit.telemetry.shutdownPingSender.enabled", false);
user_pref("toolkit.telemetry.updatePing.enabled", false);
user_pref("toolkit.telemetry.newProfilePing.enabled", false);
user_pref("toolkit.telemetry.firstShutdownPing.enabled", false);
user_pref("toolkit.telemetry.coverage.opt-out", true);
user_pref("toolkit.coverage.opt-out", true);
user_pref("toolkit.coverage.endpoint", "");
user_pref("datareporting.healthreport.uploadEnabled", false);
user_pref("datareporting.policy.dataSubmissionEnabled", false);
user_pref("app.shield.optoutstudies.enabled", false);
user_pref("app.normandy.enabled", false);
user_pref("app.normandy.api_url", "");
user_pref("breakpad.reportURL", "");
user_pref("browser.crashReports.unsubmittedCheck.enabled", false);
user_pref("browser.tabs.crashReporting.sendReport", false);
user_pref("browser.crashReports.unsubmittedCheck.autoSubmit2", false);

/*** 0200 — experiments, studies, personalization ***/
user_pref("experiments.activeExperiment", false);
user_pref("experiments.enabled", false);
user_pref("experiments.supported", false);
user_pref("network.allow-experiments", false);
user_pref("browser.uitour.enabled", false);
user_pref("browser.discovery.enabled", false);
user_pref("browser.shopping.experience2023.enabled", false);
user_pref("browser.urlbar.quicksuggest.enabled", false);

/*** 0300 — Pocket, accounts, sync ***/
user_pref("extensions.pocket.enabled", false);
user_pref("identity.fxaccounts.enabled", false);
user_pref("browser.accounts.enabled", false);

/*** 0400 — safebrowsing (privacy-preserving defaults) ***/
user_pref("browser.safebrowsing.enabled", true);
user_pref("browser.safebrowsing.phishing.enabled", true);
user_pref("browser.safebrowsing.malware.enabled", true);
/* keep remote lookups off; use local lists only */
user_pref("browser.safebrowsing.downloads.remote.enabled", false);

/*** 0500 — tracking protection ***/
user_pref("privacy.trackingprotection.enabled", true);
user_pref("privacy.trackingprotection.pbmode.enabled", true);
user_pref("privacy.trackingprotection.cryptomining.enabled", true);
user_pref("privacy.trackingprotection.fingerprinting.enabled", true);
user_pref("browser.contentblocking.category", "strict");
/* total cookie protection */
user_pref("network.cookie.cookieBehavior", 5);
/* query-parameter stripping */
user_pref("privacy.query_stripping.enabled", true);
user_pref("privacy.query_stripping.enabled.pbmode", true);
/* referrer trimming */
user_pref("network.http.referer.XOriginPolicy", 2);
user_pref("network.http.referer.XOriginTrimmingPolicy", 2);

/*** 0600 — fingerprinting resistance ***/
user_pref("privacy.resistFingerprinting", true);
user_pref("privacy.fingerprintingProtection", true);
user_pref("webgl.disabled", true); /* [FOXAI] hard default; flip per-site if needed */
user_pref("media.peerconnection.enabled", false); /* WebRTC off (Tor-safe) */

/*** 0700 — network hardening ***/
user_pref("network.trr.mode", 2); /* DoH first, fallback allowed */
user_pref("network.trr.uri", "https://mozilla.cloudflare-dns.com/dns-query");
user_pref("network.dns.disablePrefetch", true);
user_pref("network.prefetch-next", false);
user_pref("network.predictor.enabled", false);
user_pref("network.http.speculative-parallel-limit", 0);
user_pref("browser.places.speculativeConnect.enabled", false);
user_pref("network.proxy.socks_remote_dns", true);
user_pref("media.eme.enabled", false); /* no DRM blobs */

/*** 0800 — HTTPS-only + mixed content ***/
user_pref("dom.security.https_only_mode", true);
user_pref("dom.security.https_only_mode_ever_enabled", true);

/*** 0900 — FoxAI product defaults [FOXAI] ***/
user_pref("foxai.telemetry.enabled", false);
user_pref("foxai.ai.sidebar.enabled", false); /* opt-in via UI, Allow per action */
user_pref("foxai.tor.enabled", false); /* opt-in; socks tor:9050 when on */
user_pref("foxai.firstRun.finished", true); /* skip onboarding pings */

/*** 1000 — v3.2.0 Trust & Supply Chain: extra hardening [FOXAI] ***/
/* first-party isolation of network state (defense in depth over cookieBehavior 5) */
user_pref("privacy.partition.network_state", true);
user_pref("privacy.partition.serviceWorkers", true);
/* clear on shutdown: no session residue on disk */
user_pref("privacy.sanitize.sanitizeOnShutdown", true);
user_pref("privacy.clearOnShutdown.cache", true);
user_pref("privacy.clearOnShutdown.cookies", false); /* keep logins; clear only on demand */
user_pref("privacy.clearOnShutdown.history", false);
user_pref("privacy.clearOnShutdown.formdata", true);
user_pref("privacy.clearOnShutdown.sessions", true);
user_pref("privacy.clearOnShutdown.siteSettings", false);
/* password manager: off by default (use a dedicated manager) */
user_pref("signon.rememberSignons", false);
user_pref("signon.autofillForms", false);
user_pref("signon.formlessCapture.enabled", false);
/* form autofill / address book off */
user_pref("browser.formfill.enable", false);
user_pref("extensions.formautofill.addresses.enabled", false);
user_pref("extensions.formautofill.creditCards.enabled", false);
/* disable non-essential APIs that leak device identity */
user_pref("dom.battery.enabled", false);
user_pref("device.sensors.enabled", false);
user_pref("geo.enabled", false);
user_pref("media.navigator.enabled", false);
user_pref("dom.webnotifications.enabled", false);
/* strict referrer policy */
user_pref("network.http.referer.defaultPolicy", 2); /* strict-origin-when-cross-origin */
user_pref("network.http.referer.defaultPolicy.pbmode", 2);
/* no link prefetch / speculative connections */
user_pref("network.prefetch-next", false);
user_pref("network.dns.disablePrefetch", true);
user_pref("browser.send_pings", false);
/* disk cache: memory-only (no residue on disk) */
user_pref("browser.cache.disk.enable", false);
user_pref("browser.cache.memory.enable", true);
/* session restore: minimal (no full session on disk) */
user_pref("browser.sessionstore.privacy_level", 2);
user_pref("browser.sessionstore.resume_from_crash", false);
/* disable speculative preconnect + predictor */
user_pref("network.predictor.enabled", false);
user_pref("network.http.speculative-parallel-limit", 0);
/* disable media autoplay (fingerprint + annoyance) */
user_pref("media.autoplay.default", 5);
user_pref("media.autoplay.blocking.policy", 2);
/* disable WebRTC IP leak beyond peerconnection off */
user_pref("media.peerconnection.ice.default_address_only", true);
user_pref("media.peerconnection.ice.no_host", true);
