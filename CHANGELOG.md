# Changelog

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
