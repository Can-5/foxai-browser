# Changelog

## v1.8.0 (2026-08-14)

**Full leak & hardening audit + speed + FoxAI Hub.** A big pass: every remaining leak vector and phone-home connection closed, the network is faster, and the browser now links to a FoxAI Hub.

### Hardening (config/user.js + config/foxai.cfg)
- **Resist Fingerprinting fully on** (`privacy.resistFingerprinting=true`, incl. PBM, reduced timer precision, canvas prompt auto-decline) — timezone spoofed to UTC, canvas/screen fuzzed, on top of letterboxing.
- **Every phone-home connection killed**: app update off, extension auto-update off, Normandy/Shield studies off, region lookup URL cleared, captive-portal detection off, connectivity service off, What's New / about:welcome / Firefox View off, Firefox screenshots disabled, add-on recommendations off, Firefox Suggest (quicksuggest) off, remote debugging off.
- **Remaining fingerprint vectors closed**: vibrator, gamepad, video stats; third-party non-cookie storage + service workers partitioned; TLS 0-RTT off; certificate-pinning enforcement level 2.
- uBlock/Safe Browsing remote reporting already off (kept).

### Performance
- Speculative connect + DNS prefetch already off; added `network.http.speculative-parallel-limit=0`, places speculative connect off.
- More parallel connections (`max-connections=1200`, `max-persistent-connections-per-server=9`).
- Disk cache raised to 512 MB (smart size off).
- Lighter writes: sessionstore every 3 min, session history capped, history disabled (already cleared on shutdown).
- Faster start: no default-browser check, no reset prompt, no welcome page.

### FoxAI Hub
- The new-tab now has a **🧩 Hub button** (next to the settings gear) that opens the FoxAI Hub on the website.
- The website gained a `#hub` section: latest release, source, changelog, feedback/issues, a "verify it yourself" leak-test kit (browserleaks / ipleak / dnsleaktest), and quick-start steps. Bilingual EN/TR, same no-tracker static site.

### Tests
- New **`tests/test-06-hardening.ps1`**: big live audit — egress IP consistency across 4 reflectors (ipify / Cloudflare trace / icanhazip / ifconfig.me), HTTPS-only upgrade of an `http://` navigation, empty referrer, and a full fingerprint-vector report (WebRTC, Network Info, battery, MediaRecorder, WebGL, plugins, timezone=UTC); plus a **static audit of 70+ critical prefs** across BOTH `config/user.js` and `config/foxai.cfg`.
- Full suite is now **6/6** (test-01…06).

### Changed
- Version bumped to 1.8.0 (all extensions + release zip `FoxAI-Browser-v1.8.0.zip`).

## v1.7.0 (2026-08-14)

