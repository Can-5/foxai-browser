// FoxAI Browser site — v3.0.0 FoxAI One | bilingual EN/TR, configurable releases
const VERSION = "3.0.0";
const LANG_KEY = "fxweb:lang";
// Central release config — change only here for future versions
const RELEASE = {
  version: VERSION,
  tag: "v" + VERSION,
  base: "https://github.com/Can-5/foxai-browser/releases/download",
  file: "FoxAI-Browser-v" + VERSION + ".zip",
  get url(){ return this.base + "/" + this.tag + "/" + this.file; }
};

const DICT = {
  en: {
    nav_features:"Features", nav_showcase:"Showcase", nav_tech:"Technology", nav_why:"Why", nav_ai:"AI", nav_privacy:"Privacy", nav_hub:"Hub", nav_about:"About", nav_download:"Download", nav_faq:"FAQ", nav_cta:"Get FoxAI", nav_download_btn:"Download",
    hero_h1:'Private. Smart. <span class="grad">Fox-fast.</span>',
    hero_lead:"A Firefox-based browser that respects you: no telemetry, no tracking, an AI sidebar that only sees what you allow, and a new-tab that is actually yours. Portable, open source, yours to verify.",
    cta_dl:"Download FoxAI Browser", cta_gh:"View on GitHub", cta_see:"See what's inside",
    hero_hint:"Portable · Windows · Firefox ESR base · no installer · ~324 MB",
    mock_caption:"FoxAI Start + AI Sidebar — visual preview (CSS mockup, not a screenshot)",
    what_h:"What is FoxAI Browser?", what_sub:"FoxAI is a branded, portable build of Firefox ESR — hardened defaults, four built-in WebExtensions, and a PowerShell pipeline that reproduces every release from source. No installer, no background services, one folder you can delete.",
    what1:"The proven Firefox engine, rebranded and locked down: telemetry off, referrer off, first-party isolation on.",
    what2:"An assistant that waits for permission — ChatGPT, Claude, Gemini or local Ollama. No page data leaves until you click Allow.",
    what3:"Your new-tab, your notes, your bookmarks — stored only in the browser. Nothing phones home.",
    why_h:"Why it exists", why_sub:"Browsers collect too much, show you too little, and add features you never asked for. FoxAI is the opposite.",
    why1_t:"💥 It began with a deletion", why1_d:"The original project was wiped. FoxAI was rebuilt from a ~7,000-file salvage backup — and every sneaky default (telemetry, prefetch, referrer) was questioned and, where it leaks, turned off.",
    why2_t:"🔬 Verifiable, not “trust us”", why2_d:"Each release lists the exact leak that was closed and how. Read the changelog, rebuild from source, run the tests. Nothing on faith.",
    why3_t:"🏡 For daily use", why3_d:"Privacy is useless if the browser is painful. Notes, to-do, bookmarks, quick search, AI help, mouse gestures — without the harvest.",
    feat_h:"Everything you need. Nothing that leaks.",
    feat1_d:"Private new-tab: clock, weather (opt-in), notes, to-do, bookmarks, custom backgrounds and 7 themes — only in your browser.",
    feat2_t:"AI Sidebar", feat2_d:"Summarize, translate, explain, rewrite any page. ChatGPT · Claude · Gemini · local Ollama — key never leaves the browser.",
    feat3_t:"Gesture navigation v2", feat3_d:"Right-drag to go back, forward, reload or new tab. Configurable presets via gestures.json.",
    feat4_t:"uBlock Origin built in", feat4_d:"Ads, trackers and fingerprinting blocked out of the box, enforced via policies.json.",
    feat5_t:"Private search", feat5_d:"DuckDuckGo by default, suggestions off. No keystrokes, no referrer, no predictive calls.",
    feat6_t:"Hardened by default", feat6_d:"RFP on, first-party isolation, HTTPS-only, WebRTC off, beacon/ping off, strict CSP everywhere.",
    feat7_t:"Perfect Fingerprint 100/100", feat7_d:"Deterministic fingerprint: letterboxing off, fixed metrics, UTC locked. 100% similarity across instances — canvas per-session randomized by design (CANVAS ENTROPY PASS).",
    feat8_t:"Tor Mode (opt-in)", feat8_d:"Route all traffic via SOCKS5 127.0.0.1:9050 with “FoxAI Tor.cmd” — DNS through SOCKS, WebRTC dead, no leaks. Normal ↔ Tor by profile swap.",
    feat9_t:"Containers Pro", feat9_d:"Container tabs UI for contextual identities — isolate work, personal, shopping.",
    feat10_t:"Media Lockdown", feat10_d:"Autoplay, camera, mic and geolocation default-deny — ask only when you allow.",
    feat11_t:"Download Safety", feat11_d:"Ask-before-new-types for uncommon downloads. No silent execution.",
    feat12_t:"Startup Guard", feat12_d:"Blank startup, no crash-session restore. You decide what reopens.",
    showcase_h:"A browser you can see yourself in", showcase_sub:"FoxAI Start is yours to make: themes, backgrounds, clock and search engine — all local.",
    showcase1:"New-tab with notes, to-do and quick search — stored only locally.",
    showcase2:"Summarize the current page with one consent click.",
    showcase3:"Mouse-only navigation that feels physical, not bolted on.",
    showcase_hint:"Screenshots are placeholders — replace screenshots/*.webp when ready. No stock images.",
    shots_h:"Screenshots", shots_sub:"Add real captures to screenshots/ — the gallery picks them up automatically. Until then, placeholders stay.",
    shot1:"Main browser", shot2:"AI feature", shot3:"Tabs & navigation", shot4:"Settings", shot5:"Tor mode",
    tech_h:"What FoxAI is built on", tech_sub:"No dark magic. A real engine, standard extension APIs, and a reproducible pipeline.",
    tech1_d:"Extended-support Firefox, rebranded “FoxAI Browser” via rcedit + foxai.cfg. Portable: unzip and run.",
    tech2_t:"🧩 Four WebExtensions (MV2)", tech2_d:"New-tab, AI, search & gestures installed via policies.json — sites cannot disable them.",
    tech3_d:"FoxAI Start is a small React app with Vite, shipped as static assets under strict CSP.",
    tech4_t:"🛠️ PowerShell pipeline", tech4_d:"build-manual.ps1 / build.ps1 packages XPIs, fetches uBlock, brands binaries, writes policies and the release zip.",
    tech5_t:"🧪 BiDi test suite", tech5_d:"WebDriver BiDi drives headless FoxAI; checks fingerprint 100/100, CANVAS ENTROPY, new-tab, search and AI.",
    tech6_t:"📦 Portable", tech6_d:"No installer, no services, no registry. One folder you can delete.",
    how_h:"How it was built", how1:"Rebuilt from ~7k-file salvage backup → new-tab, AI, search, gestures, build & tests (v1.0).", how2:"Hardening audits: CSP, first-party isolation, DoH, RFP, partition + clear-on-shutdown.", how3:"FoxAI One (v3.0.0): deterministic fingerprint 100/100 + opt-in Tor mode via SOCKS5 profile.", how4:"Reproducible: build-manual.ps1 → release/FoxAI-Browser-v3.0.0.zip (324 MB).",
    priv_h:"Privacy you can verify", priv_sub:"No claims without code. Read config/user.js and foxai.cfg — every toggle is there.",
    priv1:"No telemetry, no data collection", priv2:"Referrer, beacon & ping disabled", priv3:"First-party isolation on; cookie partitioning + clear on shutdown", priv4:"Prefetch / predictor / DNS prefetch off; DoH via Cloudflare", priv5:"Autofill & form history off; letterboxing off (deterministic sizing)", priv6:"Camera / mic / geo default-deny; autoplay blocked", priv7:"WebRTC disabled — no IP leaks; HTTPS-only on",
    priv8:"Weather opt-in (no location by default); sensors/battery/beacon off", priv9:"Content scripts only inside the browser; strict CSP, no inline, no iframe", priv10:"Punycode shown for spoofing; partitioned storage", priv11:"Tor mode (opt-in): all traffic + DNS via SOCKS5, WebRTC dead", priv12:"Only sites you visit ever contacted; phone-home (studies, captive, region) off", priv13:"Fingerprint: 100/100 similarity + CANVAS ENTROPY PASS (per-session canvas noise)", priv14:"Every fix in CHANGELOG.md — build and check yourself",
    os_h:"Open source", os_sub:"No black box. Every commit public, every build reproducible.", os_btn:"View Source on GitHub", os_hint:"MPL-2.0 (browser) · GPLv3 (uBlock Origin) · issues and PRs welcome.",
    dl_h:"Get FoxAI Browser", dl_sub:"Portable Firefox ESR build. Unzip, run, done — nothing installed to your system.",
    dl_win:"Recommended · Portable zip", dl_btn:"Download v" + VERSION, dl_hint:"~324 MB · Firefox ESR base · unzip & run FoxAI Browser.cmd",
    dl_all:"All releases", dl_src:"View on GitHub", dl_linux:"Build from source", dl_linux_hint:"Use build-linux/ — no prebuilt zip yet.", dl_macos:"Not yet", dl_macos_hint:"Community build planned — source is public.", dl_src2:"View on GitHub",
    step1:"Unzip <code>FoxAI-Browser-v" + VERSION + ".zip</code> anywhere", step2:"Run <code>FoxAI Browser.cmd</code> (normal) or <code>FoxAI Tor.cmd</code> (Tor mode, after <code>scripts/install-tor.ps1</code>)", step3:"Done — FoxAI Start, AI Sidebar, gestures & uBlock ready",
    dl_verify:"Verify: <code>tests/test-fingerprint-benchmark.ps1</code> → 100.0% + CANVAS ENTROPY PASS",
    faq_h:"FAQ",
    faq1_q:"What is FoxAI Browser?", faq1_a:"A portable, hardened Firefox ESR build with FoxAI Start new-tab, AI sidebar, gestures and uBlock Origin preinstalled. One folder, no installer.",
    faq2_q:"Is it open source?", faq2_a:"Yes — source at github.com/Can-5/foxai-browser (MPL-2.0; uBlock GPLv3). Every release is built reproducibly via build-manual.ps1.",
    faq3_q:"What is it built with?", faq3_a:"Firefox ESR engine (Gecko), four WebExtensions (MV2) for new-tab/AI/search/gestures, React+Vite for the new-tab UI, PowerShell build pipeline, WebDriver BiDi tests.",
    faq4_q:"Which platforms are supported?", faq4_a:"Windows portable is primary. Linux: build from source via build-linux/. macOS: not yet prebuilt, source available.",
    faq5_q:"Is it free?", faq5_a:"Yes, free and open source. No premium, no telemetry, no ads of its own.",
    faq6_q:"Where can I download it?", faq6_a:"Latest zip on GitHub Releases (v3.0.0, ~324 MB). Also “Build from source” in the repo.",
    faq7_q:"How can I contribute?", faq7_a:"Open an issue or PR on GitHub. See CHANGELOG.md for style and testing (BiDi suite).",
    faq8_q:"How does the AI work?", faq8_a:"The sidebar supports ChatGPT, Claude, Gemini or local Ollama. Page content is sent only after you click “Allow page access” — one action at a time, revocable, keys stored locally.",
    faq9_q:"Does FoxAI send my data anywhere?", faq9_a:"No. Telemetry, referrer, beacon and studies are off. Only sites you visit are contacted. Check config/user.js — nothing phones home.",
    faq10_q:"How does fingerprint protection work?", faq10_a:"100/100 similarity across instances by locking metrics (UTC, fixed window, letterboxing off). Canvas is per-session randomized by design — CANVAS ENTROPY PASS means trackers can't link sessions.",
    faq11_q:"How do I use Tor mode?", faq11_a:"Run scripts/install-tor.ps1 once, then start with FoxAI Tor.cmd. All traffic + DNS goes via SOCKS5 127.0.0.1:9050, WebRTC dead. Close Tor and start FoxAI Browser.cmd to return to normal.",
    faq12_q:"Is portable really portable?", faq12_a:"Yes — no installer, no services, no registry. One folder you can move to USB or delete. Your profile stays inside the folder.",
    faq13_q:"How do I update?", faq13_a:"Download the new zip from Releases or run FoxAI Update.cmd. Or build from source: build-manual.ps1 → release/FoxAI-Browser-v3.0.0.zip.",
    shot6:"Privacy controls", shot7:"Mouse gestures", shot8:"Themes & backgrounds",
    roadmap_h:"Roadmap", road_done:"Completed", road_progress:"In Progress", road_planned:"Planned",
    road_ip1:"This bilingual site — Cloudflare Pages primary, GitHub Pages backup", road_ip2:"More BiDi coverage for Tor and fingerprint",
    road_p1:"Linux prebuilt & macOS community build", road_p2:"Real screenshots to replace placeholders", road_p3:"Auto-update polish",
    road_t:"The road so far",
    road1:'<span>v1.0.0</span> Rebuilt from salvage backup — new-tab, AI, search, gestures, build & tests.',
    road2:'<span>v1.1.0</span> Gray default theme; AI sender validation; keys out of URLs.',
    road3:'<span>v1.2.0</span> CSP everywhere, weather opt-in, hardened prefs.',
    road6:'<span>v1.4.0</span> Audit pass 2: geo opt-in, WebRTC off, HTTPS-only, tracking tags removed.',
    road7:'<span>v1.5.0</span> LibreWolf-style hardening: letterboxing, partitioning, clear-on-shutdown, WebGL/DRM off.',
    road10:'<span>v1.7.0</span> Launcher + auto-updater: FoxAI Browser.cmd / FoxAI Update.cmd.',
    road11:'<span>v1.8.0</span> Full leak & hardening audit + Hub.',
    road12:'<span>v3.0.0</span> FoxAI One — fingerprint 100/100 + opt-in Tor.',
    cta_h:"Built in public. Yours to keep.", cta_p:"Star it, fork it, break it — every commit is yours to read.", cta_star:"View Source", cta_issue:"Open an issue",
    footer_t:'FoxAI Browser <span id="verFooter">v' + VERSION + '</span> · Firefox ESR base · MPL-2.0 (uBlock Origin: GPLv3)', footer_made:'Made by İlkay Can, in Türkiye · © <span class="year"></span>', footer_privacy:"Privacy"
  },
  tr: {
    nav_features:"Özellikler", nav_showcase:"Vitrin", nav_tech:"Altyapı", nav_why:"Neden", nav_ai:"AI", nav_privacy:"Gizlilik", nav_hub:"Hub", nav_about:"Hakkında", nav_download:"İndir", nav_faq:"SSS", nav_cta:"FoxAI İndir", nav_download_btn:"İndir",
    hero_h1:'Gizli. Akıllı. <span class="grad">Tilki kadar hızlı.</span>',
    hero_lead:"Sana saygı duyan Firefox tabanlı tarayıcı: telemetri yok, sadece izin verdiklerini gören AI kenar çubuğu ve gerçekten sana ait bir yeni sekme. Taşınabilir, açık kaynak, doğrulanabilir.",
    cta_dl:"FoxAI Browser İndir", cta_gh:"GitHub'da Gör", cta_see:"İçindekilere bak",
    hero_hint:"Taşınabilir · Windows · Firefox ESR taban · kurulum yok · ~324 MB",
    mock_caption:"FoxAI Start + AI Kenar Çubuğu — görsel önizleme (CSS mockup, ekran görüntüsü değil)",
    what_h:"FoxAI Browser nedir?", what_sub:"FoxAI, Firefox ESR'nin markalanmış taşınabilir derlemesi — sıkılaştırılmış varsayılanlar, dört dahili WebExtension ve her sürümü kaynaktan yeniden üreten PowerShell hattı. Kurulum yok, tek klasör.",
    what1:"Kanıtlanmış Firefox motoru, kilitlenmiş: telemetri kapalı, referrer kapalı, first-party isolation açık.",
    what2:"İzin bekleyen asistan — ChatGPT, Claude, Gemini veya yerel Ollama. Sayfa verisi sadece İzin Ver'e tıklayınca gider.",
    what3:"Yeni sekmen, notların, yer işaretlerin — sadece tarayıcıda saklanır.",
    why_h:"Neden var", why_sub:"Tarayıcılar çok topluyor, az gösteriyor ve istemediğin özellik ekliyor. FoxAI tersi.",
    why1_t:"💥 Bir silinmeyle başladı", why1_d:"Orijinal proje silindi. FoxAI ~7.000 dosyalık kurtarma yedeğinden yeniden kuruldu — her sızdıran varsayılan sorgulandı ve kapatıldı.",
    why2_t:"🔬 Doğrulanabilir", why2_d:"Her sürüm hangi sızıntının nasıl kapatıldığını listeler. Değişiklik günlüğünü oku, kaynaktan derle, testleri koş.",
    why3_t:"🏡 Günlük kullanım için", why3_d:"Gizlilik acı veriyorsa anlamsız. Notlar, yapılacaklar, yer işaretleri, hızlı arama, AI yardımı, fare jestleri — hasat olmadan.",
    feat_h:"İhtiyacın olan her şey. Sızdıran hiçbir şey yok.",
    feat1_d:"Özel yeni sekme: saat, hava durumu (isteğe bağlı), notlar, yapılacaklar, yer işaretleri, özel arka plan ve 7 tema — sadece tarayıcında.",
    feat2_t:"AI Kenar Çubuğu", feat2_d:"Her sayfayı özetle, çevir, açıkla, yeniden yaz. ChatGPT · Claude · Gemini · yerel Ollama — anahtar tarayıcıdan çıkmaz.",
    feat3_t:"Jest ile gezinme v2", feat3_d:"Geri/ileri/yenile/yeni sekme için sağ-sürükle. gestures.json ile özelleştirilebilir.",
    feat4_t:"Dahili uBlock Origin", feat4_d:"Reklam ve izleyici engelleme kutudan çıkar çıkmaz aktif, policies.json ile zorunlu.",
    feat5_t:"Özel arama", feat5_d:"Varsayılan DuckDuckGo, öneriler kapalı. Tuş vuruşu yok, referrer yok.",
    feat6_t:"Varsayılan sıkılaştırılmış", feat6_d:"RFP açık, first-party isolation, HTTPS-only, WebRTC kapalı, beacon/ping kapalı, her yerde sıkı CSP.",
    feat7_t:"Kusursuz Parmak İzi 100/100", feat7_d:"Deterministik parmak izi: letterboxing kapalı, sabit ölçüler, UTC kilitli. Örnekler arası %100 benzerlik — canvas oturumluk rastgele (CANVAS ENTROPY PASS).",
    feat8_t:"Tor Modu (isteğe bağlı)", feat8_d:"Tüm trafik SOCKS5 127.0.0.1:9050 üzerinden — “FoxAI Tor.cmd” ile DNS SOCKS üzerinden, WebRTC kapalı, sızıntı yok.",
    feat9_t:"Containers Pro", feat9_d:"Bağlamsal kimlikler için container sekme arayüzü — iş, kişisel, alışveriş ayrı.",
    feat10_t:"Medya Kilidi", feat10_d:"Otomatik oynatma, kamera, mikrofon, konum varsayılan reddedilir — izin verene kadar.",
    feat11_t:"İndirme Güvenliği", feat11_d:"Nadir dosya türlerinde indirmeden önce sor. Sessiz çalıştırma yok.",
    feat12_t:"Başlangıç Koruması", feat12_d:"Boş başlangıç, çökme oturumu geri gelmez. Ne açılacağına sen karar ver.",
    showcase_h:"Kendini içinde görebileceğin tarayıcı", showcase_sub:"FoxAI Start senin: temalar, arka planlar, saat ve arama motoru — hepsi yerel.",
    showcase1:"Notlar, yapılacaklar ve hızlı arama içeren yeni sekme — sadece yerel.",
    showcase2:"Tek izin tıklamasıyla mevcut sayfayı özetle.",
    showcase3:"Fiziksel hissettiren, sonradan eklenmiş gibi durmayan fare gezinmesi.",
    showcase_hint:"Ekran görüntüleri yer tutucudur — hazır olunca screenshots/*.webp ile değiştir.",
    shots_h:"Ekran Görüntüleri", shots_sub:"Gerçek görüntüleri screenshots/ klasörüne ekle — galeri otomatik alır.",
    shot1:"Ana tarayıcı", shot2:"AI özelliği", shot3:"Sekmeler ve gezinme", shot4:"Ayarlar", shot5:"Tor modu",
    tech_h:"FoxAI neyle kuruldu", tech_sub:"Sihir yok. Gerçek motor, standart eklenti API'leri ve yeniden üretilebilir hat.",
    tech1_d:"Uzun destekli Firefox, rcedit + foxai.cfg ile “FoxAI Browser” markası. Taşınabilir: aç ve çalıştır.",
    tech2_t:"🧩 Dört WebExtension (MV2)", tech2_d:"Yeni sekme, AI, arama ve jestler policies.json ile kurulu — siteler kapatamaz.",
    tech3_d:"FoxAI Start, Vite ile derlenen küçük bir React uygulaması, sıkı CSP altında statik varlıklar.",
    tech4_t:"🛠️ PowerShell hattı", tech4_d:"build-manual.ps1 / build.ps1 XPI paketler, uBlock çeker, ikilileri markalar, politikaları ve zip'i yazar.",
    tech5_t:"🧪 BiDi test paketi", tech5_d:"WebDriver BiDi headless FoxAI sürer; parmak izi 100/100, CANVAS ENTROPY, yeni sekme, arama ve AI kontrol eder.",
    tech6_t:"📦 Taşınabilir", tech6_d:"Kurulum yok, servis yok, kayıt defteri yok. Silebileceğin tek klasör.",
    how_h:"Nasıl yapıldı", how1:"~7 bin dosyalık kurtarma yedeğinden yeniden: yeni sekme, AI, arama, jestler, derleme ve testler (v1.0).", how2:"Sıkılaştırma denetimleri: CSP, first-party isolation, DoH, RFP, bölümleme + kapanışta temizleme.", how3:"FoxAI One (v3.0.0): deterministik parmak izi 100/100 + SOCKS5 profilli isteğe bağlı Tor.", how4:"Yeniden üretilebilir: build-manual.ps1 → release/FoxAI-Browser-v3.0.0.zip (324 MB).",
    priv_h:"Doğrulayabileceğin gizlilik", priv_sub:"Kod olmadan iddia yok. config/user.js ve foxai.cfg'yi oku — her ayar orada.",
    priv1:"Telemetri yok, veri toplama yok", priv2:"Referrer, beacon ve ping kapalı", priv3:"First-party isolation açık; çerez bölümleme + kapanışta temizleme", priv4:"Ön getirme / tahmin / DNS ön getirme kapalı; DoH Cloudflare", priv5:"Otomatik doldurma ve form geçmişi kapalı; letterboxing kapalı (deterministik boyut)", priv6:"Kamera / mikrofon / konum varsayılan reddedilir; otomatik oynatma engelli", priv7:"WebRTC kapalı — IP sızıntısı yok; HTTPS-only açık",
    priv8:"Hava durumu isteğe bağlı; sensör/pil/beacon kapalı", priv9:"İçerik betikleri sadece tarayıcı içinde; sıkı CSP, inline yok, iframe yok", priv10:"Sahtecilik için punycode göster; bölümlenmiş depolama", priv11:"Tor modu (isteğe bağlı): tüm trafik + DNS SOCKS5, WebRTC kapalı", priv12:"Sadece ziyaret ettiğin sitelerle bağlantı; telefon-aramalar (studies, captive, region) kapalı", priv13:"Parmak izi: %100 benzerlik + CANVAS ENTROPY PASS (oturumluk canvas gürültüsü)", priv14:"Her düzeltme CHANGELOG.md'de — kendin derle ve kontrol et",
    os_h:"Açık kaynak", os_sub:"Kara kutu yok. Her commit herkese açık, her derleme yeniden üretilebilir.", os_btn:"Kaynağı GitHub'da Gör", os_hint:"MPL-2.0 (tarayıcı) · GPLv3 (uBlock Origin) · issue ve PR'lar açık.",
    dl_h:"FoxAI Browser'ı indir", dl_sub:"Taşınabilir Firefox ESR derlemesi. Aç, çalıştır, bitti — sisteme hiçbir şey kurulmaz.",
    dl_win:"Önerilen · Taşınabilir zip", dl_btn:"v" + VERSION + " İndir", dl_hint:"~324 MB · Firefox ESR taban · aç ve FoxAI Browser.cmd çalıştır",
    dl_all:"Tüm sürümler", dl_src:"GitHub'da Gör", dl_linux:"Kaynaktan derle", dl_linux_hint:"build-linux/ kullan — henüz hazır zip yok.", dl_macos:"Henüz yok", dl_macos_hint:"Topluluk derlemesi planlanıyor — kaynak açık.", dl_src2:"GitHub'da Gör",
    step1:"<code>FoxAI-Browser-v" + VERSION + ".zip</code> dosyasını istediğin yere aç", step2:"<code>FoxAI Browser.cmd</code> (normal) veya <code>FoxAI Tor.cmd</code> (Tor modu, önce <code>scripts/install-tor.ps1</code>) çalıştır", step3:"Bitti — FoxAI Start, AI Kenar Çubuğu, jestler ve uBlock hazır",
    dl_verify:"Doğrula: <code>tests/test-fingerprint-benchmark.ps1</code> → %100 + CANVAS ENTROPY PASS",
    faq_h:"SSS",
    faq1_q:"FoxAI Browser nedir?", faq1_a:"FoxAI Start yeni sekmesi, AI kenar çubuğu, jestler ve uBlock Origin ile gelen taşınabilir, sıkılaştırılmış Firefox ESR derlemesi. Tek klasör, kurulum yok.",
    faq2_q:"Açık kaynak mı?", faq2_a:"Evet — kaynak github.com/Can-5/foxai-browser (MPL-2.0; uBlock GPLv3). Her sürüm build-manual.ps1 ile yeniden üretilebilir.",
    faq3_q:"Neyle yapıldı?", faq3_a:"Firefox ESR motoru (Gecko), yeni sekme/AI/arama/jestler için dört WebExtension (MV2), yeni sekme UI için React+Vite, PowerShell derleme hattı, WebDriver BiDi testleri.",
    faq4_q:"Hangi platformlar destekleniyor?", faq4_a:"Windows taşınabilir birincil. Linux: build-linux/ ile kaynaktan derle. macOS: henüz hazır yok, kaynak açık.",
    faq5_q:"Ücretli mi?", faq5_a:"Hayır, ücretsiz ve açık kaynak. Premium yok, telemetri yok, kendi reklamı yok.",
    faq6_q:"Nereden indirebilirim?", faq6_a:"En son zip GitHub Releases'te (v3.0.0, ~324 MB). Ayrıca depoda “Kaynaktan derle”.",
    faq7_q:"Nasıl katkıda bulunurum?", faq7_a:"GitHub'da issue veya PR aç. Tarz ve test için CHANGELOG.md'ye bak (BiDi paketi).",
    faq8_q:"AI nasıl çalışıyor?", faq8_a:"Kenar çubuğu ChatGPT, Claude, Gemini veya yerel Ollama destekler. Sayfa içeriği sadece “Sayfaya erişime izin ver”e tıklayınca gönderilir — tek seferlik, geri alınabilir, anahtarlar yerel saklanır.",
    faq9_q:"FoxAI verilerimi gönderiyor mu?", faq9_a:"Hayır. Telemetri, referrer, beacon ve studies kapalı. Sadece ziyaret ettiğin sitelerle bağlantı kurulur. config/user.js'ye bak — hiçbir şey eve telefon etmez.",
    faq10_q:"Parmak izi koruması nasıl çalışıyor?", faq10_a:"Örnekler arası %100 benzerlik: UTC ve pencere kilitli, letterboxing kapalı. Canvas oturumluk rastgele — CANVAS ENTROPY PASS izleyicilerin oturumları bağlayamaması demek.",
    faq11_q:"Tor modunu nasıl kullanırım?", faq11_a:"Bir kez scripts/install-tor.ps1 çalıştır, sonra FoxAI Tor.cmd ile başlat. Tüm trafik + DNS SOCKS5 127.0.0.1:9050 üzerinden, WebRTC kapalı. Normale dönmek için Tor'u kapatıp FoxAI Browser.cmd'yi çalıştır.",
    faq12_q:"Gerçekten taşınabilir mi?", faq12_a:"Evet — kurulum, servis, kayıt defteri yok. USB'ye taşıyıp silebileceğin tek klasör. Profilin klasörün içinde kalır.",
    faq13_q:"Nasıl güncellerim?", faq13_a:"Yeni zip'i Releases'ten indir veya FoxAI Update.cmd'yi çalıştır. Veya kaynaktan derle: build-manual.ps1 → release/FoxAI-Browser-v3.0.0.zip.",
    shot6:"Gizlilik kontrolleri", shot7:"Fare jestleri", shot8:"Temalar ve arka planlar",
    roadmap_h:"Yol Haritası", road_done:"Tamamlandı", road_progress:"Devam Ediyor", road_planned:"Planlandı",
    road_ip1:"Bu çift dilli site — birincil Cloudflare Pages, yedek GitHub Pages", road_ip2:"Tor ve parmak izi için daha fazla BiDi kapsamı",
    road_p1:"Linux hazır ve macOS topluluk derlemesi", road_p2:"Yer tutucuların yerine gerçek ekran görüntüleri", road_p3:"Otomatik güncelleme cilası",
    road_t:"Bugüne kadar",
    road1:'<span>v1.0.0</span> Kurtarma yedeğinden sıfırdan — yeni sekme, AI, arama, jestler, derleme ve testler.',
    road2:'<span>v1.1.0</span> Gri varsayılan tema; AI gönderen doğrulaması; anahtarlar URL dışına.',
    road3:'<span>v1.2.0</span> Her yerde CSP, hava durumu isteğe bağlı, sıkılaştırılmış ayarlar.',
    road6:'<span>v1.4.0</span> Denetim tur 2: konum isteğe bağlı, WebRTC kapalı, HTTPS-only, iz etiketleri kalktı.',
    road7:'<span>v1.5.0</span> LibreWolf tarzı sıkılaştırma: letterboxing, bölümleme, kapanışta temizleme, WebGL/DRM kapalı.',
    road10:'<span>v1.7.0</span> Başlatıcı + otomatik güncelleyici: FoxAI Browser.cmd / FoxAI Update.cmd.',
    road11:'<span>v1.8.0</span> Tam sızıntı & sıkılaştırma denetimi + Hub.',
    road12:'<span>v3.0.0</span> FoxAI One — parmak izi 100/100 + isteğe bağlı Tor.',
    cta_h:"Herkese açık yapıldı. Senin kalacak.", cta_p:"Yıldızla, çatalla, kurcala — her commit okuman için orada.", cta_star:"Kaynağı Gör", cta_issue:"Issue Aç",
    footer_t:'FoxAI Browser <span id="verFooter">v' + VERSION + '</span> · Firefox ESR taban · MPL-2.0 (uBlock Origin: GPLv3)', footer_made:'İlkay Can tarafından, Türkiye\'de yapıldı · © <span class="year"></span>', footer_privacy:"Gizlilik"
  }
};

