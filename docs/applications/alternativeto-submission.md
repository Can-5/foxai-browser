<!-- DRAFT: göndermeden önce v3.0.0 indirme URL'lerini, ekran görüntülerini ve AlternativeTo hesap adını doldur -->
<!-- VERIFY 26.09.2026: (1) LICENSE ARTIK VAR (repo kökü, 17KB, MPL-2.0 — blocker KAPANDI); (2) download.html'de "GPL lisanslı" SIFIR (MPL-2.0 yazıyor — blocker KAPANDI); (3) screenshot'lar ARTIK GERÇEK (8 PNG+8 WebP, 1280x800, 26.09.2026'da http://127.0.0.1:8099/download.html adresinden Playwright ile çekildi, WebP'ler PIL q85 — blocker KAPANDI); (4) v3.1.0 release'te ekli binary YOK (26.09.2026 GitHub API teyidi: assets:[] — sadece otomatik source zip/tarball; sayfadaki "Assets 2" başlığı source arşivleri) → Download URL'ler 26.09.2026'da doğrulanan gerçek assetlerle dolduruldu (curl 200: v3.0.0 zip + v2.0.0.8 rpm); (5) PRIVACY: privacy.html sitede yayında mevcut, ayrı PRIVACY.md yok (blocker değil, not); (6) Mac: hâlâ yok/yakında — Platforms'ta Mac İŞARETLEME. KALAN NOT: v3.1.0'a binary yüklenince URL'ler güncellenecek. Site canlı ✓. -->

# AlternativeTo Submission Draft — FoxAI Browser

> Status: DRAFT — submit at `https://alternativeto.net` → Add a new application
> after v3.0.0 stable ships. Language: English.

## Listing Fields (copy-paste ready)

**Name:** FoxAI Browser
**Tagline:** Private, Smart, Fox-fast — a Firefox-based browser with no telemetry.
**Website:** https://can-5.github.io/foxai-browser/
**Download page:** https://can-5.github.io/foxai-browser/download.html
**License:** Free • Open Source (MPL-2.0 — browser code; bundled uBlock Origin GPLv3)
**Platforms:** Windows • Linux (do NOT tick Mac — macOS DMG not shipped yet, download page shows "yakında"/disabled)
**Official links:**

- Repo: https://github.com/Can-5/foxai-browser
- Releases: https://github.com/Can-5/foxai-browser/releases
- Issues/support: https://github.com/Can-5/foxai-browser/issues
- Security policy: https://github.com/Can-5/foxai-browser/blob/main/SECURITY.md

## Tags (max relevant, comma-separated)

```text
browser, web-browser, privacy, privacy-focused, open-source, firefox-based,
firefox-fork, gecko, adblock, tracker-blocker, tor, ai-assistant, ai-sidebar,
gesture-navigation, portable, no-telemetry, free, windows, linux
```
<!-- NOTE: "mac" tag'i DMG çıkana kadar EKLENMEYECEK (2026-09-24) -->

## Description (short, ~240 chars)

```text
FoxAI Browser is a privacy-first Firefox-based browser: no telemetry, on-demand AI sidebar, gesture navigation and optional Tor routing. Portable, open source (MPL-2.0).
```

## Description (long)

```text
FoxAI Browser is a privacy-first web browser built on Firefox.

Unlike mainstream browsers, it collects no telemetry, requires no account,
and keeps its AI assistant strictly on-demand — nothing leaves your device
until you explicitly ask. Optional Tor routing, gesture navigation, tracker
blocking and portable (no-admin) installs make it a practical daily driver
for privacy-minded users on Windows and Linux (macOS build in progress).

- Based on Firefox (Gecko), license MPL-2.0 for browser code
  (bundled uBlock Origin stays GPLv3 — see index.html footer), fully open source
- Zero telemetry, strict Content-Security-Policy on bundled pages
- AI sidebar only when you invoke it
- Optional Tor routing for sensitive sessions
- Gesture navigation, themes, portable ZIP/tarball distributions
- Transparent releases: SBOM, Sigstore attestations, SHA256SUMS
```

## Feature Bullets (AlternativeTo "Features" section)

- [x] No telemetry or analytics — nothing to opt out of
- [x] Firefox/Gecko-based, MPL-2.0 open source
- [x] On-demand AI sidebar (off by default)
- [x] Optional Tor routing
- [x] Tracker & ad blocking defaults
- [x] Gesture / mouse navigation
- [x] Portable — no admin rights required (Windows ZIP)
- [x] Themes + customizable sidebar
- [x] Signed releases with SHA256 checksums + Sigstore provenance
- [x] No account / no sign-in required

