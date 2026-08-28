#!/bin/bash
# build.sh - FoxAI Browser macOS Build script
# Creates a portable FoxAI Browser for Linux (AppImage/tar.gz)

set -euo pipefail

# Configuration
VERSION="2.2.0"
ESR_VERSION="128.3.0esr"
ESR_URL="https://ftp.mozilla.org/pub/firefox/releases/128.3.0esr/mac/en-US/Firefox%20128.3.0esr.dmg"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="${ROOT_DIR}/build-macos/work"
DIST_DIR="${ROOT_DIR}/release-macos"
EXT_DIR="${ROOT_DIR}/extensions"
CONFIG_DIR="${ROOT_DIR}/config"
ASSETS_DIR="${ROOT_DIR}/assets"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_step() {
    echo -e "${BLUE}==>${NC} $1"
}

log_success() {
    echo -e "${GREEN}âœ“${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}!${NC} $1"
}

log_error() {
    echo -e "${RED}âœ—${NC} $1"
}

# Cleanup on exit
cleanup() {
    if [[ -n "${FIREFOX_PID:-}" ]] && kill -0 "${FIREFOX_PID}" 2>/dev/null; then
        kill -TERM "${FIREFOX_PID}" 2>/dev/null || true
    fi
}
trap cleanup EXIT

# Parse arguments
REPRODUCIBLE=false
SKIP_PROFILE=false
for arg in "$@"; do
    case $arg in
        --reproducible) REPRODUCIBLE=true ;;
        --skip-profile) SKIP_PROFILE=true ;;
        *) ;;
    esac
done

if [[ "$REPRODUCIBLE" == "true" ]]; then
    export SOURCE_DATE_EPOCH=1702425600  # 2023-12-13 00:00:00 UTC
    log_step "Reproducible build mode enabled"
fi

log_step "FoxAI Browser macOS Build v${VERSION}"
log_step "Firefox ESR: ${ESR_VERSION}"

# Check dependencies
check_deps() {
    local deps=("wget" "tar" "bzip2" "node" "npm" "7z" "hdiutil")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            log_error "Missing dependency: $dep"
            exit 1
        fi
    done
    log_success "All dependencies found"
}

# Setup directories
setup_dirs() {
    log_step "Setting up directories"
    rm -rf "${BUILD_DIR}"
    mkdir -p "${BUILD_DIR}"
    mkdir -p "${DIST_DIR}"
    mkdir -p "${ROOT_DIR}/firefox-foxai/runtime"
    mkdir -p "${ROOT_DIR}/firefox-foxai/profile/foxai"
}

# Download and extract Firefox ESR
fetch_firefox() {
    log_step "Downloading Firefox ESR ${ESR_VERSION}"
    local installer="${BUILD_DIR}/firefox.dmg"
    
    if [[ ! -f "${ROOT_DIR}/firefox-foxai/runtime/Firefox.app/Contents/MacOS/firefox" ]] || [[ ! -f "${BUILD_DIR}/firefox-extracted" ]]; then
        wget -q --show-progress -O "${installer}" "${ESR_URL}" || {
            log_error "Failed to download Firefox ESR"
            exit 1
        }
        
        log_step "Extracting Firefox ESR"
        hdiutil attach "${installer}" -mountpoint /tmp/foxai-mnt -quiet
        cp -R /tmp/foxai-mnt/Firefox.app "${ROOT_DIR}/firefox-foxai/runtime/Firefox.app"
        hdiutil detach /tmp/foxai-mnt -quiet
        touch "${BUILD_DIR}/firefox-extracted"
        log_success "Firefox ESR ready"
    else
        log_success "Firefox ESR already present"
    fi
}

