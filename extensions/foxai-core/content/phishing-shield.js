// FoxAI Phishing Shield - heuristic URL/ DOM checks with warning overlay.
(() => {
  const SUSPICIOUS_TLDS = [".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".work", ".click"];
  const BRANDS = ["paypal", "apple", "microsoft", "google", "facebook", "amazon", "netflix", "bank", "login", "secure", "verify", "account", "update", "signin"];
  const IP_RE = /^https?:\/\/\d{1,3}(\.\d{1,3}){3}/;

  function score(url) {
    let s = 0;
    const u = url.toLowerCase();
    try {
      const parsed = new URL(url);
      const host = parsed.hostname;
      if (IP_RE.test(url)) s += 3;
      if (host.split(".").length > 4) s += 2;
      if (SUSPICIOUS_TLDS.some((t) => host.endsWith(t))) s += 2;
      if (u.includes("@")) s += 3;
      if (parsed.protocol !== "https:") s += 1;
      // brand impersonation in subdomain
      const labels = host.split(".");
      if (labels.length >= 3 && BRANDS.some((b) => labels.slice(0, -2).join(".").includes(b))) s += 3;
      // excessive length
      if (url.length > 120) s += 1;
      // punycode
      if (host.includes("xn--")) s += 2;
    } catch (e) {}
    return s;
  }

  function warn() {
    if (document.getElementById("foxai-phish-warn")) return;
    const div = document.createElement("div");
    div.id = "foxai-phish-warn";
    div.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#dc2626;color:#fff;padding:12px 16px;font-family:sans-serif;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,.4);";
    div.innerHTML = "⚠️ FoxAI Phishing Shield: This page looks suspicious. Do not enter credentials. " +
      '<button id="foxai-phish-dismiss" style="margin-left:12px;background:#fff;color:#dc2626;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;">Dismiss</button>';
    document.documentElement.appendChild(div);
    const btn = document.getElementById("foxai-phish-dismiss");
    if (btn) btn.addEventListener("click", () => div.remove());
  }

  function check() {
    try {
      const s = score(location.href);
      if (s >= 5) warn();
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", check);
  } else {
    check();
  }
})();
