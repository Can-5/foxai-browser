<!-- DRAFT: göndermeden önce stabil tarball URL + SHA256 değerlerini ve PrivacyGuides forum kullanıcı adını doldur.
     Last verified: 2026-09-25. Latest tag then: v3.1.0. Site live: https://can-5.github.io/foxai-browser/download.html (HTTP 200).
     BLOCKERS (must fix before submit): (1) repo root'ta LICENSE/COPYING dosyası YOK — MPL-2.0 iddiası dosyayla kanıtlanmalı;
      ✅ FIXED 2026-09-25: (2) privacy policy sayfası eklendi (`privacy.html`, footer linkleri tamam);
      ✅ FIXED 2026-09-25: (3) AI veri akışı birleştirildi (opt-in model, bkz. §3); (4) forum kullanıcı adı: Can-5. -->

# PrivacyGuides Submission Draft — FoxAI Browser

> Status: DRAFT — do NOT submit yet. Target: PrivacyGuides community forum
> (`https://discuss.privacyguides.net/c/site-development/suggestions/6` → Tool Suggestions) after blockers below are fixed.
> Language: English (required by PrivacyGuides).

## 1. Project Summary

**Name:** FoxAI Browser
**Tagline:** Privacy-first Firefox-based browser with built-in AI (on-demand) and optional Tor routing.
**Homepage:** https://github.com/Can-5/foxai-browser
**Website (demo/download):** https://can-5.github.io/foxai-browser/
**Source code:** https://github.com/Can-5/foxai-browser (public repository)
**License:** MPL-2.0 (same copyleft family as Firefox; manifests in-repo:
`manifests/winget/Can5.FoxAIBrowser.yaml`, `manifests/flatpak/io.github.Can5.foxai-browser.yaml`)
**Platforms:** Windows x64 (portable ZIP, no admin), Linux x86_64 (tarball + Flatpak in progress), macOS (via GitHub Release build matrix)
**Current version at time of writing:** v3.1.0 (tag exists: "Photon + Offline Translate + macOS/Linux CI green"; verified 2026-09-25)
<!-- DRAFT: göndermeden önce v3.1.0 release sayfasındaki gerçek artifact listesini + SHA256SUMS.txt hash'lerini yapıştır.
     2026-09-25 API kontrolü (api.github.com/repos/Can-5/foxai-browser/releases/tags/v3.1.0): release'te ekli dosya YOK (assets: []).
     İndirilebilir olanlar: tarball https://api.github.com/repos/Can-5/foxai-browser/tarball/v3.1.0 ve
     zipball https://api.github.com/repos/Can-5/foxai-browser/zipball/v3.1.0. Site "Download for Windows" butonu da
     release tag sayfasına bağlıyor, "direct .zip" linki (releases/download/v3.1.0/FoxAI-Browser-v3.1.0.zip) henüz dosya döndürmüyor.
     TODO: SHA256SUMS.txt yayınlanınca hash'leri buraya doldur — uydurma, release sayfasından kopyala. -->
**Download page (live, verified 2026-09-25):** https://can-5.github.io/foxai-browser/download.html
**v3.1.0 artifacts (verified 2026-09-25):** no attached binaries yet — source tarball/zipball only (see links above).
TODO: SHA256SUMS.txt'den doldurulacak (hash'ler release sayfasında yok, uydurulmadı).

FoxAI Browser is a Firefox derivative focused on privacy defaults: no
telemetry, on-demand (opt-in) AI sidebar instead of always-on assistants,
gesture navigation, and optional Tor routing. It ships as a portable build
with reproducible-build flags (`MOZILLA_OFFICIAL=1`, `BUILD_OFFICIAL=1`,
`SOURCE_DATE_EPOCH` — see `.github/workflows/release.yml`).

## 2. Open Source & License

- [x] Fully open source, public Git history.
- [x] OSI-approved license: **MPL-2.0** (`LicenseUrl: https://www.mozilla.org/en-US/MPL/2.0/`).
- [x] No proprietary binary blobs required at runtime (portable ZIP / tarball).
- [x] Build pipeline is public (`.github/workflows/release.yml`): pinned
  actions, `harden-runner` egress audit, SBOM (SPDX-JSON via Syft), Sigstore
  keyless build-provenance attestation, `SHA256SUMS.txt` per release.

Verification links (verify after each release):

- Release page: `https://github.com/Can-5/foxai-browser/releases/tag/v3.1.0`
  <!-- DRAFT: artifact listesi + SHA256SUMS.txt hash'lerini release sayfasından kopyala -->
- SHA256SUMS: attached to the release (`SHA256SUMS.txt`, generated in `release.yml` "Generate SHA256SUMS" step).
- Sigstore attestation: linked on the release page (actions/attest-build-provenance).
- SBOM: `sbom.spdx.json` artifact on the release.
- ⚠️ BLOCKER: repo root'ta `LICENSE`/`COPYING` dosyası yok (2026-09-25 kontrolü) — MPL-2.0 metni eklenmeden başvuru yapılmamalı.

## 3. Telemetry: None

- [x] **No telemetry by default and no opt-out needed** — there is nothing to opt out of.
- The site meta description states it explicitly: *"no telemetry"*
  (`index.html`: `content="... Portable, open source, no telemetry."`).
- No analytics SDKs, no crash-reporting endpoints, no experiment/field-trial
  pings in the project code. The static website sets a strict CSP
  (`default-src 'self'`, no third-party scripts except Google Fonts CSS).
