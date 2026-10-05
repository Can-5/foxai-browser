# fork/branding — FoxAI product identity

Drop-in brand strings/artwork applied on top of the Firefox source tree
(see `fork/patches/` for the patch that wires these in, and `fork/BUILD.md`
for where they land in `browser/branding/`).

## Product strings (EN master; TR ships via locale patch)

| Key               | Value                                            |
|-------------------|--------------------------------------------------|
| Brand name        | FoxAI Browser                                    |
| Vendor            | Can-5                                            |
| Short name        | FoxAI                                            |
| Tagline           | Private, Smart, Fox-fast                         |
| Update URL        | https://github.com/Can-5/foxai-browser/releases  |
| Support URL       | https://can-5.github.io/foxai-browser/           |
| Privacy policy    | https://can-5.github.io/foxai-browser/privacy.html |
| License           | MPL-2.0 (repo root LICENSE; bundled uBlock Origin: GPLv3) |

## Artwork status

- `foxai-mark.svg` (repo root) = current vector master (512×512).
- PNG/ICO exports (16/32/48/128/256 + `app.ico`) are generated at
  packaging time — see `fork/BUILD.md §4`. No binary artwork is
  committed (source-only rule).

## Rules

1. Never ship Mozilla trademarks (name, logos, `about:rights` text).
   The `--disable-official-branding` default in `fork/mozconfig` plus
   the branding patch keep us clean.
2. All user-visible strings go through the same EN+TR pair as the
   website (`index.html` / `main.js` i18n convention).
3. Version source of truth: git tag (`vX.Y.Z`). Display version and
   download-file version are decoupled exactly like the website's
   `VERSION` / `DL_VERSION` split in `main.js`.
