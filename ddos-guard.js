// FoxAI Browser - ddos-guard.js | Hafif istemci tarafi flood/bot filtresi
// NOT: Gercek L3/L4/L7 DDoS Cloudflare'de durdurulur. Bu dosya sadece
// tarayici botlarini, spam reload'lari ve kotu niyetli hizli istekleri keser.
// Cloudflare Worker (cloudflare-worker.js) ile birlikte kullanin.
(function () {
  'use strict';

  const CFG = {
    MAX_HITS: 40,              // 10 saniyede max istek
    WINDOW_MS: 10_000,
    BAN_MS: 90_000,            // ban suresi (1.5 dk)
    STORAGE_BAN: 'fx:ddos:ban',
    STORAGE_HITS: 'fx:ddos:hits',
    CHALLENGE_REQUIRED: false, // true yaparsan fare hareketi bekler
  };

  // Zaten banli mi?
  function isBanned() {
    try {
      const raw = localStorage.getItem(CFG.STORAGE_BAN);
      if (!raw) return false;
      const until = parseInt(raw, 10);
      if (Date.now() < until) return until;
      localStorage.removeItem(CFG.STORAGE_BAN);
      return false;
    } catch { return false; }
  }

  function ban() {
    try { localStorage.setItem(CFG.STORAGE_BAN, String(Date.now() + CFG.BAN_MS)); } catch {}
    showOverlay(Date.now() + CFG.BAN_MS);
  }

  function showOverlay(until) {
    if (document.getElementById('fx-ddos-overlay')) return;
    const el = document.createElement('div');
    el.id = 'fx-ddos-overlay';
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'assertive');
    el.style.cssText = 'position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:rgba(28,27,34,.92);backdrop-filter:blur(8px);color:#fff;font-family:Inter,system-ui,sans-serif;padding:24px;text-align:center';
    el.innerHTML = '<div style="max-width:480px;background:#1c1b22;border:1px solid #333;border-radius:16px;padding:28px 24px;box-shadow:0 16px 48px rgba(0,0,0,.4)">' +
      '<div style="font-size:32px;margin-bottom:12px">🛡️</div>' +
      '<h2 style="margin:0 0 8px;font-size:18px;font-weight:700">Çok hızlı istek algılandı</h2>' +
      '<p style="margin:0 0 14px;opacity:.8;font-size:14px;line-height:1.5">Güvenlik için kısa bir bekleme uyguladık. Sayfa <span id="fx-ddos-timer">--</span> sonra otomatik açılacak.</p>' +
      '<p style="margin:0;opacity:.6;font-size:12px">FoxAI Browser • DDoS Guard • IP geçici olarak yavaşlatıldı</p></div>';
    document.documentElement.appendChild(el);
    const timer = el.querySelector('#fx-ddos-timer');
    const iv = setInterval(() => {
      const left = Math.max(0, until - Date.now());
      const s = Math.ceil(left / 1000);
      if (timer) timer.textContent = s + 's';
      if (left <= 0) { clearInterval(iv); el.remove(); try{localStorage.removeItem(CFG.STORAGE_BAN);}catch{} location.reload(); }
    }, 250);
  }

  // Bot sinyalleri (hafif, false-positive dusuk)
  function isSuspiciousBot() {
    try {
      if (navigator.webdriver) return true;
      // headless chrome izleri
      if (!navigator.plugins || navigator.plugins.length === 0) {
        // gercek mobilde de 0 olabiliyor, sadece webdriver ile beraber supheli
        if (navigator.webdriver) return true;
      }
      // cok hizli otomasyon: chrome headless UA
      const ua = navigator.userAgent || '';
      if (/HeadlessChrome|PhantomJS|puppet/i.test(ua)) return true;
      if (ua.length < 20) return true; // bos/ garip UA
    } catch {}
    return false;
  }

  // Hit sayaci - sessionStorage + localStorage birlikte
  function recordHit() {
    const now = Date.now();
    let hits = [];
    try {
      const raw = sessionStorage.getItem(CFG.STORAGE_HITS);
      if (raw) hits = JSON.parse(raw);
    } catch { hits = []; }
    // pencere disindakileri temizle
    hits = hits.filter(t => now - t < CFG.WINDOW_MS);
    hits.push(now);
    try { sessionStorage.setItem(CFG.STORAGE_HITS, JSON.stringify(hits)); } catch {}
    return hits.length;
  }

  // Ana kontrol
  const bannedUntil = isBanned();
  if (bannedUntil) {
    // DOM hazir degilse bekle
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => showOverlay(bannedUntil));
    } else {
      showOverlay(bannedUntil);
    }
    // fetch/XHR'yi de kilitle
    window.fetch = function(){ return Promise.reject(new Error('Rate limited - FoxAI DDoS Guard')); };
    return;
  }

  // Supheli bot -> yavaslat (hemen ban degil, izle)
  if (isSuspiciousBot()) {
    // sadece sayaci 2x hassas yap
    CFG.MAX_HITS = 15;
  }

  const hits = recordHit();
  if (hits > CFG.MAX_HITS) {
    ban();
    // sonraki istekleri kes
    try { window.stop(); } catch {}
    return;
  }

  // Ileride fetch flood olursa da say
  const origFetch = window.fetch;
  let fetchCount = 0;
  let fetchWindowStart = Date.now();
  window.fetch = function(...args) {
    const now = Date.now();
    if (now - fetchWindowStart > CFG.WINDOW_MS) { fetchCount = 0; fetchWindowStart = now; }
    fetchCount++;
    if (fetchCount > CFG.MAX_HITS) {
      ban();
      return Promise.reject(new Error('Fetch flood blocked'));
    }
    return origFetch.apply(this, args);
  };

  // Bilgi icin console (sessiz)
  // console.debug('[FoxAI DDoS Guard] active, hits:', hits);
})();
