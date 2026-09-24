<!-- DRAFT: PR açmadan önce v3.0.0 tarball URL + SHA256, .desktop/.metainfo dosyalarını ve OARS yanıtlarını doldur -->

# Flathub Submission Draft — FoxAI Browser

> Status: DRAFT — submit via PR to `https://github.com/flathub/flathub`
> (new repo `flathub/io.github.Can5.foxai-browser`) AFTER v3.0.0 stable.
> Guide: https://docs.flathub.org/docs/for-app-authors/submission
> Language: English.

## 1. App Identity

| Field | Value |
| ----- | ----- |
| App ID | `io.github.Can5.foxai-browser` |
| Name | FoxAI Browser |
| Summary | Privacy-first Firefox-based browser with built-in AI and Tor |
| License (code) | MPL-2.0 |
| Homepage | https://github.com/Can-5/foxai-browser |
| Bug tracker | https://github.com/Can-5/foxai-browser/issues |
| Donate | <!-- DRAFT: bağış linki varsa yaz, yoksa satırı sil --> |
| Runtime | `org.freedesktop.Platform` // `23.08` |
| SDK | `org.freedesktop.Sdk` // `23.08` |
| Command | `foxai-browser` |
| Stable tarball | `https://github.com/Can-5/foxai-browser/releases/download/v3.0.0/FoxAI-Browser-v3.0.0-linux-x86_64.tar.xz` |
| SHA256 | `0000000000000000000000000000000000000000000000000000000000000000` <!-- DRAFT: `sha256sum` çıktısını koy --> |

In-repo skeleton: `manifests/flatpak/io.github.Can5.foxai-browser.yaml`
(requires real `url`/`sha256` + the two files below before PR).

## 2. Manifest Path & Required Files

Target Flathub repo layout (new repo `flathub/io.github.Can5.foxai-browser`):

```text
io.github.Can5.foxai-browser.yaml        # ← from manifests/flatpak/ (url+sha256 filled)
io.github.Can5.foxai-browser.desktop    # <!-- DRAFT: dosyayı oluştur — Exec=foxai-browser, Icon, Categories=Network;WebBrowser; -->
io.github.Can5.foxai-browser.metainfo.xml  # <!-- DRAFT: dosyayı oluştur — AppData spec, releases, OARS, screenshots -->
```

Minimal `.desktop` sketch:

```ini
[Desktop Entry]
Name=FoxAI Browser
Comment=Privacy-first Firefox-based browser with built-in AI and Tor
Exec=foxai-browser %u
Icon=io.github.Can5.foxai-browser
Terminal=false
Type=Application
Categories=Network;WebBrowser;
StartupWMClass=foxai-browser
MimeType=x-scheme-handler/http;x-scheme-handler/https;text/html;
```

