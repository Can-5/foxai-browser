# fork/patches — source patches (quilt-style)

Patches applied on top of the Firefox ESR source tree, in `series` order,
before `./mach build`. Keep this directory small and reviewable: every
patch must (a) reference an upstream bug or a `docs/` note, (b) rebase
cleanly onto each new ESR, (c) never weaken a `fork/user.js` default.

## series (apply with `quilt push -a` or `patch -p1 < file`)

```
# 001 — product branding (name, vendor, update/support URLs)
001-foxai-branding.patch          # PLACEHOLDER — wires fork/branding/ strings
# 002 — bake hardened defaults into the binary (defense in depth;
#       user.js stays the primary layer so users can still toggle)
002-foxai-default-prefs.patch     # PLACEHOLDER — pref() calls matching fork/user.js
# 003 — strip Mozilla trademarked artwork/references left by default
003-no-mozilla-trademarks.patch   # PLACEHOLDER
```

> Status: skeleton only — the three `.patch` files above do not exist yet.
> They get written the first time a real source build runs (see
> `fork/BUILD.md §3`). Until then, privacy is delivered by
> `fork/user.js` + `fork/policies.json` (profile/distribution layer,
> no source changes needed).

## Rules

1. One logical change per patch. No drive-by refactors.
2. Header format: `From:`, `Date:`, `Subject:`, `Bug:` (or `FoxAI:` ref).
3. CI (`release.yml`) verifies `quilt push -a --dry-run` passes before build.
4. Never commit generated files (`*.orig`, `*.rej`, `.pc/`).
