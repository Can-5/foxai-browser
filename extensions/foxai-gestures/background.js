// FoxAI Gestures - background.
const GESTURE_ACTIONS = new Set(["back", "forward", "reload", "newtab", "closetab"]);

browser.runtime.onMessage.addListener((msg, sender) => {
  if (!msg || msg.type !== "foxai:gesture") return;
  if (!isTrustedSender(sender)) return { ok: false };
  return handleGesture(msg.action);
});

// Only accept gestures from our own content script (sender.id is the
// extension id for same-extension content scripts). Other extensions
// must not be able to navigate or close the user's active tab.
function isTrustedSender(sender) {
  return !!(sender && sender.id === browser.runtime.id);
}

async function handleGesture(action) {
  if (!GESTURE_ACTIONS.has(action)) return { ok: false };
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
