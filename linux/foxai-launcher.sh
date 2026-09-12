#!/bin/bash
# FoxAI Browser Linux Launcher
# Usage: foxai-launcher.sh [launch|private|tor|offline|check|update|version]

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FIREFOX="$ROOT/firefox/firefox"
PROFILE_DIR="$ROOT/profile"
APPIMAGE="${APPIMAGE:-$0}"
VERSION_FILE="$ROOT/version.txt"
REPO="Can-5/foxai-browser"
RELEASE_API="https://api.github.com/repos/$REPO/releases/latest"

# KoboldCpp
KB_EXE="$ROOT/koboldcpp/koboldcpp"
KB_MODEL="$ROOT/koboldcpp/qwen2.5-3b-instruct-q4_k_m.gguf"
KB_PORT=5001
MODEL_URL="https://huggingface.co/Qwen/Qwen2.5-3B-Instruct-GGUF/resolve/main/qwen2.5-3b-instruct-q4_k_m.gguf"
MODEL_NAME="qwen2.5-3b-instruct-q4_k_m.gguf"

# Colors
RED='"'"'\033[0;31m'"'"'
GREEN='"'"'\033[0;32m'"'"'
YELLOW='"'"'\033[1;33m'"'"'
NC='"'"'\033[0m'"'"'

log() { echo -e "${GREEN}[+]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
err() { echo -e "${RED}[-]${NC} $*"; }

get_local_version() {
  if [[ -f "$VERSION_FILE" ]]; then
    cat "$VERSION_FILE" | tr -d '"'"'\n\r'"'"'
  else
    echo "0.0.0"
  fi
}

compare_version() {
  local a=(${1//./ }) b=(${2//./ })
  for i in {0..3}; do
    local av=${a[i]:-0} bv=${b[i]:-0}
    (( av > bv )) && return 1
    (( av < bv )) && return 2
  done
  return 0
}

get_latest_release() {
  local rel
  rel=$(curl -sSL -H "User-Agent: foxai-launcher" "$RELEASE_API" --max-time 30)
  local tag asset_url asset_name
  tag=$(echo "$rel" | grep -o '"'"'"tag_name": *"[^"]*"'"'"' | cut -d'"'"'"'"'"'"' -f4)
  tag=${tag#v}
  asset_url=$(echo "$rel" | grep -o '"'"'"browser_download_url": *"[^"]*"'"'"' | cut -d'"'"'"'"'"'"' -f4 | grep -E '"'"'\.AppImage$'"'"' | head -1)
  asset_name=$(echo "$rel" | grep -o '"'"'"name": *"[^"]*"'"'"' | cut -d'"'"'"'"'"'"' -f4 | grep -E '"'"'\.AppImage$'"'"' | head -1)
  if [[ -z "$asset_url" ]]; then
    err "No AppImage asset found on GitHub"
    return 1
  fi
  echo "$tag|$asset_url|$asset_name"
}

launch_browser() {
  local args=("-profile" "$PROFILE_DIR" "-no-remote")
  [[ "$1" == "private" ]] && args+=("-private-window")
  [[ "$1" == "tor" ]] && args+=("-tor")
  [[ "$1" == "offline" ]] && args+=("http://127.0.0.1:$KB_PORT")
  [[ "$1" == "launch" || -z "${1:-}" ]] && args+=("about:blank")
  
  export MOZ_DISABLE_CONTENT_SANDBOX=1
  export MOZ_DISABLE_GMP_SANDBOX=1
  export MOZ_DISABLE_RDD_SANDBOX=1
  export MOZ_DISABLE_SOCKET_PROCESS=1
  
  exec "$FIREFOX" "${args[@]}"
}

download_model() {
  mkdir -p "$(dirname "$KB_MODEL")"
  warn "Model not found ($MODEL_NAME)"
  warn "Downloading $MODEL_NAME (~1.9GB) from HuggingFace..."
  curl -L --progress-bar -o "$KB_MODEL.tmp" "$MODEL_URL"
  mv "$KB_MODEL.tmp" "$KB_MODEL"
  log "Model downloaded: $KB_MODEL"
}

start_offline_ai() {
  if [[ ! -f "$KB_EXE" ]]; then
    err "koboldcpp not found at $KB_EXE"
    return 1
  fi
  if [[ ! -f "$KB_MODEL" ]]; then
    download_model || return 1
  fi
  
  if ! nc -z 127.0.0.1 "$KB_PORT" 2>/dev/null; then
    log "Starting Offline AI (127.0.0.1:$KB_PORT)..."
    "$KB_EXE" -m "$KB_MODEL" --host 127.0.0.1 --port "$KB_PORT" --usecublas normal --contextsize 2048 > /dev/null 2>&1 &
    local pid=$!
    local wait=60
    while (( wait > 0 )) && ! nc -z 127.0.0.1 "$KB_PORT" 2>/dev/null; do
      sleep 2
      (( wait -= 2 ))
    done
    if (( wait == 0 )); then
      err "Offline AI failed to start on port $KB_PORT"
      return 1
    fi
    log "Offline AI ready (PID: $pid)"
  else
    log "Offline AI already running on port $KB_PORT"
  fi
}

sync_profile_config() {
  mkdir -p "$PROFILE_DIR"
  if [[ -f "$ROOT/config/user.js" ]]; then
    cp "$ROOT/config/user.js" "$PROFILE_DIR/user.js"
  fi
  if [[ -f "$ROOT/config/user-tor.js" ]]; then
    cp "$ROOT/config/user-tor.js" "$PROFILE_DIR/user-tor.js"
  fi
}

# Main
MODE="${1:-launch}"

case "$MODE" in
  version)
    get_local_version
    ;;
  check)
    rel=$(get_latest_release) || exit 1
    IFS='"'"'|'"'"'" read -r latest tag url name <<< "$rel"
    local_ver=$(get_local_version)
    compare_version "$local_ver" "$latest"
    case $? in
      1) echo "Update available: $local_ver -> $latest" ;;
      2) echo "Local newer: $local_ver > $latest" ;;
      *) echo "Up to date: $local_ver" ;;
    esac
    ;;
  update)
    rel=$(get_latest_release) || exit 1
    IFS='"'"'|'"'"'" read -r latest url name <<< "$rel"
    local_ver=$(get_local_version)
    compare_version "$local_ver" "$latest"
    if (( $? == 1 )); then
      log "Updating $local_ver -> $latest..."
      curl -sSL -o "$APPIMAGE.new" "$url" --max-time 300
      chmod +x "$APPIMAGE.new"
      mv "$APPIMAGE.new" "$APPIMAGE"
      echo "$latest" > "$VERSION_FILE"
      log "Updated to $latest. Restart to apply."
    else
      log "Already up to date ($local_ver)"
    fi
    ;;
  offline)
    sync_profile_config
    start_offline_ai || exit 1
    launch_browser offline
    ;;
  tor)
    sync_profile_config
    launch_browser tor
    ;;
  private)
    sync_profile_config
    launch_browser private
    ;;
  launch|*)
    sync_profile_config
    launch_browser launch
    ;;
esac