let lang="en";
try{const s=localStorage.getItem(LANG_KEY);if(s==="tr"||s==="en")lang=s;else if(navigator.language&&navigator.language.toLowerCase().startsWith("tr"))lang="tr";}catch(e){}

function applyLang(l){
  lang=l;
  document.documentElement.lang=l;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const t=DICT[l][el.dataset.i18n];
    if(typeof t!=="undefined") el.textContent=t;
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el=>{
    const t=DICT[l][el.dataset.i18nHtml];
    if(typeof t!=="undefined") el.innerHTML=t;
  });
  const b=document.getElementById("langBtn");
  if(b) b.textContent=l==="en"?"TR":"EN";
  const dl=document.getElementById("dlBtn");
  if(dl){ dl.href=RELEASE.url; dl.setAttribute("download", RELEASE.file); }
  const heroDl=document.getElementById("heroDl");
  if(heroDl){ heroDl.href="#download"; }
}

document.addEventListener("DOMContentLoaded",()=>{
  applyLang(lang);
  const btn=document.getElementById("langBtn");
  if(btn) btn.addEventListener("click",()=>{
    applyLang(lang==="en"?"tr":"en");
    try{localStorage.setItem(LANG_KEY,lang);}catch(e){}
  });
  const ham=document.getElementById("hamburger");
  const menu=document.getElementById("mobileMenu");
  if(ham&&menu){
    ham.addEventListener("click",()=>{
      const open=menu.hasAttribute("hidden");
      if(open){menu.removeAttribute("hidden");ham.setAttribute("aria-expanded","true");ham.textContent="✕";}
      else{menu.setAttribute("hidden","");ham.setAttribute("aria-expanded","false");ham.textContent="☰";}
    });
    menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{menu.setAttribute("hidden","");ham.setAttribute("aria-expanded","false");ham.textContent="☰";}));
  }
  const chip=document.getElementById("verChip");
  if(chip) chip.textContent="v"+VERSION+" · FoxAI One";
  const dl=document.getElementById("dlBtn");
  if(dl){ dl.href=RELEASE.url; dl.setAttribute("download", RELEASE.file); dl.textContent=(lang==="tr"?"v":"Download v")+VERSION; if(DICT[lang].dl_btn) dl.textContent=DICT[lang].dl_btn; }
  const year=document.querySelector("footer .year");
  if(year) year.textContent=String(new Date().getFullYear());
  // update OG url to current
  const og=document.querySelector('meta[property="og:url"]');
  if(og) og.content=location.href;
});
