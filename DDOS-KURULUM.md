# FoxAI Browser — DDoS Koruma Kurulumu (browser.foxai.dev)

## Özet
- **Gerçek koruma:** Cloudflare (DNS + Worker) — L3/L7 DDoS, bot, flood Cloudflare'de ölür
- **Tarayıcı katmanı:** `ddos-guard.js` — hızlı reload / fetch flood / headless bot'u tarayıcıda keser
- GitHub Pages tek başına DDoS korumaz, Fastly sadece temel seviye

## ✅ Yapılan İşlemler (Otomatik)

### CNAME — TAMAMLANDI ✓
```
Type: CNAME | Name: browser | Target: can-5.github.io | Proxied: turuncu bulut
Record ID: 49dc5c73fd1a7ac3e6c344b2854c181e
```

### Worker Deploy — TAMAMLANDI ✓
- Script: `foxai-ddos-guard` → `foxai-ddos-guard.kygszilkaycan.workers.dev`
- Version: `9a02ba3e-e7af-4aaf-8ef3-97643badab15`
- Route: `browser.foxai.dev/*` → `foxai-ddos-guard` (route_id: `037c3bdc752c4877ac66c4905b967292`)

### ddos-guard.js — TAMAMLANDI ✓
- `index.html`'e `<script src="ddos-guard.js">` eklendi
- 40 istek/10s → 90s ban, headless bot tespiti, fetch flood sayacı

---

## 🔴 SIRADA — Yapman Gerekenler

### 1) NS Değişimi — Cloudflare Aktifleştir (EN ÖNEMLİ)
Zone foxai.dev **pending** — Cloudflare'de aktif olabilmesi için nameserver'ları değiştirmen lazım.

**Domainini nereden aldıysan oraya git** (Tucows/Vercel/Namecool/etc.):

| Mevcut (Vercel) | Yeni (Cloudflare) |
|---|---|
| `ns1.vercel-dns.com` | `davina.ns.cloudflare.com` |
| `ns2.vercel-dns.com` | `greg.ns.cloudflare.com` |

> Adımlar: Registrar dashboard → Domain Management → NS Records → Mevcut kayıtları sil → Yukarıdaki 2 Cloudflare NS'yi ekle → Kaydet

NS propagasyonu 1-24 saat sürebilir. propagationtools.org ile kontrol edebilirsin.

### 2) GitHub Pages Custom Domain
GitHub → `Can-5/foxai-browser` → Settings → Pages
- Custom domain: `browser.foxai.dev` → Save
- Enforce HTTPS: ✓
- `CNAME` dosyası repoda zaten var (browser.foxai.dev)
- 2-5 dk bekle, GitHub sertifika versin

### 3) WAF Kuralı — Zone Active Olunca
Zone aktif olduktan sonra Cloudflare Dashboard'dan ekle:
1. foxai.dev → Security → WAF → Custom rules → Create rule
2. Kural adı: `DDoS Guard - browser.foxai.dev`
3. Expression: `(http.host eq "browser.foxai.dev")`
4. Action: Managed Challenge
5. Kaydet

**VEYA** Token ile API:
```bash
# Zone active olduktan sonra bu çalışmaz:
curl -X POST "https://api.cloudflare.com/client/v4/zones/abf3adcf5ba11e644617b5c6462d3fbf/rulesets" \
  -H "Authorization: Bearer cfut_cnRwp...357a8c4c" \
  -H "Content-Type: application/json" \
  -d '{"name":"DDoS Guard","kind":"zone","phase":"http_request_firewall_custom","rules":[{"expression":"(http.host eq \"browser.foxai.dev\")","action":"managed_challenge","enabled":true}]}'
```

### 4) Cloudflare Security Ayarları
foxai.dev → Security → Settings:
- Security Level: Medium
- Bot Fight Mode: ON
- Browser Integrity Check: ON
- Challenge Passage: 30 minutes

---

## Doğrulama
- `https://browser.foxai.dev` → açılıyor mu? (Cloudflare sertifikası)
- `https://can-5.github.io/foxai-browser/` → hala açık ama canonical artık browser.foxai.dev
- Cloudflare → Analytics → Security → bloklanan istekleri gör

## Notlar
- `_headers` dosyası Cloudflare Pages için, GitHub Pages onu yok sayar — sorun değil
- `CNAME` dosyası GitHub Pages için zorunlu, silme
- Gerçek DDoS (UDP flood, SYN flood) Cloudflare'de L3'te durur, senin koduna gelmez
- `ddos-guard.js` gerçek DDoS'u durdurmaz, sadece tarayıcı bot/spam'i keser — asıl iş Cloudflare'de
- Zone pending olduğu için WAF API ile eklenemiyor, dashboard'dan ekle veya NS değişimi bekle

## Geri Alma
- DNS CNAME'i sil → site tekrar sadece github.io'dan gelir
- Worker route'u sil → WAF kuralları kalır, Worker devre dışı
- `ddos-guard.js` script tag'ini index.html'den kaldır
