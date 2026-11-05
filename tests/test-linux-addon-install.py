#!/usr/bin/env python3
"""Verify Linux packages use relocatable distribution extension installation."""

import json
import re
import sys
from pathlib import Path


REQUIRED_EXTENSIONS = (
    "foxai-core@foxai.browser.xpi",
    "foxai-search-startpage@foxai.local.xpi",
    "foxai-ai@foxai.browser.xpi",
    "uBlock0@raymondhill.net.xpi",
)


def main() -> int:
    runtime = Path(sys.argv[1] if len(sys.argv) > 1 else "firefox-foxai/runtime")
    policy_path = runtime / "distribution" / "policies.json"
    prefs_path = runtime / "defaults" / "pref" / "foxai.cfg"
    extension_dir = runtime / "distribution" / "extensions"

    policies = json.loads(policy_path.read_text(encoding="utf-8"))["policies"]
    if "ExtensionSettings" in policies:
        raise SystemExit("Linux policies must not contain build-machine extension URLs")

    for addon in REQUIRED_EXTENSIONS:
        if not (extension_dir / addon).is_file():
            raise SystemExit(f"Linux package is missing bundled extension: {addon}")

    prefs = prefs_path.read_text(encoding="utf-8")
    if not re.search(r'pref\("extensions\.installDistroAddons",\s*true\);', prefs):
        raise SystemExit("extensions.installDistroAddons is not enabled for Linux")

    print(f"Linux extension installation OK: {len(REQUIRED_EXTENSIONS)} packages")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
