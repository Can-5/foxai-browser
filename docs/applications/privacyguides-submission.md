<!-- DRAFT: göndermeden önce v3.0.0 sürüm numarasını, stabil tarball URL + SHA256 değerlerini ve PrivacyGuides forum kullanıcı adını doldur -->

# PrivacyGuides Submission Draft — FoxAI Browser

> Status: DRAFT — do NOT submit yet. Target: PrivacyGuides community forum
> (`https://discuss.privacyguides.net` → Tool Suggestions) after v3.0.0 stable.
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
**Current version at time of writing:** v3.0.0 (skeleton) — <!-- DRAFT: gerçek stabil sürüm etiketini yaz, örn. v3.0.0 -->

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

Verification links (fill after release):

- Release page: `https://github.com/Can-5/foxai-browser/releases/tag/v3.0.0`
  <!-- DRAFT: gerçek tag URL'sini koy -->
- SHA256SUMS: attached to the release (`SHA256SUMS.txt`).
- Sigstore attestation: linked on the release page (actions/attest-build-provenance).
- SBOM: `sbom.spdx.json` artifact on the release.

## 3. Telemetry: None

- [x] **No telemetry by default and no opt-out needed** — there is nothing to opt out of.
- The site meta description states it explicitly: *"no telemetry"*
  (`index.html`: `content="... Portable, open source, no telemetry."`).
- No analytics SDKs, no crash-reporting endpoints, no experiment/field-trial
  pings in the project code. The static website sets a strict CSP
  (`default-src 'self'`, no third-party scripts except Google Fonts CSS).
- AI features are **off until the user invokes them** (sidebar on demand);
  no keystrokes or page content leave the device unless the user explicitly
  sends a prompt. <!-- DRAFT: AI sağlayıcı adı + veri akışını netleştir (local-only mi, hangi API?) -->

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
| License | MPL-2.0 — https://www.mozilla.org/en-US/MPL/2.0/ |

## 7. Suggested Forum Post (copy-paste)

```text
Title: [Tool Suggestion] FoxAI Browser (Firefox-based, no telemetry, MPL-2.0)

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
<!-- DRAFT: forum kullanıcı adını + iletişim e-postasını ekle -->
```

## 8. Pre-Submit Checklist

- [ ] v3.0.0 (or later) stable tag published with real artifacts (not skeleton `BUILD-INFO.txt`).
- [ ] `SHA256SUMS.txt` + Sigstore attestation links verified on the release page.
- [ ] Flatpak `sha256` placeholder (`0000…`) replaced with the real tarball hash.
- [ ] AI data-flow documented (provider, what leaves the device, retention).
- [ ] At least one independent build reproducibility check done.
- [ ] Forum account ready; post in Tool Suggestions with the template above.