Minimal `.metainfo.xml` sketch (fill `<releases>` + `<screenshots>`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<component type="desktop-application">
  <id>io.github.Can5.foxai-browser</id>
  <metadata_license>CC0-1.0</metadata_license>
  <project_license>MPL-2.0</project_license>
  <name>FoxAI Browser</name>
  <summary>Privacy-first Firefox-based browser with built-in AI and Tor</summary>
  <description>
    <p>Firefox-based browser with no telemetry, on-demand AI sidebar and optional Tor routing.</p>
  </description>
  <launchable type="desktop-id">io.github.Can5.foxai-browser.desktop</launchable>
  <screenshots>
    <!-- DRAFT: screenshots/*.png URL'lerini ekle (tercihen remote, 16:9) -->
  </screenshots>
  <releases>
    <!-- DRAFT: v3.0.0 tarihi + açıklama -->
  </releases>
  <content_rating type="oars-1.1"/>
  <url type="homepage">https://github.com/Can-5/foxai-browser</url>
  <url type="bugtracker">https://github.com/Can-5/foxai-browser/issues</url>
</component>
```

## 3. Permissions Justification (`finish-args`)

| Permission | Why |
| ---------- | --- |
| `--share=ipc` | Browser IPC / X11 shared memory (standard). |
| `--socket=x11` + `--socket=wayland` | Display servers (Wayland preferred, X11 fallback). |
| `--share=network` | A web browser needs network. |
| `--socket=pulseaudio` | WebRTC / media audio. |
| `--device=dri` | GPU acceleration. |
| `--talk-name=org.freedesktop.Notifications` | Download-complete / update notifications only. |
| `--filesystem=xdg-download` | Save downloads to `~/Downloads` only (no home access). |

> No `--filesystem=home`, no `--socket=system-bus`, no `--allow=devel`.
> Anything added later must be justified in the PR description.

## 4. Local Build Test (must pass before PR)

```bash
# 1) Install tooling
flatpak install flathub org.flatpak.Builder org.freedesktop.Platform//23.08 org.freedesktop.Sdk//23.08

# 2) Lint manifest + metainfo
flatpak run --command=flatpak-builder-lint org.flatpak.Builder manifest \
  manifests/flatpak/io.github.Can5.foxai-browser.yaml
appstreamcli validate --explain io.github.Can5.foxai-browser.metainfo.xml
desktop-file-validate io.github.Can5.foxai-browser.desktop

# 3) Full build + test install + run
flatpak-builder --force-clean --sandbox --user --install \
  --install-deps-from=flathub --ccache --mirror-screenshots-url=https://dl.flathub.org/media/ \
  build-dir manifests/flatpak/io.github.Can5.foxai-browser.yaml
flatpak run io.github.Can5.foxai-browser --version
```

Expected: zero lint errors, app launches, downloads land in `~/Downloads`,
no host-filesystem escapes (check with Flatseal).

## 5. Icon & Screenshots

- [ ] Icon: SVG source `foxai-mark.svg` → export 128×128 + 256×256 PNG,
  install as `io.github.Can5.foxai-browser.png` (hicolor).
- [ ] Screenshots (16:9 preferred, from `screenshots/`): `main.png`,
  `privacy.png`, `tor.png`, `ai.png` — referenced in metainfo `<screenshots>`.
- [ ] Caption each screenshot (`<caption>` short EN text).

## 6. OARS (content rating) — Proposed Answers

> Fill interactively via https://hughsie.github.io/oars/generate.html and
> paste the resulting `<content_rating>` block into metainfo.
> Proposed baseline (browser = web content, user-controlled):

- Violence / language / sexual content: **none** (renders third-party web;
  no bundled mature content).
- Gambling / drugs / alcohol: **none**.
- Social / chat: **mild** only if the AI sidebar offers open chat
  <!-- DRAFT: AI sohbet açıksa `social-chat` seviyesini kontrol et -->.
- In-app purchases / ads: **none**.

## 7. Flathub PR Checklist

- [ ] New repo request filed: `flathub/io.github.Can5.foxai-browser`.
- [ ] Manifest `url` + real `sha256` (no `0000…` placeholder).
- [ ] `.desktop` + `.metainfo.xml` present, validated (see §4).
- [ ] `flatpak-builder` clean build + `flatpak run` smoke test done.
- [ ] Icon + ≥2 screenshots wired in metainfo.
- [ ] OARS block pasted and consistent with answers above.
- [ ] No bundled Firefox binaries violating redistribution
      (source-built or permission confirmed).
- [ ] Release workflow (`.github/workflows/release.yml`) produces the exact
      tarball referenced by the manifest (SBOM + Sigstore linked).
- [ ] PR description links: repo, SECURITY.md, release tag, build log.

## 8. Suggested PR Description (copy-paste)

```text
New app: io.github.Can5.foxai-browser (FoxAI Browser, MPL-2.0)

- Homepage: https://github.com/Can-5/foxai-browser
- Stable tarball: <FILL URL> (sha256: <FILL>)
- Local build: flatpak-builder clean, appstreamcli + desktop-file-validate pass
- Permissions minimal (network, wayland/x11, dri, pulseaudio, notifications, xdg-download)
- Screenshots + OARS included in metainfo
```
