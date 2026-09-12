Name:           foxai-browser
Version:        2.0.0.0
Release:        1%{?dist}
Summary:        FoxAI Browser - Privacy-focused Firefox fork with offline AI
License:        MPL-2.0
URL:            https://github.com/Can-5/foxai-browser
Source0:        FoxAI-Browser-%{version}.AppImage
Source1:        foxai-browser.desktop
Source2:        foxai-browser.ico
Requires:       glibc >= 2.28, libstdc++ >= 11, gtk3 >= 3.24, dbus, libX11, libXext, libXrender, libXcomposite, libXcursor, libXdamage, libXfixes, libXi, libXrandr, libXScrnSaver, libxtst, nss, alsa-lib, libasound2, mesa-libgbm, libdrm
BuildArch:      x86_64

%description
FoxAI Browser is a privacy-hardened Firefox fork with built-in offline AI support.
Features:
- LibreWolf-level fingerprinting resistance (RFP + letterboxing + canvas/webgl/audio noise)
- Offline AI mode: local LLM (qwen2.5-3b) via koboldcpp on localhost:5001
- Tor integration, hardened prefs, no telemetry/pocket/studies
- Portable AppImage - runs on any glibc 2.28+ distro (Fedora, Ubuntu, Debian, Arch, etc.)

%prep
# No build - binary AppImage

%build
# No build

%install
mkdir -p %{buildroot}/usr/bin
mkdir -p %{buildroot}/usr/share/applications
mkdir -p %{buildroot}/usr/share/icons/hicolor/256x256/apps
install -m 755 %{SOURCE0} %{buildroot}/usr/bin/foxai-browser
install -m 644 %{SOURCE1} %{buildroot}/usr/share/applications/
install -m 644 %{SOURCE2} %{buildroot}/usr/share/icons/hicolor/256x256/apps/

%files
/usr/bin/foxai-browser
/usr/share/applications/foxai-browser.desktop
/usr/share/icons/hicolor/256x256/apps/foxai-browser.ico

%changelog
* Thu Sep 12 2026 Can-5 <kygszilkaycan@icloud.com> - 2.0.0.0-1
- Initial release: LibreWolf branding removed, FoxAI identity
- Offline AI (koboldcpp + qwen2.5-3b) integrated
- Major privacy hardening (RFP gaps closed, lockPref conflicts resolved)
- Portable AppImage + RPM + DEB
