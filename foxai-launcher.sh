#!/usr/bin/env bash
# FoxAI Browser — Linux launcher (AppImage-friendly)
#
# Clean rewrite of the launcher that shipped inside the AppImage (the old
# one had a quoting bug around line 82: `case "$MODE" in` with mangled
# quotes, causing `bash: syntax error near unexpected token '('`).
#
# Usage:
#   ./foxai-launcher.sh                # normal mode
#   ./foxai-launcher.sh --tor          # Tor routing mode
#   ./foxai-launcher.sh --profile DIR  # custom profile dir
set -euo pipefail

MODE="normal"
PROFILE_DIR=""
EXTRA=()

while [ $# -gt 0 ]; do
    case "$1" in
        --tor) MODE="tor"; shift ;;
        --profile) PROFILE_DIR="$2"; shift 2 ;;
        --help|-h)
            cat <<USAGE
FoxAI Browser launcher
  --tor            enable Tor routing
  --profile DIR    use DIR as profile directory
  --help           show this help
USAGE
            exit 0
            ;;
        *) EXTRA+=("$1"); shift ;;
    esac
done

# Resolve the browser binary relative to this script (works inside AppImage mount).
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BINARY="${HERE}/firefox"
if [ ! -x "$BINARY" ]; then
    # Fall back to PATH lookup (installed RPM/Flatpak case).
    if command -v foxai-browser >/dev/null 2>&1; then
        BINARY="$(command -v foxai-browser)"
    else
        echo "ERROR: foxai-browser binary not found next to launcher or on PATH" >&2
        exit 1
    fi
fi

# Profile location (XDG-compliant).
if [ -z "$PROFILE_DIR" ]; then
    PROFILE_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/foxai-browser/profile"
fi
mkdir -p "$PROFILE_DIR"

# user.js (hardened defaults) — copy if missing.
USERJS_SRC="${HERE}/defaults/profile/user.js"
if [ -f "$USERJS_SRC" ] && [ ! -f "$PROFILE_DIR/user.js" ]; then
    cp "$USERJS_SRC" "$PROFILE_DIR/user.js"
fi

# Mode-specific env.
if [ "$MODE" = "tor" ]; then
    export FOXAI_TOR=1
fi

# Launch.
exec "$BINARY" -profile "$PROFILE_DIR" "${EXTRA[@]}"
