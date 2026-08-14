# Changelog

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
