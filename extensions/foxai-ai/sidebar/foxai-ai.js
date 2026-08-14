// FoxAI AI - sidebar UI.
// Consent-first flow:
//   setup -> enable -> pick action -> pick target -> consent prompt -> run.
// Plus: free chat (no page data) and "ask about this page".

const $ = (id) => document.getElementById(id);
const els = {
  statusDot: $("statusDot"), statusText: $("statusText"),
  setup: $("setup"), actions: $("actions"),
  provider: $("provider"), model: $("model"), apiKeyWrap: $("apiKeyWrap"),
  apiKey: $("apiKey"), enableBtn: $("enableBtn"),
  runBtn: $("runBtn"), scope: $("scope"), langWrap: $("langWrap"), targetLang: $("targetLang"),
  askWrap: $("askWrap"), askInput: $("askInput"), askBtn: $("askBtn"),
  chatWrap: $("chatWrap"), chatLog: $("chatLog"), chatInput: $("chatInput"),
  chatSend: $("chatSend"), chatClear: $("chatClear"),
  consent: $("consent"), consentText: $("consentText"), consentDetail: $("consentDetail"),
  consentYes: $("consentYes"), consentNo: $("consentNo"), revokeBtn: $("revokeBtn"),
  result: $("result"), resultPanel: $("resultPanel"), privacyNote: $("privacyNote"),
};

let pending = null; // { mode, target, provider }
let cfg = { enabled: false, provider: "chatgpt", model: "", apiKey: "" };
let providers = [];
let chat = []; // [{ role, content }]

const KEYLESS = new Set(["ollama"]);

function saveCfg() {
  browser.storage.local.set({ cfg });
}
async function loadCfg() {
  const st = await browser.storage.local.get({ cfg });
  cfg = Object.assign(cfg, st.cfg || {});
}

async function loadProviders() {
  const res = await browser.runtime.sendMessage({ type: "foxai:meta" });
  if (!res || !res.ok) return;
  providers = res.providers;
  els.provider.innerHTML = "";
  for (const p of providers) {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.label;
    els.provider.appendChild(opt);
  }
  els.provider.value = cfg.provider || "chatgpt";
  fillModels();
}

function currentProvider() {
  return providers.find((p) => p.id === els.provider.value);
}

function fillModels() {
  const p = currentProvider();
  if (!p) return;
  els.model.innerHTML = "";
  for (const m of p.models) {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    els.model.appendChild(opt);
  }
  els.model.value = cfg.model && p.models.includes(cfg.model) ? cfg.model : p.defaultModel;
  els.apiKeyWrap.classList.toggle("hidden", !p.needsKey);
}

function setEnabled(on) {
  cfg.enabled = on;
  saveCfg();
  els.setup.classList.toggle("hidden", on);
  els.actions.classList.toggle("hidden", !on);
  els.statusDot.classList.toggle("on", on);
  els.statusText.textContent = on ? "on" : "off";
  els.statusText.classList.toggle("on", on);
  if (!on) {
    els.result.textContent = "";
    pending = null;
    chat = [];
    renderChat();
  }
}

function consentDetailFor(mode, target) {
  if (mode === "rewrite" || mode === "ask") {
    return "Shares only the page content you chose (selected text or the page). No other data is collected.";
  }
  return target === "selection"
    ? "Shares the selected text + page URL."
    : "Shares the page title, URL, and readable text content.";
}

function requestRun(mode) {
  const target = document.querySelector('input[name="target"]:checked').value;

  if (mode === "rewrite" && target !== "selection") {
    flash("Rewrite works on selected text only.");
    return;
  }

  const what =
    mode === "summarize" ? "summarize the page" :
    mode === "translate" ? "translate the page" :
    mode === "explain" ? "explain the selected code" : "rewrite the selected text";

  els.consentText.textContent = `Let FoxAI ${what} (${target})?`;
  els.consentDetail.textContent = consentDetailFor(mode, target) + " Nothing runs in the background.";
  els.consent.classList.remove("hidden");
  pending = { mode, target, provider: els.provider.value };
}

async function doRun() {
  if (!pending) return;
  els.consent.classList.add("hidden");

  const p = currentProvider();
  if (p.needsKey && !cfg.apiKey.trim()) {
    flash("Add an API key first.");
    return;
  }

  els.result.textContent = "Thinking\u2026";
  const modeLabel =
    pending.mode === "summarize" ? "summarize" :
    pending.mode === "translate" ? "translate into " + els.targetLang.value :
    pending.mode === "explain" ? "explain code" : "rewrite";

  try {
    const res = await browser.runtime.sendMessage({
      type: "foxai:run",
      mode: pending.mode,
      target: pending.target,
      provider: pending.provider,
      apiKey: cfg.apiKey.trim(),
      model: els.model.value,
      targetLang: els.targetLang.value,
    });
    pending = null;
    if (res && res.ok) {
      els.result.textContent = res.text;
    } else {
      els.result.textContent = "Error: " + (res && res.error ? res.error : "unknown");
    }
  } catch (e) {
    els.result.textContent = "Error: " + e.message;
  }
}

