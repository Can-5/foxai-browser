#!/bin/bash
# build-appimage.sh - Build FoxAI Browser as AppImage
# Requires: appimagetool, linuxdeploy, patchelf

set -euo pipefail

VERSION="2.2.0"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="${ROOT_DIR}/build-linux/appimage-build"
APPDIR="${BUILD_DIR}/FoxAI-Browser.AppDir"
OUTPUT_DIR="${ROOT_DIR}/release-linux"

log_step() { echo -e "\033[0;34m==>\033[0m $1"; }
log_success() { echo -e "\033[0;32m✓\033[0m $1"; }
log_warn() { echo -e "\033[1;33m!\033[0m $1"; }
log_error() { echo -e "\033[0;31m✗\033[0m $1" >&2; }

check_deps() {
    local deps=("appimagetool" "linuxdeploy" "patchelf" "desktop-file-validate")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            log_error "Missing dependency: $dep"
            exit 1
        fi
    done
    log_success "All AppImage dependencies found"
}

build_appimage() {
    log_step "Building FoxAI Browser AppImage"
    
    # Clean previous build
    rm -rf "${BUILD_DIR}"
    mkdir -p "${BUILD_DIR}"
    
    # Create AppDir structure
    mkdir -p "${APPDIR}/usr/bin"
    mkdir -p "${APPDIR}/usr/share/applications"
    mkdir -p "${APPDIR}/usr/share/icons/hicolor/256x256/apps"
    mkdir -p "${APPDIR}/usr/share/icons/hicolor/scalable/apps"
    mkdir -p "${APPDIR}/foxai-browser"
    
    # Copy built browser
    local root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
    cp -r "${ROOT_DIR}/firefox-foxai" "${APPDIR}/foxai-browser/"
    cp "${ROOT_DIR}/build-linux/foxai-browser" "${APPDIR}/usr/bin/foxai-browser"
    cp "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/foxai-update" "${APPDIR}/usr/bin/foxai-update"
    chmod +x "${APPDIR}/usr/bin/foxai-browser" "${APPDIR}/usr/bin/foxai-update"
    
    # Copy desktop file
    cp "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/foxai-browser.desktop" "${APPDIR}/usr/share/applications/"
    cp "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/foxai-browser.desktop" "${APPDIR}/"
    
    # Copy icon
    local icon_src="$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/../assets/foxai-128.png"
    if [[ -f "${icon_src}" ]]; then
        cp "${icon_src}" "${APPDIR}/usr/share/icons/hicolor/256x256/apps/foxai-browser.png"
        cp "${icon_src}" "${APPDIR}/foxai-browser.png"
        # SVG version for scalable
        if command -v convert &> /dev/null; then
            convert "${ROOT_DIR}/assets/foxai-128.png" -resize 256x256 "${APPDIR}/usr/share/icons/hicolor/256x256/apps/foxai-browser.png"
        fi
    fi
    
    # Create AppRun entry point
    cat > "${APPDIR}/AppRun" <<'EOF'
#!/bin/bash
set -euo pipefail

HERE="$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")"
export PATH="${HERE}/usr/bin:${PATH}"
export LD_LIBRARY_PATH="${HERE}/usr/lib:${HERE}/foxai-browser/runtime:${LD_LIBRARY_PATH:-}"

# FoxAI environment
export MOZ_DISABLE_CONTENT_SANDBOX=1
export MOZ_DISABLE_GMP_SANDBOX=1
export MOZ_DISABLE_RDD_SANDBOX=1
export MOZ_DISABLE_SOCKET_PROCESS=1
export MOZ_DISABLE_NONLOCAL_CONNECTIONS=1
export MOZ_DISABLE_NETWORK_PREDICTION=1
export MOZ_DISABLE_PREFETCH=1
export MOZ_DISABLE_SPECULATIVE_CONNECT=1

exec "${HERE}/usr/bin/foxai-browser" "$@"
EOF
    chmod +x "${APPDIR}/AppRun"
    
    # Create .desktop file for AppImage
    cat > "${APPDIR}/foxai-browser.desktop" <<EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=FoxAI Browser
GenericName=Privacy Web Browser
Comment=Privacy-focused Firefox-based browser with built-in AI, zero telemetry
Exec=foxai-browser %u
Icon=foxai-browser
Terminal=false
Type=Application
Categories=Network;WebBrowser;
MimeType=text/html;text/xml;application/xhtml+xml;x-scheme-handler/http;x-scheme-handler/https;x-scheme-handler/ftp;
StartupNotify=true
StartupWMClass=FoxAI Browser
Keywords=privacy;browser;ai;firefox;tor;vpn;proxy;
Actions=new-window;private-window;

[Desktop Action new-window]
Name=New Window
Exec=foxai-browser

[Desktop Action private-window]
Name=New Private Window
Exec=foxai-browser --private
EOF
    
    # Validate desktop file
    desktop-file-validate "${APPDIR}/foxai-browser.desktop"
    
    # Copy icon
    if [[ -f "${ROOT_DIR}/assets/foxai-128.png" ]]; then
        cp "${ROOT_DIR}/assets/foxai-128.png" "${APPDIR}/foxai-browser.png"
    fi
    
    log_step "Building AppImage with linuxdeploy..."
    export ARCH=x86_64
    linuxdeploy --appdir "${APPDIR}" \
        --output appimage \
        --desktop-file "${APPDIR}/foxai-browser.desktop" \
        --icon-file "${APPDIR}/foxai-browser.png" \
        --executable "${APPDIR}/usr/bin/foxai-browser" \
        --custom-apprun "${APPDIR}/AppRun" \
        --output appimage
    
    # Move to output
    mkdir -p "${OUTPUT_DIR}"
    mv FoxAI_Browser-*.AppImage "${OUTPUT_DIR}/FoxAI-Browser-v2.2.0-linux-x86_64.AppImage"
    
    log_success "AppImage created: ${OUTPUT_DIR}/FoxAI-Browser-v2.2.0-linux-x86_64.AppImage"
}

main() {
    log_step "Building FoxAI Browser AppImage v2.2.0"
    check_deps
    build_appimage
    log_success "AppImage build complete!"
}

main "$@"