**Launcher + auto-updater** — the release zip now contains a double-click launcher next to `firefox-foxai\`.

### Added
- `FoxAI Browser.cmd` — double-click to start the browser (no console window). Path-relative, so the folder can be moved anywhere.
- `FoxAI Update.cmd` — checks GitHub for a newer release, downloads it, installs it, then relaunches the browser. **The profile is preserved across updates** (settings, notes, logins).
- `FoxAI-Launcher.ps1` — engine behind both, with `-Launch`, `-Private`, `-Check`, `-Update`, `-Version` switches.
- `version.txt` — written into the zip root by the build so the launcher knows the local version (falls back to `0.0.0`).

### Under the hood
- The launcher keeps the sandbox workaround env vars from `launch.ps1` (this Firefox build can crash on startup in some environments otherwise) and detects an already-running instance by the exact exe path (doesn't kill other Firefox installations).
- Update safety: downloads to a temp folder, validates `firefox-foxai\runtime\firefox.exe` exists in the archive before swapping, then restores the user profile from a backup.
- Old dev artifacts `launcher.vbs` (hardcoded path, killed firefox) removed; `launch.ps1` still works for headless/dev use.

### Changed
- Version bumped to 1.7.0 (all extensions + release zip `FoxAI-Browser-v1.7.0.zip`).

## v1.6.0 (2026-08-14)

Built-in **SOCKS5 proxy** so IP leak tests show the proxy address instead of the real one (this was the only remaining "leak" — see the v1.5.1 note).

### Added (FoxAI Start → Settings → Proxy)
- **Proxy toggle + host + port** — route all traffic through a SOCKS5 proxy (or an HTTP proxy if you set `fx:proxytype` in storage).
- **No direct fallback**: when the proxy is unreachable, requests **fail** instead of silently going direct — the real IP can never leak through a dead proxy.
- Proxy DNS (`proxyDNS: true`) for SOCKS5 — the domain is resolved through the proxy, not locally.
- Proxy settings are stored in both localStorage (UI) and `browser.storage.local` (background) so they survive restarts, are included in settings export/import, and are reset by "Reset all settings".
- Verified with a local test proxy: `CONNECT example.com:443` arrives at the proxy; with a dead proxy `example.com` fails to load; with the proxy off it loads normally.

### Under the hood (background.js + manifest)
- `foxai-core` background now runs **`browser.proxy.onRequest`** (ProxyChannelFilter) reading config from storage with a `storage.onChanged` reactivation hook.
- Required additions discovered on this Firefox build:
  - `"proxy"` **and** `"<all_urls>"` permissions — the onRequest filter (`{ urls: ["<all_urls>"] }`) only matches URLs the extension holds host permission for.
  - `proxy.onRequest.addListener(listener, filter)` **requires** the filter argument on this build.
  - ProxyInfo uses the `type` field (`socks`/`http`), not Chrome's `proxyType`.
- **Fixed a bug that broke the background entirely**: a duplicate `let proxyConfig` declaration was a `SyntaxError`, so `background.js` never executed (context-menu + screenshot features were dead too). The background also re-runs `loadProxy()` at startup now.

### Changed
- Version bumped to 1.6.0 (all extensions + release zip `FoxAI-Browser-v1.6.0.zip`).

## v1.5.1 (2026-08-14)

Leak-test fix pass.

### Fixed / added
- **DNS leak killed**: DNS-over-HTTPS on (`network.trr.mode=2`, `mozilla.cloudflare-dns.com`) — `browserleaks.com/dns` and `dnsleaktest.com` now show Cloudflare instead of the ISP.
- Verified on browserleaks.com: **WebRTC Leak Test = No Leak** (`RTCPeerConnection` unsupported).
- Extra leak hardening:
  - Fingerprinting + cryptomining blocking lists on (in tracking protection).
  - WebRTC ICE defence-in-depth (`ice.no_host`, `ice.default_address_only`) in case WebRTC is ever re-enabled.
  - Google/Mozilla Safe Browsing **remote report URLs cleared** — no URL fragments are sent to Google/Mozilla; local blocking lists stay active.

### Note
- The public IP will always be shown by leak tests (e.g. `78.182.77.59` on browserleaks.com). That is your real internet connection, not a browser leak — hiding it requires a VPN or proxy, not a browser setting.

### Changed
- Version bumped to 1.5.1 (release zip `FoxAI-Browser-v1.5.1.zip`).

## v1.5.0 (2026-08-14)

Real-Firefox-fork settings & tab behaviour (LibreWolf / Arkenfox inspired).

### Added (config/foxai.cfg + config/user.js)
- **Fork hardening**:
  - Letterboxing on, e-mail tracking protection on.
  - Cookie behaviour `5` (reject trackers + partition third-party state).
  - Clear-on-shutdown for history/cache/form data/sessions — but **cookies and site settings are kept**, so logins and the FoxAI Start notes persist.
  - WebGL disabled, DRM/EME disabled, page thumbnails capturing disabled.
  - SSL cache disabled (`browser.cache.disk_cache_ssl`), downloads always ask where to save (`useDownloadDir=false`).
  - Telemetry fully off (`toolkit.telemetry.*`, healthreport, ping-centre, activity-stream telemetry), crash reporter URL cleared.
  - Session-store privacy level 2 (no form/session data in crash restore).
- **Tab behaviour (fork style)**:
  - New tabs open next to the current one (`insertAfterCurrent`).
  - Diverted (target=_blank) pages load in the background.
  - Closing the last tab doesn't close the window; no "open tab" warning.
  - Tabs unload on low memory, tabs remain detachable.
  - Session restore loads tabs on demand, no auto crash-restore.

### Changed
- Version bumped to 1.5.0 (all extensions + release zip `FoxAI-Browser-v1.5.0.zip`).

## v1.4.0 (2026-08-14)

Privacy & security audit pass 2, plus a large settings expansion.

### Privacy
- **Geolocation moved to `optional_permissions`**: the location permission is no longer requested at install. It is only requested if/when the user enables the Weather widget, and can be denied.
- **FoxAI Search engine stripped of tracking extras**: removed the `&t=foxai` source tag and the DuckDuckGo `suggest_url` — keystrokes can never leave the browser, and DDG no longer sees an attribution tag.
- New hardened browser prefs (`config/foxai.cfg` + `config/user.js`):
  - WebRTC disabled (`media.peerconnection.enabled=false`) — no IP leaks via STUN/ICE.
  - HTTPS-only mode on (`dom.security.https_only_mode=true`) — no plaintext HTTP by default.
  - Encrypted Client Hello enabled (ECH) for DNS/HTTPS.
  - Pocket integration off (`extensions.pocket.enabled=false`).
  - Password manager off (`signon.rememberSignons=false`).
  - Master referrer switch off (`network.http.referer.sendRefererHeader=0`).
  - UITour + crash reports off.

### Added settings (FoxAI Start modal)
- **2 new themes**: `forest` and `sunset` (7 themes total).
- **Greeting name** — shown next to the brand ("Hi, your name").
- **Weather unit** — Celsius / Fahrenheit.
- **Show date under the clock** toggle.
- **Open search results in a new tab** toggle (results open with `noopener`).
- **Bookmark count** — 4 / 6 / 8 / 12 top sites.
- **Compact layout** toggle (tighter cards, smaller clock).
- **Export settings** (downloads `foxai-settings.json`) and **Import settings** (restores from file).

### Changed
- Version bumped to 1.4.0 (all extensions + release zip `FoxAI-Browser-v1.4.0.zip`).

## v1.3.0 (2026-08-14)

### Added
- New settings in the FoxAI Start modal:
  - **Search engine** dropdown — DuckDuckGo (default), Bing, Google, Brave, Startpage.
  - **24-hour clock** toggle (off = 12-hour AM/PM).
  - **Clock widget** on/off toggle.
  - **Open bookmarks in a new tab** toggle.
  - **Reset all settings** button (clears stored prefs and reloads).
- **Version is now visible** in three places, read live from the extension manifest:
  - FoxAI Start settings modal footer ("FoxAI Start v1.3.0").
  - FoxAI Search start page footer.
  - FoxAI AI sidebar footer.

### Changed
- Version bumped to 1.3.0 (all extensions + release zip `FoxAI-Browser-v1.3.0.zip`).

## v1.2.0 (2026-08-14)

Full security & privacy hardening pass ("close all leaks").

### Security
- **Sender validation everywhere**: `foxai-gestures` background now rejects `foxai:gesture` messages from any sender other than its own content script (`sender.id === browser.runtime.id`) and validates the action against a whitelist. Previously any extension could close or navigate the user's active tab.
- **Strict Content-Security-Policy** added to all four extension manifests (and tightened on the new-tab page): `default-src 'none'`, no `unsafe-eval`, `object-src 'none'`, `base-uri 'none'`, `frame-ancestors 'none'`, `form-action 'none'`. `connect-src` whitelisted to exactly what each extension needs:
  - core: only `https://api.open-meteo.com`
  - AI: only the configured provider hosts + `http://localhost:11434`