async function askAboutPage() {
  const question = els.askInput.value.trim();
  if (!question) {
    flash("Type a question first.");
    return;
  }
  const target = document.querySelector('input[name="target"]:checked').value;
  const p = currentProvider();
  if (p.needsKey && !cfg.apiKey.trim()) {
    flash("Add an API key first.");
    return;
  }

  els.consentText.textContent = `Send this question + ${target} to FoxAI?`;
  els.consentDetail.textContent = "Shares the page title, URL, and readable text so FoxAI can answer accurately. Nothing runs in the background.";
  els.consent.classList.remove("hidden");
  pending = { mode: "ask", target, provider: els.provider.value, question };
}

function addBubble(role, text) {
  const div = document.createElement("div");
  div.className = "bubble " + role;
  div.textContent = text;
  els.chatLog.appendChild(div);
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
}

function renderChat() {
  els.chatLog.innerHTML = "";
  if (chat.length === 0) {
    const empty = document.createElement("div");
    empty.className = "chat-empty";
    empty.textContent = "Chat with FoxAI without sharing your pages.";
    els.chatLog.appendChild(empty);
    return;
  }
  for (const m of chat) addBubble(m.role, m.content);
}

async function sendChat() {
  const text = els.chatInput.value.trim();
  if (!text) return;
  const p = currentProvider();
  if (p.needsKey && !cfg.apiKey.trim()) {
    flash("Add an API key first.");
    return;
  }
  chat.push({ role: "user", content: text });
  els.chatInput.value = "";
  renderChat();
  addBubble("assistant", "Thinking\u2026");

  try {
    const res = await browser.runtime.sendMessage({
      type: "foxai:run",
      mode: "chat",
      provider: els.provider.value,
      apiKey: cfg.apiKey.trim(),
      model: els.model.value,
      messages: chat.slice(0, 20),
    });
    if (res && res.ok) {
      chat[chat.length - 1] = { role: "assistant", content: res.text };
    } else {
      chat[chat.length - 1] = { role: "assistant", content: "Error: " + (res && res.error ? res.error : "unknown") };
    }
    renderChat();
  } catch (e) {
    chat[chat.length - 1] = { role: "assistant", content: "Error: " + e.message };
    renderChat();
  }
}

function flash(msg) {
  els.privacyNote.textContent = msg;
  setTimeout(() => { els.privacyNote.textContent = ""; }, 4000);
}

document.querySelectorAll("[data-mode]").forEach((b) => {
  b.addEventListener("click", () => {
    els.langWrap.classList.toggle("hidden", b.dataset.mode !== "translate");
    els.scope.classList.remove("hidden");
    els.runBtn.classList.remove("hidden");
    els.privacyNote.textContent = "";
    requestRun(b.dataset.mode);
  });
});

els.provider.addEventListener("change", () => {
  cfg.provider = els.provider.value;
  cfg.model = "";
  saveCfg();
  fillModels();
});
els.model.addEventListener("change", () => {
  cfg.model = els.model.value;
  saveCfg();
});

els.enableBtn.addEventListener("click", () => {
  cfg.provider = els.provider.value;
  cfg.model = els.model.value;
  cfg.apiKey = els.apiKey.value.trim();
  saveCfg();
  setEnabled(true);
});

els.consentYes.addEventListener("click", async () => {
  const question = pending && pending.question;
  if (question) {
    els.consent.classList.add("hidden");
    const p = currentProvider();
    els.result.textContent = "Thinking\u2026";
    try {
      const res = await browser.runtime.sendMessage({
        type: "foxai:run",
        mode: "ask",
        target: pending.target,
        provider: pending.provider,
        apiKey: cfg.apiKey.trim(),
        model: els.model.value,
        question,
      });
      pending = null;
      if (res && res.ok) {
        els.result.textContent = res.text;
      } else {
        els.result.textContent = "Error: " + (res && res.error ? res.error : "unknown");
      }
    } catch (e) {
      els.result.textContent = "Error: " + e.message;
    }
    return;
  }
  doRun();
});
els.consentNo.addEventListener("click", () => {
  els.consent.classList.add("hidden");
  pending = null;
});

els.revokeBtn.addEventListener("click", () => {
  cfg.enabled = false;
  browser.permissions.remove({ permissions: ["<all_urls>"] }).catch(() => {});
  saveCfg();
  setEnabled(false);
  els.consent.classList.add("hidden");
  pending = null;
});

els.askBtn.addEventListener("click", askAboutPage);
els.askInput.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); askAboutPage(); } });

els.chatSend.addEventListener("click", sendChat);
els.chatInput.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } });
els.chatClear.addEventListener("click", () => {
  chat = [];
  renderChat();
});

(async () => {
  await loadCfg();
  await loadProviders();
  if (cfg.apiKey) els.apiKey.value = cfg.apiKey;
  await setEnabled(cfg.enabled);
  renderChat();
})();
