#!/bin/bash
# install.sh - Install FoxAI Browser on Linux
# Usage: ./install.sh [--prefix=/opt/foxai-browser] [--user] [--system]

set -euo pipefail

PREFIX="/opt/foxai-browser"
USER_INSTALL=false
SYSTEM_INSTALL=false

for arg in "$@"; do
    case $arg in
        --prefix=*)
            PREFIX="${arg#*=}"
            ;;
        --user)
            USER_INSTALL=true
            ;;
        --system)
            SYSTEM_INSTALL=true
            ;;
        --help|-h)
            echo "FoxAI Browser Installer"
            echo "Usage: $0 [options]"
            echo "  --prefix=DIR    Installation prefix (default: /opt/foxai-browser)"
            echo "  --user          Install to ~/.local (user installation)"
            echo "  --system        Install system-wide (requires sudo)"
            echo "  --help, -h      Show this help"
            exit 0
            ;;
        *)
            echo "Unknown option: $1" >&2
            exit 1
            ;;
    esac
done

# Determine installation paths
if [[ "${USER_INSTALL}" == "true" ]]; then
    PREFIX="${HOME}/.local/opt/foxai-browser"
    DESKTOP_DIR="${HOME}/.local/share/applications"
    BIN_DIR="${HOME}/.local/bin"
elif [[ "${SYSTEM_INSTALL}" == "true" ]]; then
    PREFIX="/opt/foxai-browser"
    DESKTOP_DIR="/usr/share/applications"
    BIN_DIR="/usr/local/bin"
else
    # Default to user install
    PREFIX="${HOME}/.local/opt/foxai-browser"
    DESKTOP_DIR="${HOME}/.local/share/applications"
    BIN_DIR="${HOME}/.local/bin"
fi

SCRIPT_DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
ROOT_DIR="$(dirname "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "\033[0;34m==>\033[0m $1"; }
success() { echo -e "\033[0;32m✓\033[0m $1"; }
warn() { echo -e "\033[1;33m!\033[0m $1"; }
error() { echo -e "\033[0;31m✗\033[0m $1" >&2; }

log "Installing FoxAI Browser to ${PREFIX}"

# Check if running as root for system install
if [[ "${SYSTEM_INSTALL}" == "true" ]] && [[ $EUID -ne 0 ]]; then
    error "System installation requires root. Run with sudo or use --user for user installation."
    exit 1
fi

# Create directories
log "Creating directories..."
mkdir -p "${PREFIX}"
mkdir -p "${DESKTOP_DIR}"
mkdir -p "${BIN_DIR}"

# Copy files
log "Copying files..."
cp -r "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/../firefox-foxai" "${PREFIX}/"
cp "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/foxai-browser" "${PREFIX}/"
cp "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/foxai-update" "${PREFIX}/"
cp "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/foxai-browser.desktop" "${PREFIX}/"

chmod +x "${PREFIX}/foxai-browser" "${PREFIX}/foxai-update"

# Create symlinks
log "Creating symlinks..."
ln -sf "${PREFIX}/foxai-browser" "${BIN_DIR}/foxai-browser"
ln -sf "${PREFIX}/foxai-update" "${BIN_DIR}/foxai-update"

# Install desktop file
log "Installing desktop entry..."
cp "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/foxai-browser.desktop" "${DESKTOP_DIR}/"

# Update desktop database
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database "${DESKTOP_DIR}" 2>/dev/null || true
fi

# Update icon cache
if command -v gtk-update-icon-cache &> /dev/null && [[ -d "${PREFIX}/firefox-foxai/runtime/browser/chrome/icons/default" ]]; then
    gtk-update-icon-cache -f -t "$(dirname "${PREFIX}/firefox-foxai/runtime/browser/chrome/icons/default")" 2>/dev/null || true
fi

success "FoxAI Browser installed successfully!"
echo ""
echo "Installation complete:"
echo "  Binary:     ${PREFIX}/foxai-browser"
echo "  Updater:    ${PREFIX}/foxai-update"
echo "  Launcher:   ${BIN_DIR}/foxai-browser"
echo "  Desktop:    ${DESKTOP_DIR}/foxai-browser.desktop"
echo ""
echo "Run 'foxai-browser' to start, or 'foxai-update' to check for updates."
echo ""
echo "Note: Make sure ${BIN_DIR} is in your PATH."
if [[ ":${PATH}:" != *":${BIN_DIR}:"* ]]; then
    warn "${BIN_DIR} is not in your PATH. Add it to your shell profile:"
    echo "  echo 'export PATH=\"${BIN_DIR}:\${PATH}\"' >> ~/.bashrc"
    echo "  source ~/.bashrc"
fi