# FoxAI Browser — RPM spec (Fedora-first)
# Build:  rpmbuild -ba foxai-browser.spec  (after staging the tarball)
# Source tarball: foxai-browser-<version>-linux-x86_64.tar.xz
Name:           foxai-browser
Version:        3.2.0
Release:        1%{?dist}
Summary:        Privacy-first Firefox-based browser with built-in AI and Tor

License:        MPL-2.0
URL:            https://github.com/Can-5/foxai-browser
Source0:        https://github.com/Can-5/foxai-browser/releases/download/v%{version}/foxai-browser-v%{version}-linux-x86_64.tar.xz

BuildArch:      x86_64
Requires:       gtk3, libXt, alsa-lib, pulseaudio-libs, nss, nspr, libstdc++

%description
FoxAI Browser is a privacy-first Firefox derivative with built-in AI
assistance and optional Tor routing. Trackers are blocked by default and
no telemetry leaves the device. (MPL-2.0; bundled uBlock Origin: GPLv3.)

%prep
%autosetup -c

%build
# Prebuilt binary tarball; nothing to compile here. Real source builds use
# build-linux/build.sh + fork/BUILD.md.

%install
mkdir -p %{buildroot}/opt/foxai-browser
cp -a ./* %{buildroot}/opt/foxai-browser/

# Launcher symlink
mkdir -p %{buildroot}%{_bindir}
ln -s /opt/foxai-browser/foxai-launcher.sh %{buildroot}%{_bindir}/foxai-browser

# Desktop entry
mkdir -p %{buildroot}%{_datadir}/applications
cat > %{buildroot}%{_datadir}/applications/io.github.Can5.foxai-browser.desktop <<'DESKTOP'
[Desktop Entry]
Name=FoxAI Browser
GenericName=Web Browser
Comment=Privacy-first Firefox-based browser with built-in AI and Tor
Exec=foxai-browser %u
Icon=io.github.Can5.foxai-browser
Terminal=false
Type=Application
Categories=Network;WebBrowser;
MimeType=text/html;text/xml;application/xhtml+xml;x-scheme-handler/http;x-scheme-handler/https;
StartupWMClass=foxai-browser
DESKTOP

# Icons (generated at packaging time from foxai-mark.svg)
# mkdir -p %{buildroot}%{_datadir}/icons/hicolor/...
# install -Dm644 ... %{buildroot}%{_datadir}/icons/hicolor/...

%files
/opt/foxai-browser/
%{_bindir}/foxai-browser
%{_datadir}/applications/io.github.Can5.foxai-browser.desktop

%changelog
* Wed Oct 21 2026 İlkay Can <kygszilkaycan@icloud.com> - 3.2.0-1
- Initial Fedora RPM skeleton (binary tarball).
- Linux launcher (foxai-launcher.sh) fixed: quoting bug resolved.
EOF
echo "RPM spec written"