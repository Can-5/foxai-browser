# FoxAI Browser — BUILD.md (Waterfox-based full-fork build guide)

How a real FoxAI Browser binary is produced from the **Waterfox source
tree** (`github.com/BrowserWorks/waterfox`, default branch `current`,
G6.7.x era — latest verified: **6.7.5**, 2026-09-30) plus the `fork/`
layer. This document replaces the earlier Firefox-ESR flow.

Why Waterfox instead of raw mozilla-central:

- Same Gecko engine, already productised: built-in ad blocking,
  private DNS over Oblivious HTTP relay, tree tabs, private tabs in the
  same window — half of FoxAI's privacy story comes for free.
- Maintained, verified build config: `waterfox/build/mozconfig.common`
  (pinned clang-22, LTO/PGO/SBOM-friendly flags) — our
  `fork/build/mozconfig.common` mirrors it with `fx_*` variables, so
  deltas stay reviewable.
- **No MSVC needed**: Windows builds use `clang-cl` from the bootstrap
  toolchain (MozillaBuild shell only). No Visual Studio licence, no
  Windows SDK install.
- Licence-compatible: Waterfox tree is MPL-family (see its `LICENSE`
  pointer); FoxAI keeps its own name/artwork (no Mozilla/Waterfox
  trademarks) — matches our repo-root `LICENSE` (MPL-2.0).

> Reality check: this repo currently ships the **site + trust
> artifacts**, not a built browser. The fork source build below needs
> a Windows 10/11 machine (MozillaBuild shell, clang via bootstrap),
> ~100 GB disk and several hours. Until it runs again, privacy is
> delivered by the profile layer (`fork/user.js` + `fork/policies.json`
> + `distribution/`).

## 0. Prereqs (Windows 10/11 64-bit)

1. MozillaBuild 4.x (`C:\mozilla-build\`), Git, Node 20+, Rust stable
   (`rustup`), Python 3.11 (via MozillaBuild). **No Visual Studio.**
2. ~100 GB free disk (source + objdir + artifacts).

## 1. Source + version pin

```powershell
git clone https://github.com/BrowserWorks/waterfox.git source
cd source
git checkout 6.7.5   # match docs/releases/*-DRAFT.md
# Bring the FoxAI layer into the tree as foxai/ (mirrors upstream's waterfox/):
Copy-Item -Recurse ..\foxai-browser\fork foxai
# Dev entry file (fx_dev profile; real flags in foxai/build/mozconfig.common):
Copy-Item foxai\mozconfig .\mozconfig
```

Waterfox-tag bump rule: one Waterfox tag per FoxAI minor (diff
`fork/user.js` against the new arkenfox release, rebase
`fork/patches/series`, re-check `fork/build/mozconfig.common` deltas
against upstream's `waterfox/build/mozconfig.common`).

## 2. Bootstrap (clang toolchain, no MSVC)

```powershell
./mach bootstrap --application=browser   # accept the clang toolchain prompts
# patches (when they exist — see fork/patches/README.md):
#   quilt push -a   # from inside foxai/patches with series file
```

## 3. Build (release profile)

```powershell
$env:fx_target = "x86_64-pc-windows-msvc"
$env:FX_RELEASE = "1"
$env:fx_optimize = "-O2"   # keep in sync with .github/workflows/release.yml
$env:SOURCE_DATE_EPOCH = (git log -1 --format=%ct)
./mach build
./mach package
# output: obj-*/dist/install/  (unsigned staging dir)
```

Linux/macOS triples: `x86_64-unknown-linux-gnu` /
`aarch64-apple-darwin` (same `fx_target` mechanism; macOS needs Xcode
CLT on the Mac host — no cross-compile).

## 4. Brand + harden the package

1. Copy `foxai/branding/` strings/artwork into the staged app dir
   (overwrites Waterfox brand files — never ship their marks).
2. Export PNG/ICO from `foxai-mark.svg` (16/32/48/128/256 + app.ico).
3. Drop `foxai/user.js` → `defaults\profile\user.js`,
   `foxai/policies.json` → `distribution\policies.json`.
4. Zip as `FoxAI-Browser-vX.Y.Z-win64.zip`
   (name contract — see release.yml + download.html + winget split).

## 5. Sign + verify + publish

```powershell
# Sigstore keyless (CI does this automatically via release.yml):
cosign sign-blob --yes SHA256SUMS.txt --output-signature SHA256SUMS.txt.sig
cosign verify-blob --bundle SHA256SUMS.txt.sigstore `
  --certificate-identity-regexp '^https://github.com/Can-5/foxai-browser/' `
  --certificate-oidc-issuer https://token.actions.githubusercontent.com `
  SHA256SUMS.txt
# Windows SmartScreen reputation: SignPath (see release.yml gated step) —
# until then, first-run SmartScreen warning is expected; SECURITY.md says so.
```

Upload the ZIP + SHA256SUMS.txt(+.sig) to the GitHub release, fill the
hashes into `manifests/winget/*/installer.yaml` + Flathub manifest,
then open the winget-pkgs / flathub PRs.

## 6. Linux/macOS notes

- Linux: same flow on Fedora (`sudo dnf builddep firefox`), tar as
  `foxai-browser-vX.Y.Z-linux-x86_64.tar.xz` (+ RPM spec later).
- macOS: build per arch, `lipo` the two app bundles, zip as
  `FoxAI-Browser-vX.Y.Z-macos.zip`; notarize with `notarytool`
  (Apple Developer ID required) or Gatekeeper will block it.
