// FoxAI AI v2 - supported providers (Copilot v2).
// Each provider: { id, label, needsKey, defaultModel, models[], endpoint, streaming }

const FOXAI_PROVIDERS = [
  {
    id: "chatgpt",
    label: "ChatGPT (OpenAI)",
    needsKey: true,
    defaultModel: "gpt-4o-mini",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4.1", "gpt-4.1-mini", "o3-mini", "o3"],
    endpoint: "https://api.openai.com/v1/chat/completions",
    streaming: true,
  },
  {
    id: "claude",
    label: "Claude (Anthropic)",
    needsKey: true,
    defaultModel: "claude-3-5-haiku-latest",
    models: [
      "claude-3-5-haiku-latest",
      "claude-3-5-sonnet-latest",
      "claude-3-7-sonnet-latest",
      "claude-3-opus-latest",
    ],
    endpoint: "https://api.anthropic.com/v1/messages",
    streaming: true,
  },
  {
    id: "gemini",
    label: "Gemini (Google)",
    needsKey: true,
    defaultModel: "gemini-2.0-flash",
    models: ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-pro"],
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/",
    streaming: true,
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    needsKey: true,
    defaultModel: "deepseek-chat",
    models: ["deepseek-chat", "deepseek-reasoner"],
    endpoint: "https://api.deepseek.com/chat/completions",
    streaming: true,
  },
  {
    id: "groq",
    label: "Groq (fast)",
    needsKey: true,
    defaultModel: "llama-3.3-70b-versatile",
    models: [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "mixtral-8x7b-32768",
    ],
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    streaming: true,
  },
  {
    id: "openrouter",
    label: "OpenRouter (100+ models)",
    needsKey: true,
    defaultModel: "openai/gpt-4o-mini",
    models: [
      "openai/gpt-4o-mini",
      "anthropic/claude-3.5-haiku",
      "google/gemini-2.0-flash-exp:free",
      "meta-llama/llama-3.3-70b-instruct:free",
    ],
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    streaming: true,
  },
  {
    id: "mistral",
    label: "Mistral AI",
    needsKey: true,
    defaultModel: "mistral-small-latest",
    models: ["mistral-small-latest", "mistral-medium-latest", "mistral-large-latest"],
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    streaming: true,
  },
  {
    id: "ollama",
    label: "Ollama (local)",
    needsKey: false,
    defaultModel: "llama3.2",
    models: ["llama3.2", "llama3.1", "mistral", "qwen2.5", "phi4", "gemma2"],
    endpoint: "http://localhost:11434/v1/chat/completions",
    streaming: true,
  },
];

// Copilot v2 quick actions shown above the chat input.
const FOXAI_QUICK_ACTIONS = [
  { id: "summarize", label: "📝 Sayfayı özetle" },
  { id: "explain", label: "💡 Açıkla" },
  { id: "translate", label: "🌍 Türkçeye çevir" },
  { id: "code", label: "🧩 Kodu açıkla" },
  { id: "factcheck", label: "✅ Doğrula" },
];

if (typeof module !== "undefined") {
  module.exports = { FOXAI_PROVIDERS, FOXAI_QUICK_ACTIONS };
}