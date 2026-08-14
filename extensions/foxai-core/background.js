// FoxAI Start - background service.
// Container-tab context menu + tab screenshot, plus SOCKS5 proxy routing.

browser.runtime.onInstalled.addListener(() => {
  try {
    browser.contextMenus.removeAll();
  } catch (e) {}

  browser.contextMenus.create({
    id: "foxai-container-link",
    title: "Open in new Container tab",
    contexts: ["link"],
  });

  browser.contextMenus.create({
    id: "foxai-screenshot",
    title: "FoxAI - capture tab screenshot",
    contexts: ["page"],
  });
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "foxai-container-link" && info.linkUrl) {
    try {
      const identity = await browser.contextualIdentities.create({
        name: "FoxAI " + new Date().toLocaleTimeString(),
        color: "red",
        icon: "circle",
      });
      browser.tabs.create({ url: info.linkUrl, cookieStoreId: identity.cookieStoreId });
    } catch (e) {
      browser.tabs.create({ url: info.linkUrl });
    }
  }

  if (info.menuItemId === "foxai-screenshot" && tab && tab.id != null) {
    try {
      const dataUrl = await browser.tabs.captureTab(tab.id);
      await browser.downloads.download({
        url: dataUrl,
        filename: "foxai-screenshot-" + Date.now() + ".png",
        saveAs: true,
      });
    } catch (e) {
      // ignore: user aborted or tab cannot be captured
    }
  }
});

// --- SOCKS5 / HTTP proxy (optional, off by default) --------------------------

let proxyConfig = null;

const PROXY_KEYS = ["fx:proxyon", "fx:proxyhost", "fx:proxyport", "fx:proxytype"];

async function loadProxy() {
  try {
    const st = await browser.storage.local.get({
      "fx:proxyon": false,
      "fx:proxyhost": "127.0.0.1",
      "fx:proxyport": 1080,
      "fx:proxytype": "socks",
    });
    const on = !!st["fx:proxyon"];
    const host = String(st["fx:proxyhost"] || "").trim();
    const port = parseInt(st["fx:proxyport"], 10);
    const type = st["fx:proxytype"] === "http" ? "http" : "socks";
    proxyConfig =
      on && host && Number.isFinite(port) && port > 0 && port < 65536
        ? { type: type, host: host, port: port, proxyDNS: type === "socks" }
        : null;
  } catch (e) {
    proxyConfig = null;
  }
}

browser.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if (PROXY_KEYS.some((k) => changes[k])) loadProxy();
});

function proxyHandler() {
  if (proxyConfig) return [proxyConfig, null];
  return { type: "direct" };
}

browser.proxy.onRequest.addListener(proxyHandler, { urls: ["<all_urls>"] });

loadProxy();