- **Search start page**: inline `<script>`/`<style>` moved to external `startpage.js`/`startpage.css` so the page can run under a strict `script-src 'self'` CSP (no inline execution).
- Honest consent UX: the AI sidebar's "Allow once" button actually granted persistent `<all_urls>` access; relabeled to "Allow page access" so the permission scope is not misrepresented.

### Privacy
- **Weather widget is now opt-in and off by default**. It previously requested `navigator.geolocation` on every new-tab load and sent the exact coordinates to open-meteo.com. Now it only mounts (and only requests location) when enabled in Settings → Widgets.
- New privacy prefs applied to both `config/foxai.cfg` and `config/user.js`:
  - form autofill (addresses + credit cards) and form history disabled
  - network prefetch / predictor / DNS prefetch disabled
  - referrer policy set to never send (`defaultPolicy=0`)
  - `navigator.sendBeacon` and `<a ping>` disabled
  - device sensors (accelerometer etc.) and battery API disabled
  - camera/microphone (`getUserMedia`) disabled
  - first-party isolation enabled (`privacy.firstparty.isolate`)
  - punycode shown for homoglyph domains (`network.IDN_show_punycode`)

### Changed
- Version bumped to 1.2.0 (all extensions + release zip `FoxAI-Browser-v1.2.0.zip`).

