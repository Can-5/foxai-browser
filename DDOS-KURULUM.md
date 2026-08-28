# FoxAI Browser — DDoS Koruma Kurulumu (browser.foxai.dev)

## Özet
- **Gerçek koruma:** Cloudflare (DNS + Worker) — L3/L7 DDoS, bot, flood Cloudflare'de ölür
- **Tarayıcı katmanı:** `ddos-guard.js` — hızlı reload / fetch flood / headless bot'u tarayıcıda keser
- GitHub Pages tek başına DDoS korumaz, Fastly sadece temel seviye

## 1) DNS — Cloudflare (2 dk)
Cloudflare Dashboard → `foxai.dev` → DNS → Add record
```
Type: CNAME
Name: browser
Target: can-5.github.io
Proxy: Proxied (turuncu bulut) — ZORUNLU
TTL: Auto
```

## 2) GitHub Pages — Custom Domain (1 dk)
GitHub → `Can-5/foxai-browser` → Settings → Pages
- Custom domain: `browser.foxai.dev` → Save
- Enforce HTTPS: ✓
- Repo kökünde `CNAME` dosyası otomatik oluşur (içinde `browser.foxai.dev` olmalı) — bu repoda zaten oluşturuldu

Bekle 2-5 dk, GitHub sertifika versin. Sonra `https://browser.foxai.dev` açılmalı.

## 3) Cloudflare Güvenlik Ayarları (1 dk)
`foxai.dev` → Security → Settings
- Security Level: Medium
- Bot Fight Mode: ON
- Browser Integrity Check: ON
- Challenge Passage: 30 minutes

Security → DDoS → HTTP DDoS Attack Protection: ON (varsayılan)

Security → WAF → Custom rules → Create rule
```
Rule name: foxai-rate-limit
Field: URI Path contains /  (veya Host equals browser.foxai.dev)
Rate: 30 requests / 10 seconds per IP
Action: Managed Challenge
```

## 4) Cloudflare Worker — Gelişmiş Filtre (isteğe bağlı ama önerilir)
`cloudflare-worker.js` dosyasını Worker olarak deploy et:

1. Cloudflare → Workers & Pages → Create Worker → ad: `foxai-guard`
2. `cloudflare-worker.js` içeriğini yapıştır → Deploy
3. Worker → Settings → Triggers → Add Route:
   ```
   Route: browser.foxai.dev/*
   Zone: foxai.dev
   ```
4. Kaydet

Worker ne yapar:
- IP başına 30 req/10s üstü → 3sn challenge
- 50 req/10s üstü → 429 Too Many Requests + 60s ban
- curl/python/go-http gibi otomasyon UA → challenge
- Normal kullanıcı → şeffaf proxy ile `can-5.github.io/foxai-browser`'a iletir, güvenlik header'ları ekler

> Worker olmadan da Cloudflare WAF rate limit yeterli. Worker ekstra esneklik sağlar.

## 5) Site İçi Koruma — ddos-guard.js
- `index.html` zaten `<script src="ddos-guard.js">` ile yüklüyor
- 40 istek / 10s üstü → 90s tarayıcı ban + overlay
- `navigator.webdriver` / HeadlessChrome → eşik 15'e düşer
- `fetch` flood'u da sayılır

Test:
```js
// console'da flood simüle
for(let i=0;i<50;i++) fetch('/')
// → overlay çıkmalı, 90s sonra düzelir
// Temizlemek için: localStorage.removeItem('fx:ddos:ban'); sessionStorage.removeItem('fx:ddos:hits')
```

## 6) Doğrulama
- `https://browser.foxai.dev` → açılıyor mu? (Cloudflare sertifikası)
- `https://can-5.github.io/foxai-browser/` → hala açık ama canonical artık browser.foxai.dev
- Cloudflare → Analytics → Security → bloklanan istekleri gör

## Notlar
- `_headers` dosyası Cloudflare Pages için, GitHub Pages onu yok sayar — sorun değil
- `CNAME` dosyası GitHub Pages için zorunlu, silme
- Gerçek DDoS (UDP flood, SYN flood) Cloudflare'de L3'te durur, senin koduna gelmez
- `ddos-guard.js` gerçek DDoS'u durdurmaz, sadece tarayıcı bot/spam'i keser — asıl iş Cloudflare'de

## Geri Alma
- DNS CNAME'i sil → site tekrar sadece github.io'dan gelir
- Worker route'u sil → WAF kuralları kalır, Worker devre dışı
- `ddos-guard.js` script tag'ini index.html'den kaldır
