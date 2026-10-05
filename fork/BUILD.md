# FoxAI Browser — BUILD.md (full-fork build guide)

How a real FoxAI Browser binary is produced from Firefox ESR source +
the `fork/` skeleton. This is the document the v3.x Windows ZIPs
(`FoxAI-Browser-v3.0.0.zip` et al.) were built from — kept so any
maintainer with a Windows machine can reproduce them.

> Reality check: this repo currently ships the **site + trust
> artifacts**, not a built browser. The fork source build below needs
> a Windows 10/11 machine (MSVC), ~100 GB disk and several hours.
> Until it runs again, privacy is delivered by the profile layer
> (`fork/user.js` + `fork/policies.json` + `distribution/`).

## 0. Prereqs (Windows 10/11 64-bit)

1. Visual Studio 2022 (Desktop C++ workload) + Windows 11 SDK.
2. MozillaBuild 4.x (`C:\mozilla-build\`), Git, Node 20+, Rust stable
   (`rustup`), Python 3.11 (via MozillaBuild).
3. ~100 GB free disk (source + objdir + artifacts).

## 1. Source + version pin

```powershell
git clone https://github.com/mozilla-firefox/firefox.git source
cd source
git checkout FIREFOX_128_12_0ESR_RELEASE   # match docs/releases/*-DRAFT.md
Copy-Item ..\foxai-browser\fork\mozconfig .\mozconfig
```

ESR bump rule: one ESR per FoxAI minor (diff `user.js` against the new
arkenfox release + rebase `fork/patches/series`).

## 2. Apply FoxAI layer

```powershell
Copy-Item ..\foxai-browser\fork\mozconfig .\mozconfig
# patches (when they exist — see fork/patches/README.md):
#   quilt push -a   # from inside fork/patches with series file
./mach bootstrap --application=browser   # accept MSVC + SDK prompts
```

## 3. Build

```powershell
$env:SOURCE_DATE_EPOCH = (git log -1 --format=%ct)
./mach build
./mach package
# output: obj-foxai\dist\install\seo\  (unsigned staging dir)
```

## 4. Brand + harden the package

1. Copy `fork/branding/` strings/artwork into
   `obj-foxai\dist\foxai\` (overwrites default brand files).
2. Export PNG/ICO from `foxai-mark.svg` (16/32/48/128/256 + app.ico).
3. Drop `fork/user.js` → `defaults\profile\user.js`,
   `fork/policies.json` → `distribution\policies.json`.
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
- macOS: build per arch, `lipo` the two `Firefox.app`s, zip as
  `FoxAI-Browser-vX.Y.Z-macos.zip`; notarize with `notarytool`
  (Apple Developer ID required) or Gatekeeper will block it.
