// ============================================================
// v2.8.0 - TOR MODE (aktif) — tum trafik 127.0.0.1:9050 uzerinden
// Gereksinim: Tor calisiyor olmali (scripts\install-tor.ps1 ile kur, ya da
// Tor Browser / sistem servisi 9050 portunu dinliyor olmali)

// SOCKS5 proxy -> Tor
user_pref("network.proxy.type", 1);
user_pref("network.proxy.socks", "127.0.0.1");
user_pref("network.proxy.socks_port", 9050);
user_pref("network.proxy.socks_version", 5);
user_pref("network.proxy.socks_remote_dns", true);   // DNS sizintisi yok
user_pref("network.proxy.allow_bypass", false);

// DoH kapat (Tor DNS'i zaten anonimlestirir)
user_pref("network.trr.mode", 0);
user_pref("network.dns.disablePrefetch", true);

// WebRTC tamamen kapali (IP sizmasi imkansiz)
user_pref("media.peerconnection.enabled", false);
user_pref("media.peerconnection.turn.disable", true);

// First-party isolation + tor etiketli durum cubugu
user_pref("privacy.firstparty.isolate", true);
user_pref("extensions.torbutton.use_nontor_proxy", false);

// Otomatik guncelleme/telemetri Tor uzerinden de kapali kalir
user_pref("app.update.enabled", false);