# Build foxai-core newtab
build_newtab() {
    log_step "Building foxai-core newtab (Vite)"
    cd "${EXT_DIR}/foxai-core"
    
    if [[ ! -f "package-lock.json" ]]; then
        npm install
    else
        npm ci
    fi
    
    # Deterministic build
    if [[ "${REPRODUCIBLE}" == "true" ]]; then
        export NODE_ENV=production
        export SOURCE_DATE_EPOCH=${SOURCE_DATE_EPOCH}
    fi
    
    npm run build
    
    # Copy built assets
    cp -r dist-newtab/* newtab/
    log_success "Newtab built"
}

# Package extensions
package_extensions() {
    log_step "Packaging extensions"
    mkdir -p "${DIST_DIR}"
    
    # foxai-core
    7z a -tzip "${DIST_DIR}/foxai-core.xpi" \
        "${EXT_DIR}/foxai-core/manifest.json" \
        "${EXT_DIR}/foxai-core/background.js" \
        "${EXT_DIR}/foxai-core/newtab" \
        "${EXT_DIR}/foxai-core/icons" \
        -mx=9
    
    # foxai-ai
    7z a -tzip "${DIST_DIR}/foxai-ai.xpi" \
        "${EXT_DIR}/foxai-ai/manifest.json" \
        "${EXT_DIR}/foxai-ai/background.js" \
        "${EXT_DIR}/foxai-ai/content" \
        "${EXT_DIR}/foxai-ai/lib" \
        "${EXT_DIR}/foxai-ai/sidebar" \
        "${EXT_DIR}/foxai-ai/icons" \
        -mx=9
    
    # foxai-search-startpage
    7z a -tzip "${DIST_DIR}/foxai-search-startpage.xpi" \
        "${EXT_DIR}/foxai-search-startpage/manifest.json" \
        "${EXT_DIR}/foxai-search-startpage/startpage" \
        "${EXT_DIR}/foxai-search-startpage/icons" \
        "${EXT_DIR}/foxai-search-startpage/foxai-mark.svg" \
        -mx=9
    
    # foxai-gestures
    7z a -tzip "${DIST_DIR}/foxai-gestures.xpi" \
        "${EXT_DIR}/foxai-gestures/manifest.json" \
        "${EXT_DIR}/foxai-gestures/background.js" \
        "${EXT_DIR}/foxai-gestures/content" \
        "${EXT_DIR}/foxai-gestures/icons" \
        -mx=9
    
    log_success "Extensions packaged"
}

# Download uBlock Origin
fetch_ublock() {
    log_step "Downloading uBlock Origin"
    local ublock_version="1.73.0"
    local ublock_url="https://github.com/gorhill/uBlock/releases/download/1.73.0/uBlock0_1.73.0.firefox.signed.xpi"
    
    wget -q --show-progress -O "${DIST_DIR}/ublock0.xpi" "${ublock_url}" || {
        log_warn "uBlock download failed, using fallback"
        # fallback to latest
        local rel=$(curl -s "https://api.github.com/repos/gorhill/uBlock/releases/latest")
        local asset_url=$(echo "${rel}" | grep -o '"browser_download_url": *"[^"]*firefox[^"]*\.xpi"' | head -1 | cut -d'"' -f4)
        if [[ -n "${asset_url}" ]]; then
            wget -q -O "${DIST_DIR}/ublock0.xpi" "${asset_url}"
        fi
    }
    log_success "uBlock Origin downloaded"
}

# Install extensions into runtime
install_extensions() {
    log_step "Installing extensions into runtime distribution"
    local distro_ext="${ROOT_DIR}/firefox-foxai/runtime/Firefox.app/Contents/Resources/distribution/extensions"
    mkdir -p "${distro_ext}"
    rm -f "${distro_ext}"/*
    
    cp "${DIST_DIR}/foxai-core.xpi" "${distro_ext}/foxai-core@foxai.browser.xpi"
    cp "${DIST_DIR}/foxai-ai.xpi" "${distro_ext}/foxai-ai@foxai.browser.xpi"
    cp "${DIST_DIR}/foxai-search-startpage.xpi" "${distro_ext}/foxai-search-startpage@foxai.local.xpi"
    if [[ -f "${DIST_DIR}/ublock0.xpi" ]]; then
        cp "${DIST_DIR}/ublock0.xpi" "${distro_ext}/uBlock0@raymondhill.net.xpi"
    fi
    log_success "Extensions installed"
}

# Install config
install_config() {
    log_step "Installing config"
    mkdir -p "${ROOT_DIR}/firefox-foxai/runtime/Firefox.app/Contents/Resources/defaults/pref"
    mkdir -p "${ROOT_DIR}/firefox-foxai/runtime/Firefox.app/Contents/Resources/distribution"
    cp "${CONFIG_DIR}/foxai.cfg" "${ROOT_DIR}/firefox-foxai/runtime/Firefox.app/Contents/Resources/defaults/pref/foxai.cfg"
    
    # Generate policies.json with file:// URLs
    local pol=$(cat "${CONFIG_DIR}/policies.json")
    file_url() {
        echo "file://$(realpath "$1" | sed 's| |%20|g')"
    }
    pol="${pol//%%CORE%%/$(file_url "${DIST_DIR}/foxai-core@foxai.browser.xpi")}"
    pol="${pol//%%SEARCH%%/$(file_url "${DIST_DIR}/foxai-search-startpage@foxai.local.xpi")}"
    pol="${pol//%%AI%%/$(file_url "${DIST_DIR}/foxai-ai@foxai.browser.xpi")}"
    pol="${pol//%%UBLOCK%%/$(file_url "${DIST_DIR}/uBlock0@raymondhill.net.xpi")}"
    
    echo "${pol}" > "${ROOT_DIR}/firefox-foxai/runtime/Firefox.app/Contents/Resources/distribution/policies.json"
    log_success "Config installed"
}

# Apply branding
apply_branding() {
    log_step "Applying branding"

    # Create simple icon if not exists
    local ico="${ASSETS_DIR}/foxai.ico"
    if [[ ! -f "${ico}" ]]; then
        # Create simple icon from PNG
        convert "${ASSETS_DIR}/foxai-128.png" -resize 128x128 "${ico}" 2>/dev/null || true
    fi

    # Note: binary branding (rcedit) is Windows-only; skipped on macOS
    log_warn "Skipping binary branding on macOS"
    log_success "Branding step completed"
}

# Create profile
create_profile() {
    if [[ "${SKIP_PROFILE}" == "true" ]]; then
        log_warn "Skipping profile creation"
        return
    fi
    
    log_step "Creating fresh FoxAI profile"
    local profile_dir="${ROOT_DIR}/firefox-foxai/profile/foxai"
    rm -rf "${profile_dir}"
    mkdir -p "${profile_dir}"
    cp "${CONFIG_DIR}/user.js" "${profile_dir}/user.js"
    
    # Initialize profile with headless Firefox
    local firefox_bin="${ROOT_DIR}/firefox-foxai/runtime/Firefox.app/Contents/MacOS/firefox"
    "${firefox_bin}" -profile "${profile_dir}" -no-remote -headless about:blank &
    local pid=$!
    sleep 15
    kill -TERM "${pid}" 2>/dev/null || true
    wait "${pid}" 2>/dev/null || true
    sleep 2
    log_success "Profile ready at ${profile_dir}"
}

# Create release archive
create_release() {
    log_step "Creating release archive"
    local zip_name="FoxAI-Browser-v${VERSION}-macos.tar.gz"
    local zip_path="${DIST_DIR}/${zip_name}"
    local stage_dir="${DIST_DIR}/stage-${VERSION}"
    
    rm -rf "${stage_dir}"
    mkdir -p "${stage_dir}"
    cp -r "${ROOT_DIR}/firefox-foxai" "${stage_dir}/firefox-foxai"
    
    # Copy launcher scripts
    cp "${ROOT_DIR}/build-macos/foxai-browser" "${stage_dir}/foxai-browser"
    cp "${ROOT_DIR}/build-macos/foxai-update" "${stage_dir}/foxai-update"
    chmod +x "${stage_dir}/foxai-browser" "${stage_dir}/foxai-update"
    
    # Version file
    echo "${VERSION}" > "${stage_dir}/version.txt"
    
    # Create tarball
    tar -czf "${zip_path}" -C "${stage_dir}" .
    rm -rf "${stage_dir}"
    
    log_success "Release created: ${zip_path}"
}

# Generate SBOM
generate_sbom() {
    log_step "Generating SBOM (CycloneDX)"
    local sbom_path="${DIST_DIR}/FoxAI-Browser-v${VERSION}-macos.sbom.json"
    
    cat > "${sbom_path}" <<EOF
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.6",
  "serialNumber": "urn:uuid:$(uuidgen)",
  "version": 1,
  "metadata": {
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "tools": [{"name": "FoxAI Build", "version": "${VERSION}"}],
    "component": {
      "type": "application",
      "name": "FoxAI Browser",
      "version": "${VERSION}",
      "description": "Privacy-focused Firefox-based browser",
      "licenses": [{"license": {"id": "MPL-2.0"}}],
      "hashes": [
        {"alg": "SHA-256", "content": "$(sha256sum "${DIST_DIR}/FoxAI-Browser-v${VERSION}-macos.tar.gz" | cut -d' ' -f1)"},
        {"alg": "SHA-512", "content": "$(sha512sum "${DIST_DIR}/FoxAI-Browser-v${VERSION}-macos.tar.gz" | cut -d' ' -f1)"}
      ]
    }
  },
  "components": []
}
EOF
    log_success "SBOM generated"
}

# Sign release (if minisign available)
sign_release() {
    if command -v minisign &> /dev/null && [[ -f "${HOME}/.minisign/minisign.key" ]]; then
        log_step "Signing release with minisign"
        minisign -Sm "${DIST_DIR}/FoxAI-Browser-v${VERSION}-macos.tar.gz" \
            -k "${HOME}/.minisign/minisign.key" \
            -t "FoxAI Browser v${VERSION}" \
            -c "Built on $(date -u)"
        log_success "Release signed"
    else
        log_warn "minisign not found or key missing, skipping signing"
    fi
}

# Main build flow
main() {
    log_step "Starting FoxAI Browser macOS Build v${VERSION}"
    
    check_deps
    setup_dirs
    fetch_firefox
    build_newtab
    package_extensions
    fetch_ublock
    install_extensions
    install_config
    apply_branding
    create_profile
    create_release
    generate_sbom
    sign_release
    
    log_success "Build completed successfully!"
    echo -e "${GREEN}Release: ${DIST_DIR}/FoxAI-Browser-v${VERSION}-macos.tar.gz${NC}"
}

main "$@"




