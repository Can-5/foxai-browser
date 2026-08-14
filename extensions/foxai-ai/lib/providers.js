// FoxAI AI - supported providers.
// Each provider: { id, label, needsKey, defaultModel, models[] }

const FOXAI_PROVIDERS = [
  {
    id: "chatgpt",
    label: "ChatGPT (OpenAI)",
    needsKey: true,
    defaultModel: "gpt-4o-mini",
    models: ["gpt-4o-mini", "gpt-4o", "o3-mini"],
  },
  {
    id: "claude",
    label: "Claude (Anthropic)",
    needsKey: true,
    defaultModel: "claude-3-5-haiku-latest",
    models: ["claude-3-5-haiku-latest", "claude-3-5-sonnet-latest", "claude-3-opus-latest"],
  },
  {
    id: "gemini",
    label: "Gemini (Google)",
    needsKey: true,
    defaultModel: "gemini-2.0-flash",
    models: ["gemini-2.0-flash", "gemini-1.5-pro"],
  },
  {
    id: "ollama",
    label: "Ollama (local)",
    needsKey: false,
    defaultModel: "llama3.2",
    models: ["llama3.2", "llama3.1", "mistral", "qwen2.5"],
  },
];
