<!-- DRAFT: göndermeden önce v3.0.0 indirme URL'lerini, ekran görüntülerini ve AlternativeTo hesap adını doldur -->
<!-- VERIFY 2026-09-24: BLOCKER'lar — (1) repo kökünde LICENSE dosyası YOK (moderasyon MPL-2.0 iddiasını doğrulayamaz; index.html "MPL-2.0 (browser) · GPLv3 (uBlock)" diyor ama dosya yok) → submit öncesi LICENSE (MPL-2.0) + uBlock notu ekle; (2) download.html 3 yerde "GPL lisanslı" yazıyor, bu dosya MPL-2.0 diyor → download.html'daki ifade düzeltilmeden submit ETME (yanlış lisans beyanı = reject); (3) macOS DMG yok ("yakında", buton disabled) → Platforms'ta Mac İŞARETLEME; (4) screenshots/ Pillow placeholder (README: "Replace with real captures") → gerçek ekran görüntüleriyle değiştir; (5) v3.0.0 tag GitHub'da mevcut ama `FoxAI-Browser-v3.0.0.zip` asset adı doğrulanamadı → releases sayfasından gerçek dosya adını kopyala; (6) PRIVACY politikası yok (güven sinyali için önerilir). Site canlı ✓ (download.html yayında, içerik yerel ile aynı). Repo releases v3.1.0'a kadar gidiyor — hangi tag "stable" ise ona göre URL yaz. -->

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

> ⚠️ 2026-09-24: mevcut PNG/WebP'ler Pillow ile üretilmiş placeholder
> (`screenshots/README.md`: "Replace with real captures when you have them").
> Submit öncesi GERÇEK tarayıcı görüntüleriyle değiştir (aynı dosya adları).
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

> ⛔ SUBMIT'E HAZIR DEĞİL (2026-09-24) — blocker'lar üstteki VERIFY notunda.
> Hepsi kapanmadan AlternativeTo'ya gönderme (reject/yorum krizi riski).

- [ ] BLOCKER: repo köküne `LICENSE` (MPL-2.0 metni) ekle + uBlock GPLv3 notu.
- [ ] BLOCKER: `download.html`'daki 3× "GPL lisanslı" ifadesini düzelt
  (satır 587 feat kartı, 614 SSS, 619 footer → "MPL-2.0 (uBlock Origin GPLv3)").
- [ ] BLOCKER: gerçek ekran görüntüleri çek (`screenshots/` placeholder).
- [ ] v3.0.0 stable release published (real binaries, not skeleton).
- [ ] Download URLs verified (releases sayfasından GERÇEK asset adını kopyala):
  - Windows: `https://github.com/Can-5/foxai-browser/releases/download/v3.0.0/FoxAI-Browser-v3.0.0.zip`
    <!-- DRAFT: gerçek dosya adını doğrula — 2026-09-24'te releases'te v3.0.0 tag'i var ama bu exact asset adı doğrulanamadı; v3.1.0 da mevcut, hangisi stable ise onu yaz -->
  - Linux: tarball URL + Flatpak status note
- [ ] Platforms: SADECE Windows + Linux işaretle (Mac DMG çıkana kadar).
- [ ] Website alanı: `https://can-5.github.io/foxai-browser/` (repo URL değil).
- [ ] License alanı: MPL-2.0 + link https://www.mozilla.org/en-US/MPL/2.0/
- [ ] AlternativeTo account + claimed "developer" badge ready.
  <!-- DRAFT: hesap adını buraya yaz -->
- [ ] Screenshots exported (PNG preferred, WebP as fallback).
- [ ] (Önerilir) `PRIVACY.md` veya sitede gizlilik politikası sayfası ekle.
