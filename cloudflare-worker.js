// FoxAI Browser - Cloudflare Worker DDoS Guard
// Deploy: Cloudflare Dashboard -> foxai.dev -> Workers & Pages -> Create Worker -> Paste -> Deploy
// Route: browser.foxai.dev/*  (veya foxai-browser icin custom domain)
// Gercek DDoS korumasi bu katmanda olur. ddos-guard.js sadece tarayici icidir.

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'unknown';
    const ua = request.headers.get('User-Agent') || '';
    const country = request.cf?.country || 'XX';

    // 1) Aninda bloklanacaklar
    if (ua.length < 10 || /curl|wget|python-requests|go-http|masscan|sqlmap/i.test(ua)) {
      // Bos veya kutuphane UA -> challenge ver, direkt blok degil (false positive onlemi)
      if (isFlood(ip, 1)) return challengeResponse('Otomasyon tespit edildi — lütfen doğrulayın', 403);
    }

    // 2) Rate limit: 30 istek / 10 saniye / IP
    const hits = hitCount(ip);
    if (hits > 30) {
      // 30-50 arasi yavaslat, 50+ ban
      if (hits > 50) {
        return new Response('Too Many Requests — FoxAI Guard', {
          status: 429,
          headers: {
            'Retry-After': '60',
            'Cache-Control': 'no-store',
            'Content-Type': 'text/plain; charset=utf-8',
            'X-FoxAI-Guard': 'rate-ban',
          },
        });
      }
      return challengeResponse(`Çok fazla istek (${hits}/10s) — doğrulama gerekli`, 429);
    }

    // 3) Ulke/bot filtresi (istege bagli - TR/EN disini yavaslat istersen ac)
    // if (!['TR','US','DE','GB','NL','FR'].includes(country) && hits > 15) {
    //   return challengeResponse('Bölgesel hız limiti', 429);
    // }

    // 4) browser.foxai.dev -> foxai.dev redirect (301)
    if (url.hostname === 'browser.foxai.dev') {
      const target = new URL(request.url);
      target.hostname = 'foxai.dev';
      return Response.redirect(target.toString(), 301);
    }

    // 5) foxai.dev -> GitHub Pages origin
    const originUrl = new URL(request.url);
    originUrl.hostname = 'can-5.github.io';
    const newHeaders = new Headers(request.headers);
    newHeaders.set('Host', 'can-5.github.io');
    newHeaders.set('X-Forwarded-Host', 'foxai.dev');
    newHeaders.set('X-FoxAI-Guard', 'pass');
    newHeaders.set('X-Real-IP', ip);

    const originReq = new Request(originUrl.toString(), {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      redirect: 'manual',
    });
    let res = await fetch(originReq);
    res = new Response(res.body, res);
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('Referrer-Policy', 'no-referrer');
    res.headers.set('X-FoxAI-Guard', 'pass:' + hits);
    res.headers.set('Cache-Control', res.headers.get('Cache-Control') || 'public, max-age=3600');
    return res;
  },
};

// --- In-memory rate store (per-isolate, ~30s yasam) ---
// Ucretsiz plan icin yeterli. Daha kalici icin KV veya Rate Limiting Rules kullan.
const store = new Map(); // ip -> { hits: number[], last: timestamp }
const WINDOW_MS = 10_000;

function hitCount(ip) {
  const now = Date.now();
  let rec = store.get(ip);
  if (!rec) { rec = { hits: [] }; store.set(ip, rec); }
  rec.hits = rec.hits.filter(t => now - t < WINDOW_MS);
  rec.hits.push(now);
  // bellek sisirme onlemi: 1000 IP ustu en eskileri sil
  if (store.size > 2000) {
    const first = store.keys().next().value;
    store.delete(first);
  }
  return rec.hits.length;
}
function isFlood(ip, threshold) { return hitCount(ip) > threshold; }

function challengeResponse(msg, status = 403) {
  const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FoxAI Guard — Doğrulama</title>
<style>
  *{box-sizing:border-box}body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0f0f12;color:#fff;font-family:Inter,system-ui,sans-serif;padding:24px}
  .card{max-width:520px;width:100%;background:#1c1b22;border:1px solid #2a2a33;border-radius:16px;padding:28px;box-shadow:0 16px 48px rgba(0,0,0,.5);text-align:center}
  h1{margin:0 0 8px;font-size:20px} p{margin:0 0 16px;opacity:.8;line-height:1.5;font-size:14px}
  .bar{height:4px;background:#2a2a33;border-radius:999px;overflow:hidden;margin:16px 0}
  .fill{height:100%;width:0;background:linear-gradient(90deg,#ff6b35,#ff9a54);animation:load 3s ease forwards}
  @keyframes load{to{width:100%}}
  a{color:#ff9a54}
</style>
<div class="card">
  <div style="font-size:36px">🛡️</div>
  <h1>FoxAI Browser — Güvenlik Kontrolü</h1>
  <p>${msg}</p>
  <div class="bar"><div class="fill"></div></div>
  <p style="font-size:12px;opacity:.6">Bu kontrol DDoS ve botlara karşıdır. 3 saniye sonra otomatik devam edeceksiniz.<br>Takılı kalırsan <a href="javascript:location.reload()">yenile</a>.</p>
</div>
<script>setTimeout(()=>location.reload(), 3000)<\/script>`;
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Retry-After': '10',
      'X-FoxAI-Guard': 'challenge',
    },
  });
}
