# FoxAI Browser

Private, privacy-first browser built on Firefox ESR 140, with an AI sidebar, a custom new-tab start page, gesture navigation, and a private search engine.

## Components

| Component | Description |
|---|---|
| `firefox-foxai/runtime` | Firefox ESR 140.13.0 runtime, branded "FoxAI Browser" (rcedit). Build output. |
| `extensions/foxai-core` | "FoxAI Start" new-tab page (Vite + React): clock, weather, search, notes, to-do, bookmarks/top sites, 4 themes, settings modal, file upload. |
| `extensions/foxai-ai` | AI sidebar (sidebar action): ChatGPT / Claude / Gemini / Ollama providers, optional `<all_urls>` consent for page extraction. |
| `extensions/foxai-search-startpage` | "FoxAI Search" engine (keyword `@foxai`, DuckDuckGo) + start page. |
| `extensions/foxai-gestures` | Right-drag gesture navigation (back / forward / reload / new tab). |
| uBlock Origin | Pre-installed content blocker (GPLv3, separate license). |
| `config/` | `policies.json` template (rendered by build), `foxai.cfg`, `user.js`. |
| `tests/` | WebDriver BiDi (PowerShell) end-to-end tests. |
| `website/` | Static landing page (no build step). To make the download button work, drop `FoxAI-Browser-vX.Y.Z.zip` next to `index.html`. |

## Build

Requirements: Windows, Node.js, PowerShell 5.1+.

```
.\build.ps1
```

This: builds the new-tab React app, packages all extensions into `.xpi` files (forward-slash entries), downloads uBlock Origin, installs everything into the runtime `distribution`, renders `policies.json` (no BOM), brands `firefox.exe`, creates a fresh profile, and produces `release\FoxAI-Browser-v2.1.1.zip` (with the launcher `FoxAI-Launcher.ps1`, `FoxAI Browser.cmd`, `FoxAI Update.cmd` and `version.txt` at the zip root).

## Test

```
.\tests\run-all.ps1
```

Launches the branded browser headless and runs 5 BiDi tests against `firefox-foxai\profile\foxai`:

1. new-tab renders all widgets
2. notes + to-do persist across navigation
3. default search engine is DuckDuckGo (policy)
4. settings modal: themes, widget toggles, file upload
5. AI sidebar setup + enable flow

## Run

```
firefox-foxai\runtime\firefox.exe -profile "firefox-foxai\profile\foxai" -no-remote
```

Or extract `release\FoxAI-Browser-v1.0.0.zip` and run `firefox.exe`.

## Install (Linux)

Linux packages are built automatically by GitHub Actions on every tag push. Grab them from the [Releases](https://github.com/Can-5/foxai-browser/releases) page:

### Fedora (RPM) — "setup.exe" experience

Download `foxai-browser-X.Y.Z-1.x86_64.rpm`, then **double-click it** (Discover opens with an Install button) or:

```bash
sudo dnf install ./foxai-browser-X.Y.Z-1.x86_64.rpm
```

This installs the AppImage to `/usr/bin/foxai-browser` plus a launcher icon in the app menu. `fuse2` is pulled in automatically. Launch from the menu or by running `foxai-browser`.

### Any distro — portable AppImage (like a Windows .exe)

```bash
wget https://github.com/Can-5/foxai-browser/releases/download/vX.Y.Z/FoxAI-Browser-vX.Y.Z.AppImage
chmod +x FoxAI-Browser-vX.Y.Z.AppImage
./FoxAI-Browser-vX.Y.Z.AppImage          # normal
./FoxAI-Browser-vX.Y.Z.AppImage --offline  # offline AI (downloads ~1.9GB model on first run)
```

Note: double-clicking the AppImage requires FUSE 2 (`sudo dnf install fuse2` on Fedora, `sudo apt install libfuse2` on Debian/Ubuntu).

### Arch — PKGBUILD

```bash
cd linux && makepkg -si
```

### Ubuntu / Debian

```bash
sudo dpkg -i foxai-browser-vX.Y.Z-amd64.deb   # sudo apt -f install if deps missing
```

### Launcher modes

`foxai-browser --private` (private window) · `foxai-browser --tor` (Tor window) · `foxai-browser --check` (check for updates) · `foxai-browser --update` (self-update from GitHub Releases).

## Notes / gotchas

- XPIs must use forward-slash entry names (PowerShell `ZipFile.CreateFromDirectory` writes backslashes and Firefox 404s subdirectories).
- `policies.json` must be UTF-8 **without BOM** (PowerShell `Set-Content -Encoding UTF8` adds one and Firefox silently ignores the file).
- Extensions are installed via policy `force_installed` + `install_url` `file://` (absolute path rendered at build time), plus `extensions.installDistroAddons` as a fallback.
- Firefox allows only one active WebDriver BiDi session; tests call `session.end` after each test.

## License

FoxAI Browser itself: MPL-2.0 (see `LICENSE`). uBlock Origin: GPLv3. Firefox is Mozilla Public License 2.0.