- AI features are **off by default**; the default mode runs **on-device
  (KoboldCpp + Qwen)** — nothing leaves the device. If the user chooses an
  external provider (ChatGPT, Claude, Gemini, Ollama), only that action's
  data is sent, only after explicit per-action consent ("Allow page access"),
  revocable; API keys are stored locally.
- ✅ CONTRADICTION RESOLVED (2026-09-25): `download.html` previously claimed
  absolute local-only AI ("buluta tek bayt gitmez") while `index.html`
  advertised cloud providers with Allow-gating. Unified story now on both
  pages: AI off by default → default mode on-device (KoboldCpp + Qwen, no
  data leaves) → external provider only with per-action Allow, keys local.
  `download.html` absolute claims reworded (§SSS "Verilerim buluta
  gönderiliyor mu?", features, comparison table, demo); `index.html` FAQ-8
  gained the on-device-default sentence (EN + TR i18n in `main.js`).

## 4. E2E / Accounts / Self-Hosting (Not Applicable)

PrivacyGuides criteria for browsers do not require E2E sync, but for
completeness:

- **Accounts:** none required. No FoxAI account, no sign-in wall.
- **E2E encrypted sync:** not offered (no first-party sync server to evaluate).
  Users keep the Firefox profile locally / portable folder.
- **Self-hosting:** not applicable (desktop browser, no server component).
  The only server-side code in scope is the optional Cloudflare edge worker
  (`cloudflare-worker.js`, `ddos-guard.js`) protecting the project website —
  unrelated to browsing data.

## 5. Why Listing on PrivacyGuides?

1. **Firefox-based, privacy defaults over Chromium monoculture** — gives
   PrivacyGuides readers a Gecko alternative with telemetry stripped.
2. **Transparent supply chain** — pinned CI, SBOM, Sigstore attestations,
   published checksums (rare among small browser forks).
3. **Documented disclosure process** — `SECURITY.md` (48h ack / 7-day
   assessment / 90-day coordinated disclosure) + RFC 9116
   `.well-known/security.txt` (expires 2027-09-24).
4. **Portable, no-admin installs** lower the barrier for at-risk users who
   cannot install software system-wide.

## 6. Verification Links for Reviewers

| Item | Link |
| ---- | ---- |
| Repo | https://github.com/Can-5/foxai-browser |
| Security policy | https://github.com/Can-5/foxai-browser/blob/main/SECURITY.md |
| security.txt | https://can-5.github.io/foxai-browser/.well-known/security.txt |
| Release workflow | https://github.com/Can-5/foxai-browser/blob/main/.github/workflows/release.yml |
| Winget manifest | `manifests/winget/Can5.FoxAIBrowser.yaml` |
| Flatpak manifest | `manifests/flatpak/io.github.Can5.foxai-browser.yaml` |
| Screenshots | `screenshots/` (main, privacy, tor, ai, gestures, settings, tabs, themes — PNG + WebP) |
| Download page (live) | https://can-5.github.io/foxai-browser/download.html |
| Privacy policy | `privacy.html` (live: https://can-5.github.io/foxai-browser/privacy.html) — no telemetry, AI opt-in/on-device-first, Tor, no cookies; linked from `index.html` + `download.html` footers. EN + TR short version, disclosure via SECURITY.md. |
| OARS / content rating | ⚠️ MISSING — flatpak manifest has no `content_rating` / OARS block yet (nice-to-have for Flathub, not PG). |
| License | MPL-2.0 — https://www.mozilla.org/en-US/MPL/2.0/ |

## 7. Suggested Forum Post (copy-paste)

```text
Title: [Tool Suggestion] FoxAI Browser (Firefox-based, no telemetry, MPL-2.0)
Category: https://discuss.privacyguides.net/c/site-development/suggestions/6

Hello PrivacyGuides team,

I'd like to suggest FoxAI Browser for evaluation:

- Project: https://github.com/Can-5/foxai-browser
- License: MPL-2.0, fully open source
- Privacy: no telemetry, no account, AI strictly on-demand, optional Tor routing
- Supply chain: pinned CI, SBOM (SPDX), Sigstore attestations, SHA256SUMS per release
- Disclosure: SECURITY.md (48h ack / 90-day coordinated) + .well-known/security.txt
- Platforms: Windows portable, Linux tarball/Flatpak (in progress), macOS

Happy to answer technical questions or provide a test build.
Thank you!
<!-- Forum kullanıcı adı: Can-5 (discuss.privacyguides.net) — hesap kullanıcı tarafından açılacak -->
<!-- DRAFT: iletişim e-postasını ekle -->
```

## 8. Pre-Submit Checklist

- [x] Live download page verified (2026-09-25): `download.html` returns HTTP 200.
- [x] `SECURITY.md` (48h ack / 7-day assessment / 90-day coordinated) + `.well-known/security.txt` (expires 2027-09-24) cross-checked.
- [ ] Add repo-root `LICENSE` (MPL-2.0 full text) — BLOCKER.
- [x] Privacy policy page live + linked from site footers and §6 — DONE 2026-09-25 (`privacy.html`).
- [x] AI data-flow contradiction resolved — DONE 2026-09-25 (unified opt-in story, see §3).
- [ ] v3.1.0 (or later) stable tag published with real artifacts (not skeleton `BUILD-INFO.txt`).
- [ ] `SHA256SUMS.txt` + Sigstore attestation links verified on the release page.
- [ ] Flatpak `sha256` placeholder (`0000…`) replaced with the real tarball hash.
- [ ] At least one independent build reproducibility check done.
- [ ] Forum account ready; post in Tool Suggestions with the template above.
