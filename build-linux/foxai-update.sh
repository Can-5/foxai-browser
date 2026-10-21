#!/usr/bin/env bash
# FoxAI Browser — Linux self-update helper
#
# Mirrors the Windows "FoxAI Update.cmd" flow for Linux users:
#   1. Query the latest GitHub release for the linux tarball name + tag.
#   2. Download the tarball + SHA256SUMS.txt into a temp dir.
#   3. Verify SHA256 of the tarball against SHA256SUMS.txt.
#   4. Verify the cosign keyless signature (best-effort; warn if cosign missing).
#   5. Extract into the install prefix (default: ~/.local/share/foxai-browser),
#      keeping the previous version as a .bak for rollback.
#
# Usage:
#   ./build-linux/foxai-update.sh                 # update to latest
#   PREFIX=/opt/foxai ./build-linux/foxai-update.sh
#   TAG=v3.2.0 ./build-linux/foxai-update.sh     # pin a specific tag
#
# Env:
#   PREFIX   install prefix (default ~/.local/share/foxai-browser)
#   TAG      release tag to install (default: latest)
#   REPO     GitHub repo (default Can-5/foxai-browser)
set -euo pipefail

REPO="${REPO:-Can-5/foxai-browser}"
PREFIX="${PREFIX:-$HOME/.local/share/foxai-browser}"
TAG="${TAG:-}"

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

if ! command -v curl >/dev/null 2>&1; then
    echo "ERROR: curl is required" >&2; exit 1
fi
if ! command -v tar >/dev/null 2>&1; then
    echo "ERROR: tar is required" >&2; exit 1
fi

# 1. Resolve target tag + asset name.
if [ -z "$TAG" ]; then
    echo "Resolving latest release tag..."
    TAG="$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" \
        | sed -n 's/.*"tag_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)"
fi
if [ -z "$TAG" ]; then
    echo "ERROR: could not resolve release tag" >&2; exit 1
fi
ASSET="foxai-browser-${TAG}-linux-x86_64.tar.xz"
echo "Target: $REPO @ $TAG  ($ASSET)"

# 2. Download tarball + checksums.
BASE="https://github.com/$REPO/releases/download/$TAG"
echo "Downloading $ASSET ..."
curl -fL --progress-bar -o "$WORK/$ASSET" "$BASE/$ASSET"
curl -fsSL -o "$WORK/SHA256SUMS.txt" "$BASE/SHA256SUMS.txt" 2>/dev/null || true

# 3. Verify SHA256 (if checksums present).
if [ -s "$WORK/SHA256SUMS.txt" ]; then
    echo "Verifying SHA256..."
    (cd "$WORK" && grep "  $ASSET\$" SHA256SUMS.txt | sha256sum -c -) || {
        echo "ERROR: SHA256 verification failed" >&2; exit 1
    }
else
    echo "WARN: SHA256SUMS.txt not available; skipping checksum verification" >&2
fi

# 4. cosign keyless verification (best-effort).
if command -v cosign >/dev/null 2>&1 && [ -s "$WORK/SHA256SUMS.txt" ]; then
    echo "Verifying cosign signature (best-effort)..."
    curl -fsSL -o "$WORK/SHA256SUMS.txt.sig" "$BASE/SHA256SUMS.txt.sig" 2>/dev/null || true
    if [ -s "$WORK/SHA256SUMS.txt.sig" ]; then
        cosign verify-blob --yes \
            --certificate-identity-regexp "github.com/$REPO" \
            --certificate-oidc-issuer https://token.actions.githubusercontent.com \
            --signature "$WORK/SHA256SUMS.txt.sig" \
            "$WORK/SHA256SUMS.txt" 2>&1 | tail -3 || echo "WARN: cosign verification failed; continuing" >&2
    fi
fi

# 5. Extract + swap into prefix.
mkdir -p "$PREFIX"
BACKUP="$PREFIX.prev-$(date +%Y%m%d-%H%M%S)"
if [ -d "$PREFIX" ] && [ "$(ls -A "$PREFIX" 2>/dev/null)" ]; then
    echo "Backing up current install -> $BACKUP"
    mv "$PREFIX" "$BACKUP"
fi
mkdir -p "$PREFIX"
echo "Extracting $ASSET -> $PREFIX ..."
tar -xJf "$WORK/$ASSET" -C "$PREFIX"

# 6. Wire profile + policies (defense in depth).
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if [ -d "$PREFIX/defaults/profile" ]; then
    cp "$REPO_ROOT/fork/user.js" "$PREFIX/defaults/profile/user.js" 2>/dev/null || true
fi
if [ -d "$PREFIX/distribution" ]; then
    cp "$REPO_ROOT/fork/policies.json" "$PREFIX/distribution/policies.json" 2>/dev/null || true
fi

echo "DONE: FoxAI Browser updated to $TAG in $PREFIX"
echo "Rollback:  rm -rf $PREFIX && mv $BACKUP $PREFIX"
echo "Launch:    $PREFIX/firefox  (or use foxai-launcher.sh)"