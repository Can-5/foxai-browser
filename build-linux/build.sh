#!/usr/bin/env bash
# FoxAI Browser — Linux build script (Fedora-first)
#
# Mirrors fork/BUILD.md §3/§6 for the Waterfox source tree. Assumes the
# Waterfox source has been cloned and the foxai/ layer has been copied in
# (see fork/BUILD.md §1). Tested target: Fedora 42/43/44 (KDE) x86_64.
#
# Usage:
#   ./build-linux/build.sh                 # local dev build (fx_dev)
#   FX_RELEASE=1 ./build-linux/build.sh    # release build (LTO/PGO-ish)
#   FX_TARGET=x86_64-unknown-linux-gnu ./build-linux/build.sh
#
# Output: obj-*/dist/install/ (staged dir) + tarball in dist/
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE_DIR="${SOURCE_DIR:-$REPO_ROOT/../waterfox-source}"
FX_TARGET="${FX_TARGET:-x86_64-unknown-linux-gnu}"
FX_DEV="${FX_DEV:-1}"
FX_RELEASE="${FX_RELEASE:-}"

if [ ! -d "$SOURCE_DIR" ]; then
    echo "ERROR: Waterfox source tree not found at: $SOURCE_DIR" >&2
    echo "Clone it first:  git clone https://github.com/BrowserWorks/waterfox.git $SOURCE_DIR" >&2
    echo "Then:            cp -r $REPO_ROOT/fork $SOURCE_DIR/foxai" >&2
    exit 1
fi

cd "$SOURCE_DIR"

# 1. Drop the FoxAI layer into the tree as foxai/ (mirrors waterfox/ upstream).
if [ ! -d foxai ]; then
    cp -r "$REPO_ROOT/fork" foxai
fi

# 2. Dev mozconfig (fx_dev profile).
if [ ! -f mozconfig ]; then
    cp foxai/mozconfig ./mozconfig
fi

# 3. Export fx_* flags consumed by fork/build/mozconfig.common.
export fx_target="$FX_TARGET"
export fx_dev="$FX_DEV"
export fx_os=linux
export fx_optimize="${FX_OPTIMIZE:--O2}"
export SOURCE_DATE_EPOCH="${SOURCE_DATE_EPOCH:-$(git log -1 --format=%ct 2>/dev/null || date +%s)}"

if [ -n "$FX_RELEASE" ]; then
    export FX_RELEASE=1
    export fx_release=1
fi

# 4. Bootstrap toolchain (clang-22 etc.) — only needed once.
if [ ! -d "$HOME/.mozbuild/clang-22" ] && [ "$FX_DEV" != "1" ]; then
    echo "Bootstrapping Mozilla toolchain (clang-22, wasi sysroot)..."
    ./mach bootstrap --application=browser
fi

# 5. Build.
echo "Building FoxAI Browser for $FX_TARGET (dev=$FX_DEV)..."
./mach build

# 6. Package.
./mach package

# 7. Stage the Linux tarball with the canonical name.
DIST="$REPO_ROOT/dist"
mkdir -p "$DIST"
TAG="${TAG:-$(git describe --tags --abbrev=0 2>/dev/null || echo v0.0.0-dev)}"
TARBALL="$DIST/foxai-browser-${TAG}-linux-x86_64.tar.xz"
STAGED="$(find . -path '*/dist/install' -type d | head -1)"
if [ -z "$STAGED" ]; then
    echo "ERROR: staged install dir not found (obj-*/dist/install)" >&2
    exit 1
fi
echo "Staging $STAGED -> $TARBALL"
tar -cJf "$TARBALL" -C "$STAGED" .

# 8. Drop profile + policies + branding into the staged tree (defense in depth).
STAGE_BIN="$STAGED"
if [ -d "$STAGE_BIN/defaults/profile" ]; then
    cp "$REPO_ROOT/fork/user.js" "$STAGE_BIN/defaults/profile/user.js"
fi
if [ -d "$STAGE_BIN/distribution" ]; then
    cp "$REPO_ROOT/fork/policies.json" "$STAGE_BIN/distribution/policies.json"
fi

echo "DONE: $TARBALL"
echo "Run:  $STAGED/firefox (or install via RPM/Flatpak/AppImage)"