## v1.1.0 (2026-08-14)

### Added
- New "gray" background theme; it is now the default new-tab background.

### Security
- `foxai-ai` background now validates the message **sender**: only the extension's own sidebar page can trigger AI calls, permission requests, or page extraction. Previously any extension (or content script) could send `foxai:run` and, via the keyless Ollama provider, siphon the active tab's content to a local server or force the `<all_urls>` consent prompt.
- Message shape hardening: `mode`/`provider` whitelist, question/language/message length caps.
- Gemini API key moved from the URL query string (`?key=`) to the `x-goog-api-key` header so it cannot leak through logs, history, or referrers.

### Changed
- Version bumped to 1.1.0 (all extensions + release zip `FoxAI-Browser-v1.1.0.zip`).

## v1.0.0 (2026-08-14)

Rebuilt from scratch from recovered salvage after the original project was deleted.

### Added
- `extensions/foxai-core` — "FoxAI Start" new-tab page rebuilt as a Vite + React app (clock, weather, search, notes, to-do, top-sites bookmarks, 4 themes, settings modal, file upload, localStorage persistence).
- `extensions/foxai-ai` — AI sidebar with ChatGPT / Claude / Gemini / Ollama providers and consent-gated page extraction.
- `extensions/foxai-search-startpage` — FoxAI Search engine (DuckDuckGo-backed) and start page.
- `extensions/foxai-gestures` — right-drag gesture navigation.
- `build.ps1` — one-command build: Vite, XPI packaging, uBlock download, runtime install, branding, profile, release zip.
- `tests/` — WebDriver BiDi PowerShell E2E test suite (5 tests).

### Fixed
- XPI packaging wrote backslash entry names on Windows (`ZipFile.CreateFromDirectory`), causing Firefox to 404 all subdirectory resources (newtab, sidebar, icons). Custom `New-Zip` now writes forward-slash entries.
- `policies.json` written with UTF-8 BOM was silently ignored by Firefox (SearchEngines default + ExtensionSettings not applied). Now written BOM-less.
- Search-startpage manifest used unsupported `chrome_url_overrides.homepage` key, which prevented the extension from installing.
- Extensions were blocked because `force_installed` policies lacked `install_url`; switched to `file://` install URLs and removed the invalid homepage override.
- Test harness closed the whole browser between tests (`browser.close`); now closes only the browsing context and calls `session.end` (Firefox allows a single active BiDi session).

### Notes
- Branded "FoxAI Browser" via rcedit (icon + version strings) on Firefox ESR 140.13.0.
- uBlock Origin 1.73.0 pre-installed (GPLv3, separate license).
