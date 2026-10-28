// FoxAI Gestures - background.
const GESTURE_ACTIONS = new Set([
  "back", "forward", "reload", "newtab", "closetab",
  "reopenClosedTab", "closeOtherTabs", "previousTab", "nextTab",
]);

// Track recently closed tabs for reopenClosedTab (best-effort, in-memory).
const closedStack = [];

browser.tabs.onRemoved.addListener((tabId, info) => {
  // store minimal info; reopen uses sessions API if available
  closedStack.push({ tabId, windowId: info.windowId });
  if (closedStack.length > 25) closedStack.shift();
});

browser.runtime.onMessage.addListener((msg, sender) => {
  if (!msg || msg.type !== "foxai:gesture") return;
  if (!isTrustedSender(sender)) return { ok: false };
  return handleGesture(msg.action);
});

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
      case "reopenClosedTab":
        if (browser.sessions && browser.sessions.restore) {
          await browser.sessions.restore();
        } else {
          // fallback: open a new tab
          await browser.tabs.create({});
        }
        break;
      case "closeOtherTabs": {
        const all = await browser.tabs.query({ currentWindow: true });
        const toClose = all.filter((t) => t.id !== tab.id).map((t) => t.id);
        if (toClose.length) await browser.tabs.remove(toClose);
        break;
      }
      case "previousTab": {
        const all = await browser.tabs.query({ currentWindow: true });
        const idx = all.findIndex((t) => t.id === tab.id);
        const prev = all[(idx - 1 + all.length) % all.length];
        if (prev && prev.id !== tab.id) await browser.tabs.update(prev.id, { active: true });
        break;
      }
      case "nextTab": {
        const all = await browser.tabs.query({ currentWindow: true });
        const idx = all.findIndex((t) => t.id === tab.id);
        const next = all[(idx + 1) % all.length];
        if (next && next.id !== tab.id) await browser.tabs.update(next.id, { active: true });
        break;
      }
    }
  } catch (e) {
    return { ok: false, error: e.message };
  }
  return { ok: true };
}
