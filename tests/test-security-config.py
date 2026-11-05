#!/usr/bin/env python3
"""Check security, permission, update, and platform parity configuration."""

import hashlib
import json
import re
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
UBLOCK_VERSION = "1.75.4"
UBLOCK_SHA256 = "e2df503cce7cf5069130618c349695f62bdddb9eb8c189156d027269ae4ae267"


def read_prefs(path: Path, function: str) -> dict[str, str]:
    pattern = re.compile(
        rf'{function}\(\s*"([^"]+)"\s*,\s*("(?:[^"\\]|\\.)*"|[^,)]+)\s*\);'
    )
    result = {}
    for key, value in pattern.findall(path.read_text(encoding="utf-8-sig")):
        result[key] = value.strip()
    return result


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def main() -> None:
    cfg = read_prefs(ROOT / "config/foxai.cfg", "pref")
    user = read_prefs(ROOT / "config/user.js", "user_pref")

    preserved = {
        "media.peerconnection.enabled": "false",
        "media.peerconnection.ice.no_host": "true",
        "media.peerconnection.ice.default_address_only": "true",
        "network.trr.mode": "2",
        "network.trr.uri": '"https://mozilla.cloudflare-dns.com/dns-query"',
        "dom.security.https_only_mode": "true",
    }
    for name, value in preserved.items():
        require(cfg.get(name) == value, f"foxai.cfg has incorrect {name}: {cfg.get(name)}")
        require(user.get(name) == value, f"user.js has incorrect {name}: {user.get(name)}")

    tor = read_prefs(ROOT / "config/tor-overrides.js", "user_pref")
    require(tor.get("media.peerconnection.enabled") == "false",
            "Tor mode must keep WebRTC disabled")
    require(tor.get("network.trr.mode") == "0",
            "Tor mode must keep Firefox DoH off so DNS follows the Tor proxy")
    require(tor.get("app.update.enabled") == "true",
            "Tor mode must keep Firefox security updates enabled")

    for name in (
        "app.update.enabled",
        "extensions.update.enabled",
        "extensions.update.autoUpdateDefault",
    ):
        require(cfg.get(name) == "true", f"foxai.cfg must enable {name}")
        require(user.get(name) == "true", f"user.js must enable {name}")

    for name in (
        "browser.safebrowsing.malware.enabled",
        "browser.safebrowsing.phishing.enabled",
        "browser.safebrowsing.downloads.enabled",
    ):
        require(cfg.get(name) == "true", f"foxai.cfg must enable {name}")
        require(user.get(name) == "true", f"user.js must enable {name}")
    require(user.get("browser.safebrowsing.downloads.remote.enabled") == "false",
            "remote download reputation checks must remain off")

    for name in ("camera", "microphone", "geo", "desktop-notification"):
        pref = f"permissions.default.{name}"
        require(cfg.get(pref) == "0", f"foxai.cfg must prompt for {name} permission")
        require(user.get(pref) == "0", f"user.js must prompt for {name} permission")
    for name in ("media.navigator.enabled", "geo.enabled", "dom.webnotifications.enabled"):
        require(cfg.get(name) == "true", f"foxai.cfg must leave {name} available for permission prompts")
        require(user.get(name) == "true", f"user.js must leave {name} available for permission prompts")

    policies = {
        name: json.loads((ROOT / "config" / name).read_text(encoding="utf-8"))["policies"]
        for name in ("policies.json", "policies-linux.json", "policies-linux-appimage.json")
    }
    for name in ("policies.json", "policies-linux.json"):
        require("DisableAppUpdate" not in policies[name], f"{name} must allow Firefox security updates")
        require("DisableSystemAddonUpdate" not in policies[name],
                f"{name} must allow built-in security add-on updates")
    require(policies["policies-linux-appimage.json"].get("DisableAppUpdate") is True,
            "AppImage must use its release/package updater rather than Firefox self-update")
    require(all("DisableSystemAddonUpdate" not in policy for policy in policies.values()),
            "built-in security add-on updates must remain enabled on every platform")
    linux_workflow = (ROOT / ".github/workflows/linux-build.yml").read_text(encoding="utf-8")
    require("config/policies-linux-appimage.json" in linux_workflow,
            "Linux AppImage workflow must use the packaging-specific update policy")

    distribution = (ROOT / "config/distribution.ini").read_text(encoding="utf-8-sig")
    require(not re.search(r"(?im)^app\.update\.(?:enabled|auto)=false\s*$", distribution),
            "distribution.ini must not disable Firefox updates")

    version_files = {
        "build.ps1": "153.6.0esr",
        ".github/workflows/ci.yml": "153.6.0esr",
        "build-linux/build.sh": "153.6.0esr",
        ".github/workflows/linux-build.yml": "153.6.0esr",
        "build-macos/build.sh": "153.6.0esr",
        "website/index.html": "153.6.0esr",
    }
    for filename, version in version_files.items():
        content = (ROOT / filename).read_text(encoding="utf-8-sig")
        require(version in content, f"{filename} does not target Firefox ESR {version}")
        require("140.0esr" not in content, f"{filename} still references obsolete Firefox ESR 140")

    for filename in ("build.ps1", "build-linux/build.sh", "build-macos/build.sh"):
        content = (ROOT / filename).read_text(encoding="utf-8-sig").lower()
        require(UBLOCK_VERSION in content, f"{filename} does not pin uBlock {UBLOCK_VERSION}")
        require(UBLOCK_SHA256 in content, f"{filename} does not verify the pinned uBlock digest")

    xpi_path = ROOT / "linux/resources/distribution/extensions/uBlock0@raymondhill.net.xpi"
    xpi_bytes = xpi_path.read_bytes()
    require(hashlib.sha256(xpi_bytes).hexdigest() == UBLOCK_SHA256,
            "bundled Linux uBlock XPI does not match the official release SHA-256")
    with zipfile.ZipFile(xpi_path) as xpi:
        manifest = json.loads(xpi.read("manifest.json"))
    require(manifest.get("version") == UBLOCK_VERSION, "bundled uBlock version mismatch")
    require(manifest.get("browser_specific_settings", {}).get("gecko", {}).get("id")
            == "uBlock0@raymondhill.net", "bundled uBlock extension ID mismatch")

    hashes = json.loads((ROOT / "config/supply-chain-hashes.json").read_text(encoding="utf-8-sig"))
    for section in ("ublock_source", "xpi_files"):
        record = hashes[section]["ublock0.xpi"]
        require(record["sha256"].lower() == UBLOCK_SHA256, f"stale uBlock SHA-256 in {section}")
        require(record["size"] == len(xpi_bytes), f"stale uBlock size in {section}")

    print("Security configuration OK: update paths, permission prompts, Safe Browsing, HTTPS, WebRTC/DoH parity, and uBlock integrity")


if __name__ == "__main__":
    main()
