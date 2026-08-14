// FoxAI Gestures - background.
browser.runtime.onMessage.addListener((msg) => {
  if (!msg || msg.type !== "foxai:gesture") return;
  return handleGesture(msg.action);
});

async function handleGesture(action) {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  if (!tab || tab.id == null) return { ok: false };
  try {
    switch (action) {
      case "back":
        await browser.tabs.goBack(tab.id);
        break;
      case "forward":
        await browser.tabs.goForward(tab.id);
        break;
      case "reload":
        await browser.tabs.reload(tab.id);
        break;
      case "newtab":
        await browser.tabs.create({});
        break;
      case "closetab":
        await browser.tabs.remove(tab.id);
        break;
    }
  } catch (e) {
    return { ok: false, error: e.message };
  }
  return { ok: true };
}
