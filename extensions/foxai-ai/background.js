// FoxAI AI - background.
// Message API used by sidebar/foxai-ai.js:
//   foxai:meta -> { ok, providers }
//   foxai:run -> { ok, text } | { ok:false, error }
// Page content is only read after explicit consent (optional <all_urls>).

const SYSTEM = "You are FoxAI, a privacy-focused assistant built into the FoxAI Browser. Be concise, accurate and helpful.";

const MODES = new Set(["chat", "summarize", "translate", "explain", "rewrite", "ask"]);
const MAX_CHAT = 20;
const MAX_QUESTION = 2000;
const MAX_LANG = 40;

browser.runtime.onMessage.addListener((msg, sender) => {
  if (!msg || typeof msg.type !== "string") return;
  if (msg.type === "foxai:meta") {
    return Promise.resolve({
      ok: true,
      providers: FOXAI_PROVIDERS.map((p) => ({
        id: p.id,
        label: p.label,
        needsKey: p.needsKey,
        defaultModel: p.defaultModel,
        models: p.models,
      })),
    });
  }
  if (msg.type === "foxai:run") {
    if (!isTrustedSender(sender)) {
      return Promise.resolve({ ok: false, error: "Unauthorized sender." });
    }
    return handleRun(msg);
  }
});

// Only accept control messages from our own sidebar page. Any other
// extension (or content script) must not be able to trigger AI calls,
// permission prompts, or page extraction.
function isTrustedSender(sender) {
  return !!(
    sender &&
    typeof sender.url === "string" &&
    sender.url.startsWith("moz-extension://") &&
    /\/sidebar\/foxai-ai\.html(#.*)?$/.test(sender.url)
  );
}

async function handleRun(msg) {
  if (!MODES.has(msg.mode)) return { ok: false, error: "Unknown mode: " + msg.mode };
  const provider = FOXAI_PROVIDERS.find((p) => p.id === msg.provider);
  if (!provider) return { ok: false, error: "Unknown provider: " + msg.provider };
  if (typeof msg.model !== "undefined" && typeof msg.model !== "string") {
    return { ok: false, error: "Bad model." };
  }
  try {
    let data = null;
    if (msg.mode !== "chat") data = await getPageContent(msg);
    const prompt = buildPrompt(msg, data);
    const text = await callProvider(provider, msg, prompt);
    return { ok: true, text };
  } catch (e) {
    return { ok: false, error: e.message || String(e) };
  }
}

async function getPageContent(msg) {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  if (!tab || !tab.id || (tab.url && tab.url.startsWith("about:"))) {
    return { selection: "", text: "", title: "", url: "" };
  }
  let granted = false;
  try {
    granted = await browser.permissions.contains({ permissions: ["<all_urls>"] });
    if (!granted) granted = await browser.permissions.request({ permissions: ["<all_urls>"] });
  } catch (e) {
    granted = false;
  }
  if (!granted) {
    throw new Error("Page access needed. Click Allow page access in the sidebar, then run again.");
  }
  const results = await browser.tabs.executeScript(tab.id, { file: "content/extract.js" });
  const data = (results && results[0]) || {};
  return {
    selection: data.selection || "",
    text: data.text || "",
    title: data.title || "",
    url: data.url || "",
  };
}

function buildPrompt(msg, data) {
  const page = data ? (data.text || "").slice(0, 12000) : "";
  const sel = data ? data.selection || "" : "";
  const ctx = msg.target === "selection" ? sel || page : page;
  const title = data ? data.title || "" : "";
  const url = data ? data.url || "" : "";
  const question = String(msg.question || "").slice(0, MAX_QUESTION);
  const lang = String(msg.targetLang || "").slice(0, MAX_LANG);

  switch (msg.mode) {
    case "summarize":
      return "Summarize this web page into clear, concise bullet points.\n\nPAGE: " + title + "\nURL: " + url + "\n\nCONTENT:\n" + ctx;
    case "translate":
      return "Translate the following text into " + lang + ". Keep all formatting and meaning.\n\n" + ctx;
    case "explain":
      return "Explain the following code step by step, as if teaching a beginner:\n\n" + ctx;
    case "rewrite":
      return "Rewrite the following text so it is clearer and more concise:\n\n" + ctx;
    case "ask":
      return "Answer the question using ONLY the page below as context.\n\nPAGE: " + title + "\nCONTENT:\n" + page + "\n\nQUESTION: " + question;
    case "chat":
    default:
      return null;
  }
}

async function callProvider(p, msg, prompt) {
  const rawMessages = Array.isArray(msg.messages) ? msg.messages.slice(-MAX_CHAT) : [];
  const messages =
    msg.mode === "chat"
      ? rawMessages.map((m) => ({ role: m.role, content: String(m.content).slice(0, 12000) }))
      : [
          { role: "system", content: SYSTEM },
          { role: "user", content: prompt },
        ];
  const model = msg.model || p.defaultModel;

  if (p.id === "chatgpt") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + msg.apiKey },
      body: JSON.stringify({ model, messages, max_tokens: 2048 }),
    });
    if (!res.ok) throw new Error("OpenAI HTTP " + res.status + ": " + (await res.text()).slice(0, 220));
    const j = await res.json();
    if (!j.choices || !j.choices[0]) throw new Error("OpenAI: empty response");
    return j.choices[0].message.content;
  }

  if (p.id === "claude") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": msg.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model, max_tokens: 2048, messages }),
    });
    if (!res.ok) throw new Error("Claude HTTP " + res.status + ": " + (await res.text()).slice(0, 220));
    const j = await res.json();
    if (!j.content) throw new Error("Claude: empty response");
    return j.content.map((c) => c.text || "").join("");
  }

  if (p.id === "gemini") {
    const contents = [
      {
        role: "user",
        parts: [{ text: messages.map((m) => (m.role === "user" ? "User: " : "Assistant: ") + m.content).join("\n") }],
      },
    ];
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" +
        encodeURIComponent(model) +
        ":generateContent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": String(msg.apiKey || "") },
        body: JSON.stringify({ contents }),
      }
    );
    if (!res.ok) throw new Error("Gemini HTTP " + res.status + ": " + (await res.text()).slice(0, 220));
    const j = await res.json();
    if (!j.candidates || !j.candidates[0]) throw new Error("Gemini: empty response");
    return (j.candidates[0].content && j.candidates[0].content.parts || [])
      .map((pt) => pt.text || "")
      .join("");
  }

  if (p.id === "ollama") {
    const res = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages, stream: false }),
    });
    if (!res.ok) throw new Error("Ollama HTTP " + res.status + " - is Ollama running on localhost:11434?");
    const j = await res.json();
    return j.message ? j.message.content : JSON.stringify(j);
  }

  throw new Error("Unsupported provider: " + p.id);
}
