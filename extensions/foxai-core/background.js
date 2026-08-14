// FoxAI Start - background service.
// Container-tab context menu + tab screenshot, plus newtab defaults.

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