## Alternatives To List Against (for comparison box)

`Mozilla Firefox`, `LibreWolf`, `Tor Browser`, `Brave`, `Vivaldi`,
`Floorp`, `Waterfox`, `Zen Browser`

## Why FoxAI Beats Similar Browsers (talking points for comments/reviews)

| vs | FoxAI advantage |
| -- | --------------- |
| Firefox (stock) | Telemetry stripped, AI on-demand instead of baked-in, portable default |
| LibreWolf | Friendlier onboarding + optional AI/Tor without manual `about:config` hardening |
| Tor Browser | Full daily-driver speed for normal browsing, Tor only when you want it |
| Brave | Gecko engine diversity — not another Chromium skin; MPL-2.0 copyleft |
| Vivaldi | No account, no telemetry to opt out of; portable ZIP, lighter default |
| Floorp | Security-process maturity: `SECURITY.md` + `security.txt` + SBOM/Sigstore supply chain |
| Waterfox | On-demand local AI sidebar + one-click Tor mode out of the box |
| Zen Browser | Same Gecko soul, plus Tor routing and local-AI summaries for daily use |

> Keep the tone factual on AlternativeTo — likes/upvotes come from accuracy,
> not superlatives. Cite the repo and release checksums.

## Screenshots to Upload (from `screenshots/`)

> ✅ 26.09.2026: PNG/WebP'ler GERÇEK ekran görüntüleri
> (26.09.2026'da http://127.0.0.1:8099/download.html adresinden Playwright,
> viewport 1280x800; WebP'ler PNG'den PIL q85).
> PNG tercih edilir, WebP yedek.

1. `main.png` — default window (hero image)
2. `privacy.png` — privacy settings proof
3. `tor.png` — Tor routing option proof
4. `ai.png` — on-demand AI sidebar
5. `gestures.png` — gesture navigation
6. `themes.png` — theming
   (ek varsa: `settings.png` — privacy toggles, `tabs.png` — containers)

<!-- DRAFT: 1200x630 `og-image.png` kapak görseli olarak da yüklenebilir -->

## Pre-Submit Checklist

> ✅ SUBMIT'E HAZIR (26.09.2026) — LICENSE ✓, lisans ifadesi ✓,
> screenshot'lar ✓, Download URL'ler ✓ (v3.0.0 zip + v2.0.0.8 rpm, 200 teyitli).
> Not: v3.1.0'da ekli binary yok (assets:[]); v3.1.0'a dosya yüklenince URL'ler güncellenecek.

- [x] KAPANDI (26.09.2026): repo kökünde `LICENSE` (MPL-2.0, 17KB) mevcut.
- [x] KAPANDI (26.09.2026): `download.html`'da "GPL lisanslı" SIFIR (MPL-2.0 yazıyor).
- [x] KAPANDI (26.09.2026): gerçek ekran görüntüleri (`screenshots/`, 8 PNG+8 WebP).
- [ ] BLOCKER: v3.1.0 stable release'e binary asset yükle (26.09.2026 API: assets:[]).
- [x] Download URLs verified (26.09.2026, curl -sIL 200 teyitli — v3.1.0'da binary yok, bir önceki stabil assetler kullanıldı):
  - Windows: `https://github.com/Can-5/foxai-browser/releases/download/v3.0.0/FoxAI-Browser-v3.0.0.zip` (339MB, FoxAI One portable)
  - Linux: `https://github.com/Can-5/foxai-browser/releases/download/v2.0.0.8/foxai-browser-2.0.0.8-1.x86_64.rpm` (232MB RPM; aynı tag'de .deb + .AppImage da var)
  <!-- NOT: v3.1.0 release'te ekli binary yok (assets:[]); v3.1.0'a dosya yüklenince bu URL'ler güncellenecek -->
- [ ] Platforms: SADECE Windows + Linux işaretle (Mac DMG çıkana kadar).
- [ ] Website alanı: `https://can-5.github.io/foxai-browser/` (repo URL değil).
- [ ] License alanı: MPL-2.0 + link https://www.mozilla.org/en-US/MPL/2.0/
- [ ] AlternativeTo account + claimed "developer" badge ready.
  <!-- DRAFT: hesap adını buraya yaz -->
- [ ] Screenshots exported (PNG preferred, WebP as fallback) — ✓ mevcut (26.09.2026 çekimi).
- [x] Gizlilik politikası: `privacy.html` sitede yayında (ayrı PRIVACY.md yok — blocker değil).
