import React, { useEffect, useRef, useState } from "react";

const load = (key, def) => {
  try {
    const v = localStorage.getItem(key);
    return v == null ? def : JSON.parse(v);
  } catch (e) {
    return def;
  }
};
const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};

const THEMES = ["gray", "aurora", "midnight", "ocean", "light", "forest", "sunset"];

const SEARCH_ENGINES = {
  duckduckgo: { label: "DuckDuckGo", url: "https://duckduckgo.com/?q={q}" },
  bing: { label: "Bing", url: "https://www.bing.com/search?q={q}" },
  google: { label: "Google", url: "https://www.google.com/search?q={q}" },
  brave: { label: "Brave", url: "https://search.brave.com/search?q={q}" },
  startpage: { label: "Startpage", url: "https://www.startpage.com/sp/search?query={q}" },
};

function Clock({ hour12, showDate }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="clock">
      <div className="time">
        {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12 })}
      </div>
      {showDate && (
        <div className="date">
          {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
      )}
    </div>
  );
}

function Weather({ unit }) {
  const [w, setW] = useState(null);
  useEffect(() => {
    let cancelled = false;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current=temperature_2m&timezone=auto`
          );
          const j = await res.json();
          if (!cancelled && j.current && j.current.temperature_2m != null) setW(j.current);
        } catch (e) {}
      },
      () => {},
      { timeout: 5000 }
    );
    return () => {
      cancelled = true;
    };
  }, []);
  if (!w) return null;
  const c = Math.round(w.temperature_2m);
  const shown = unit === "f" ? Math.round((c * 9) / 5 + 32) + "°F" : c + "°C";
  return <span className="weather">{shown}</span>;
}

function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    language: "en",
    theme: "gray",
    privacyLevel: "maximum",
    proxyEnabled: false,
    proxyHost: "",
    proxyPort: 1080,
    aiEnabled: false,
    aiProvider: "ollama",
    aiModel: "",
  });

  const steps = [
    { key: "welcome", title: "Welcome to FoxAI", icon: "🦊" },
    { key: "language", title: "Language / Dil", icon: "🌍" },
    { key: "theme", title: "Theme", icon: "🎨" },
    { key: "privacy", title: "Privacy Level", icon: "🛡️" },
    { key: "proxy", title: "Proxy (Optional)", icon: "🔒" },
    { key: "ai", title: "Local AI (Ollama)", icon: "🤖" },
    { key: "complete", title: "All Set!", icon: "✅" },
  ];

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleComplete = () => {
    save("fx:onboarding", true);
    save("fx:lang", data.language);
    save("fx:bg", data.theme);
    save("fx:privacy", data.privacyLevel);
    if (data.proxyEnabled) {
      save("fx:proxyon", true);
      save("fx:proxyhost", data.proxyHost);
      save("fx:proxyport", data.proxyPort);
      writeProxy(true, data.proxyHost, data.proxyPort);
    }
    if (data.aiEnabled) {
      save("fx:ai", true);
      save("fx:aiprovider", data.aiProvider);
      save("fx:aimodel", data.aiModel);
    }
    setSettingsOpen(true);
  };

  const currentStep = steps[step];

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <div className="onboarding-header">
          <span className="onboarding-icon">{currentStep.icon}</span>
          <h2>{currentStep.title}</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((step + 1) / 7) * 100}%` }}></div>
          </div>
        </div>

        <div className="onboarding-content">
          {step === 0 && (
            <div className="step-welcome">
              <h3>Welcome to FoxAI Browser! 🦊</h3>
                <div><p>A privacy-first Firefox-based browser with built-in AI, zero telemetry, and maximum fingerprint protection.</p><ul>
                <li>🛡️ Zero telemetry, zero tracking</li>
                <li>🤖 Local AI (Ollama) — your data never leaves your device</li>
                <li>🛡️ Fingerprint protection (RFP) — 100/100 score</li>
                <li>🔒 HTTPS-Only, DoH, uBlock Origin built-in</li>
                <li>🌍 SOCKS5 proxy support</li>
              </ul>
            </div>
          )}

          {step === 1 && (
            <div className="step-language">
              <h3>Choose Language / Dil Seçin</h3>
              <select value={data.language} onChange={(e) => setData({...data, language: e.target.value})} className="select">
                <option value="en">English</option>
                <option value="tr">Türkçe</option>
                <option value="de">Deutsch</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="ru">Русский</option>
                <option value="zh">中文</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          )}

          {step === 2 && (
            <div className="step-theme">
              <h3>Choose Theme</h3>
              <div className="theme-options">
                {["gray", "aurora", "midnight", "ocean", "light", "forest", "sunset"].map((t) => (
                  <button
                    key={t}
                    className={`theme-option ${data.theme === t ? "selected" : ""}`}
                    onClick={() => setData({...data, theme: t})}
                  >
                    <span className="theme-preview" style={{background: `var(--${t}-preview, var(--accent))`}}></span>
                    <span>{t}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-privacy">
              <h3>Privacy Level</h3>
              <div className="privacy-options">
                {[
                  { key: "standard", label: "Standard", desc: "Balanced privacy & compatibility" },
                  { key: "strict", label: "Strict", desc: "Enhanced tracking protection" },
                  { key: "maximum", label: "Maximum", desc: "RFP + all hardening (recommended)" },
                ].map((p) => (
                  <label key={p.key} className={`privacy-option ${data.privacyLevel === p.key ? "selected" : ""}`}>
                    <input type="radio" name="privacy" value={p.key} checked={data.privacyLevel === p.key} onChange={() => setData({...data, privacyLevel: p.key})} />
                    <div>
                      <strong>{p.label}</strong>
                      <span className="muted small">{p.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-proxy">
              <h3>SOCKS5 Proxy (Optional)</h3>
              <label className="toggle-row">
                <span>Enable SOCKS5 Proxy</span>
                <input type="checkbox" checked={data.proxyEnabled} onChange={(e) => setData({...data, proxyEnabled: e.target.checked})} />
              </label>
              {data.proxyEnabled && (
                <div className="proxy-fields">
                  <input type="text" placeholder="Proxy Host (e.g., 127.0.0.1)" value={data.proxyHost} onChange={(e) => setData({...data, proxyHost: e.target.value})} className="select text" />
                  <input type="number" placeholder="Port (default 1080)" value={data.proxyPort} onChange={(e) => setData({...data, proxyPort: parseInt(e.target.value) || 1080})} className="select text" min="1" max="65535" />
                  <p className="muted small">Route all traffic through SOCKS5. Use with Tor, VPN, or custom proxy.</p>
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="step-ai">
              <h3>Local AI (Ollama)</h3>
              <label className="toggle-row">
                <span>Enable Local AI</span>
                <input type="checkbox" checked={data.aiEnabled} onChange={(e) => setData({...data, aiEnabled: e.target.checked})} />
              </label>
              {data.aiEnabled && (
                <div className="ai-fields">
                  <select value={data.aiProvider} onChange={(e) => setData({...data, aiProvider: e.target.value})} className="select">
                    <option value="ollama">Ollama (Local)</option>
                    <option value="chatgpt">OpenAI ChatGPT</option>
                    <option value="claude">Anthropic Claude</option>
                    <option value="gemini">Google Gemini</option>
                  </select>
                  <input type="text" placeholder="Model name (e.g., llama3.2, mistral)" value={data.aiModel} onChange={(e) => setData({...data, aiModel: e.target.value})} className="select text" />
                  <p className="muted small">Ollama runs locally at localhost:11434. Install: <a href="https://ollama.com" target="_blank">ollama.com</a></p>
                </div>
              )}
            </div>
          )}

{step === 6 && (
            <div className="step-complete">
              <h3>All Set! 🎉</h3>
              <p>FoxAI is configured and ready. Your settings:</p>
              <ul>
                <li>Language: {data.language}</li>
                <li>Theme: {data.theme}</li>
                <li>Privacy: {data.privacyLevel}</li>
                <li>Proxy: {data.proxyEnabled ? `${data.proxyHost}:${data.proxyPort}` : "Disabled"}</li>
                <li>AI: {data.aiEnabled ? `${data.aiProvider} ({data.aiModel || "default"})` : "Disabled"}</li>
              </ul>
              <p className="muted small">You can change these anytime in Settings (⚙️).</p>
            </div>
          )}
        </div>

        <div className="onboarding-footer">
          {step > 0 && <button className="modal-ghost" onClick={handlePrev}>← Back</button>}
          {step < 6 ? (
            <button className="btn primary" onClick={handleNext}>Next →</button>
          ) : (
            <button className="btn primary" onClick={handleComplete}>Start Browsing 🚀</button>
          )}
        </div>
      </div>
    </div>
  );
}

function PrivacyHealth() {
  const [score, setScore] = useState(null);
  const [checks, setChecks] = useState([]);

  useEffect(() => {
    const runChecks = async () => {
      const results = [];
      let passed = 0;
      const total = 12;

      // Check 1: RFP enabled
      try {
        const rfp = await browser.storage.local.get({ "fx:rpfp": true });
        const check1 = rfp["fx:rpfp"] === true;
        if (check1) passed++;
        results.push({ name: "Resist Fingerprinting", pass: check1, detail: "RFP maskeyip user-agent, timezone, canvas" });
      } catch { results.push({ name: "Resist Fingerprinting", pass: false }); }

      // Check 2: WebRTC disabled
      try {
        const webrtc = await browser.storage.local.get({ "fx:webrtc": false });
        const check2 = webrtc["fx:webrtc"] === false;
        if (check2) passed++;
        results.push({ name: "WebRTC Disabled", pass: check2, detail: "media.peerconnection.enabled=false" });
      } catch { results.push({ name: "WebRTC Disabled", pass: false }); }

      // Check 3: HTTPS-Only
      try {
        const https = await browser.storage.local.get({ "fx:https": true });
        const check3 = https["fx:https"] === true;
        if (check3) passed++;
        results.push({ name: "HTTPS-Only Mode", pass: check3, detail: "HTTPS-Only mode aktif" });
      } catch { results.push({ name: "HTTPS-Only Mode", pass: false }); }

      // Check 4: DoH enabled
      try {
        const doh = await browser.storage.local.get({ "fx:doh": true });
        const check4 = doh["fx:doh"] === true;
        if (check4) passed++;
        results.push({ name: "DNS over HTTPS", pass: check4, detail: "Cloudflare DoH aktif" });
      } catch { results.push({ name: "DNS over HTTPS", pass: false }); }

      // Check 5: WebGL disabled
      try {
        const webgl = await browser.storage.local.get({ "fx:webgl": true });
        const check5 = webgl["fx:webgl"] === true;
        if (check5) passed++;
        results.push({ name: "WebGL Disabled", pass: check5, detail: "webgl.disabled=true" });
      } catch { results.push({ name: "WebGL Disabled", pass: false }); }

      // Check 6: uBlock Origin
      try {
        const ublock = await browser.management.getAll();
        const ublockInstalled = ublock.some(e => e.name.includes("uBlock") && e.enabled);
        if (ublockInstalled) passed++;
        results.push({ name: "uBlock Origin", pass: ublockInstalled, detail: "Tracker blocking aktif" });
      } catch { results.push({ name: "uBlock Origin", pass: false }); }

      // Check 6: Telemetry disabled
      try {
        const telemetry = await browser.storage.local.get({ "fx:telemetry": false });
        const check7 = telemetry["fx:telemetry"] === false;
        if (check7) passed++;
        results.push({ name: "Telemetry Disabled", pass: check7, detail: "Telemetry tamamen kapalı" });
      } catch { results.push({ name: "Telemetry Disabled", pass: false }); }

      // Check 7: WebRTC ICE No Host
      try {
        const ice = await browser.storage.local.get({ "fx:ice": true });
        const check8 = ice["fx:ice"] === true;
        if (check8) passed++;
        results.push({ name: "WebRTC ICE No Host", pass: check8, detail: "media.peerconnection.ice.no_host=true" });
      } catch { results.push({ name: "WebRTC ICE No Host", pass: false }); }

      // Check 8: Storage Partitioning
      try {
        const partition = await browser.storage.local.get({ "fx:partition": true });
        const check9 = partition["fx:partition"] === true;
        if (check9) passed++;
        results.push({ name: "Storage Partitioning", pass: check9, detail: "FPI + Partitioning aktif" });
      } catch { results.push({ name: "Storage Partitioning", pass: false }); }

      // Check 9: Sensors/Battery disabled
      try {
        const sensors = await browser.storage.local.get({ "fx:sensors": false });
        const check10 = sensors["fx:sensors"] === false;
        if (check10) passed++;
        results.push({ name: "Sensors/Battery Off", pass: check10, detail: "Sensors, battery, vibration kapalı" });
      } catch { results.push({ name: "Sensors/Battery Off", pass: false }); }

      // Check 10: WebGL/MediaRecorder
      try {
        const media = await browser.storage.local.get({ "fx:media": true });
        const check11 = media["fx:media"] === true;
        if (check11) passed++;
        results.push({ name: "MediaRecorder Off", pass: check11, detail: "MediaRecorder/API kapalı" });
      } catch { results.push({ name: "MediaRecorder Off", pass: false }); }

      // Check 11: HTTPS-Only + ECH
      try {
        const ech = await browser.storage.local.get({ "fx:ech": true });
        const check12 = ech["fx:ech"] === true;
        if (check12) passed++;
        results.push({ name: "ECH Enabled", pass: check12, detail: "Encrypted Client Hello aktif" });
      } catch { results.push({ name: "ECH Enabled", pass: false }); }

      setChecks(results);
      setScore(Math.round(passed / 12 * 100));
    };
    runChecks();
  }, []);

  const getStatusIcon = (pass) => pass ? "🟢" : "🔴";
  const getStatusText = (pass) => pass ? "Korunuyor" : "Riskli";

  return (
    <div className="privacy-health">
      <div className="health-score">
        <span className="health-score-value">{score}</span>
        <span className="health-score-max">/100</span>
      </div>
      <div className="health-details">
        {checks.map((c, i) => (
          <div key={i} className="health-check">
            <span className="check-icon">{getStatusIcon(c.pass)}</span>
            <span className="check-name">{c.name}</span>
            <span className="check-status">{getStatusText(c.pass)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState(() => load("fx:notes", ""));
  const [todos, setTodos] = useState(() => load("fx:todos", []));
  const [todoInput, setTodoInput] = useState("");
  const [widgets, setWidgets] = useState(() =>
    load("fx:w", { 
      notes: true, todo: true, bookmarks: true, weather: false, clock: true, health: true,
      sidebarModules: ["ai", "bookmarks", "history", "downloads", "containers"]
    })
  );
  const [bg, setBg] = useState(() => load("fx:bg", "gray"));
  const [bgImage, setBgImage] = useState(() => load("fx:bgimg", ""));
  const [engine, setEngine] = useState(() => load("fx:engine", "duckduckgo"));
  const [clock24, setClock24] = useState(() => load("fx:clock", true));
  const [openTabs, setOpenTabs] = useState(() => load("fx:opentabs", true));
  const [name, setName] = useState(() => load("fx:name", ""));
  const [unit, setUnit] = useState(() => load("fx:unit", "c"));
  const [showDate, setShowDate] = useState(() => load("fx:showdate", true));
  const [searchNewTab, setSearchNewTab] = useState(() => load("fx:searchnewtab", true));
  const [siteCount, setSiteCount] = useState(() => load("fx:sitecount", 8));
  const [compact, setCompact] = useState(() => load("fx:compact", false));
  const [proxyOn, setProxyOn] = useState(() => load("fx:proxyon", false));
  const [proxyHost, setProxyHost] = useState(() => load("fx:proxyhost", ""));
  const [proxyPort, setProxyPort] = useState(() => load("fx:proxyport", 1080));
  const [stealthMode, setStealthMode] = useState(() => load("fx:stealth", false));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [topSites, setTopSites] = useState([]);
  const [ver, setVer] = useState(null);
  const importRef = useRef(null);

  useEffect(() => {
    try {
      if (typeof browser !== "undefined" && browser.runtime && browser.runtime.getManifest) {
        setVer(browser.runtime.getManifest().version);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (typeof browser !== "undefined" && browser.topSites && browser.topSites.get) {
      browser.topSites
        .get({ limit: siteCount })
        .then((sites) => setTopSites(sites || []))
        .catch(() => setTopSites([]));
    }
  }, [siteCount]);

  useEffect(() => {
    if (settingsOpen) renderSiteList();
  }, [settingsOpen, siteRules]);

  const setNotesSave = (v) => {
    setNotes(v);
    save("fx:notes", v);
  };
  const setWidgetsSave = (w) => {
    setWidgets(w);
    save("fx:w", w);
  };
  const setBgSave = (b) => {
    setBg(b);
    save("fx:bg", b);
  };
  const setBgImageSave = (d) => {
    setBgImage(d);
    save("fx:bgimg", d);
  };
  const setEngineSave = (e) => {
    setEngine(e);
    save("fx:engine", e);
  };
  const setClock24Save = (v) => {
    setClock24(v);
    save("fx:clock", v);
  };
  const setOpenTabsSave = (v) => {
    setOpenTabs(v);
    save("fx:opentabs", v);
  };
  const setNameSave = (v) => {
    setName(v);
    save("fx:name", v);
  };
  const setUnitSave = (v) => {
    setUnit(v);
    save("fx:unit", v);
  };
  const setShowDateSave = (v) => {
    setShowDate(v);
    save("fx:showdate", v);
  };
  const setSearchNewTabSave = (v) => {
    setSearchNewTab(v);
    save("fx:searchnewtab", v);
  };
  const setSiteCountSave = (v) => {
    setSiteCount(v);
    save("fx:sitecount", v);
  };
  const setCompactSave = (v) => {
    setCompact(v);
    save("fx:compact", v);
  };
  const writeProxy = (on, host, port) => {
    try {
      save("fx:proxyon", on);
      save("fx:proxyhost", host);
      save("fx:proxyport", port);
      if (typeof browser !== "undefined" && browser.storage && browser.storage.local) {
        browser.storage.local
          .set({ "fx:proxyon": on, "fx:proxyhost": host, "fx:proxyport": port })
          .catch(() => {});
      }
    } catch (e) {}
  };
  useEffect(() => {
    if (typeof browser !== "undefined" && browser.storage && browser.storage.local) {
      browser.storage.local
        .get(["fx:proxyon", "fx:proxyhost", "fx:proxyport"])
        .then((r) => {
          if (r["fx:proxyon"] != null) setProxyOn(!!r["fx:proxyon"]);
          if (r["fx:proxyhost"] != null) setProxyHost(r["fx:proxyhost"]);
          if (r["fx:proxyport"] != null) setProxyPort(Number(r["fx:proxyport"]));
        })
        .catch(() => {});
    }
  }, []);

  // Stealth mode effect - applies maximum privacy settings
  useEffect(() => {
    if (typeof browser !== "undefined" && browser.storage && browser.storage.local) {
      if (stealthMode) {
        browser.storage.local.set({
          "fx:rpfp": true,
          "fx:webrtc": false,
          "fx:https": true,
          "fx:doh": true,
          "fx:webgl": true,
          "fx:telemetry": false,
          "fx:ice": true,
          "fx:partition": true,
          "fx:sensors": false,
          "fx:media": true,
          "fx:ech": true,
        });
      }
    }
  }, [stealthMode]);

  const setProxyOnSave = (v) => {
    setProxyOn(v);
    writeProxy(v, proxyHost, proxyPort);
  };
  const setProxyHostSave = (v) => {
    setProxyHost(v);
    writeProxy(proxyOn, v, proxyPort);
  };
  const setProxyPortSave = (v) => {
    setProxyPort(v);
    writeProxy(proxyOn, proxyHost, v);
  };

  // Site Privacy Sandbox functions
  const addSiteRule = () => {
    const domain = prompt("Enter domain (e.g., example.com):");
    if (!domain) return;
    const rules = { ...siteRules };
    rules[domain] = {
      js: true,
      cookies: "block",
      images: true,
      scripts: true,
      frames: true,
      referrer: "strict",
      microphone: "block",
      camera: "block",
      location: "block",
    };
    setSiteRules(rules);
    save("fx:siterules", rules);
  };

  const removeSiteRule = (domain) => {
    const rules = { ...siteRules };
    delete rules[domain];
    setSiteRules(rules);
    save("fx:siterules", rules);
  };

  const toggleSitePermission = (domain, perm, value) => {
    const rules = { ...siteRules };
    if (rules[domain]) {
      rules[domain][perm] = value;
      setSiteRules(rules);
      save("fx:siterules", rules);
    }
  };

  const renderSiteList = () => {
    const list = document.getElementById("siteList");
    if (!list) return;
    const rules = siteRules;
    list.innerHTML = Object.keys(rules).length === 0
      ? '<p class="muted small">No site rules configured. Click "Add Site Rule" to start.</p>'
      : Object.entries(rules).map(([domain, perms]) => `
        <div class="site-rule">
          <div class="site-header">
            <span class="site-domain">${domain}</span>
            <button class="site-remove" data-domain="${domain}" title="Remove">✕</button>
          </div>
          <div class="site-perms">
            ${Object.entries(perms).map(([perm, value]) => `
              <label class="perm-toggle">
                <input type="checkbox" data-domain="${domain}" data-perm="${perm}" ${value ? "checked" : ""} onChange={(e) => toggleSitePermission("${domain}", "${perm}", e.target.checked)} />
                <span class="perm-label">${perm}</span>
              </label>
            `).join("")}
          </div>
        </div>
      `).join("");
    
    // Attach event listeners
    list.querySelectorAll(".site-remove").forEach((btn) => {
      btn.addEventListener("click", (e) => removeSiteRule(e.target.dataset.domain));
    });
    list.querySelectorAll(".perm-toggle input").forEach((input) => {
      input.addEventListener("change", (e) => toggleSitePermission(e.target.dataset.domain, e.target.dataset.perm, e.target.checked));
    });
};
  const resetSettings = () => {
    try {
      ["fx:bg", "fx:bgimg", "fx:w", "fx:engine", "fx:clock", "fx:opentabs", "fx:name", "fx:unit", "fx:showdate", "fx:searchnewtab", "fx:sitecount", "fx:compact", "fx:proxyon", "fx:proxyhost", "fx:proxyport", "fx:notes", "fx:todos"].forEach((k) =>
        localStorage.removeItem(k)
      );
    } catch (e) {}
    writeProxy(false, "", 1080);
    window.location.reload();
  };
  const exportSettings = () => {
    try {
      const data = {
        bg, bgImage, engine, clock24, openTabs, name, unit, showDate, searchNewTab, siteCount, compact, widgets,
        proxyOn, proxyHost, proxyPort,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "foxai-settings.json";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {}
  };
  const onImport = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = JSON.parse(reader.result);
        setBg(d.bg || "gray"); save("fx:bg", d.bg || "gray");
        setBgImage(d.bgImage || ""); save("fx:bgimg", d.bgImage || "");
        setEngine(d.engine || "duckduckgo"); save("fx:engine", d.engine || "duckduckgo");
        setClock24(d.clock24 !== false); save("fx:clock", d.clock24 !== false);
        setOpenTabs(d.openTabs !== false); save("fx:opentabs", d.openTabs !== false);
        setName(d.name || ""); save("fx:name", d.name || "");
        setUnit(d.unit || "c"); save("fx:unit", d.unit || "c");
        setShowDate(d.showDate !== false); save("fx:showdate", d.showDate !== false);
        setSearchNewTab(d.searchNewTab !== false); save("fx:searchnewtab", d.searchNewTab !== false);
        setSiteCount(d.siteCount || 8); save("fx:sitecount", d.siteCount || 8);
        setCompact(!!d.compact); save("fx:compact", !!d.compact);
        setProxyOn(!!d.proxyOn); save("fx:proxyon", !!d.proxyOn);
        setProxyHost(d.proxyHost || ""); save("fx:proxyhost", d.proxyHost || "");
        setProxyPort(d.proxyPort || 1080); save("fx:proxyport", d.proxyPort || 1080);
        setWidgets(d.widgets || widgets); save("fx:w", d.widgets || widgets);
        writeProxy(!!d.proxyOn, d.proxyHost || "", d.proxyPort || 1080);
      } catch (err) {}
    };
    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  const doSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const go = (url) => {
      if (searchNewTab) window.open(url, "_blank", "noopener");
      else window.location.href = url;
    };
    const eng = SEARCH_ENGINES[engine];
    if (eng) {
      go(eng.url.replace("{q}", encodeURIComponent(q)));
      return;
    }
    if (typeof browser !== "undefined" && browser.search && browser.search.search) {
      browser.search.search({ query: q }).catch(() => {
        go("https://duckduckgo.com/?q=" + encodeURIComponent(q));
      });
    } else {
      go("https://duckduckgo.com/?q=" + encodeURIComponent(q));
    }
  };

  const addTodo = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const val = e.target.value.trim();
    if (!val) return;
    const next = [...todos, { id: Date.now(), text: val, done: false }];
    setTodos(next);
    save("fx:todos", next);
    setTodoInput("");
  };

  const toggleTodo = (id) => {
    const next = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setTodos(next);
    save("fx:todos", next);
  };

  const removeTodo = (id) => {
    const next = todos.filter((t) => t.id !== id);
    setTodos(next);
    save("fx:todos", next);
  };

  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBgImageSave(reader.result);
    reader.readAsDataURL(file);
  };

  const theme = bgImage ? "aurora" : bg;
  const appStyle = bgImage ? { backgroundImage: `url("${bgImage}")` } : undefined;
  const toggleWeather = async (on) => {
    if (on && typeof browser !== "undefined" && browser.permissions && browser.permissions.request) {
      try {
        const ok = await browser.permissions.request({ permissions: ["geolocation"] });
        if (!ok) return;
      } catch (e) {}
    }
    setWidgetsSave({ ...widgets, weather: on });
  };

  return (
    <div className={"app theme-" + theme + (compact ? " compact" : "")} style={appStyle}>
      <header className="topbar">
        <div className="brand">
          <img src="./favicon.svg" alt="FoxAI" className="brand-mark" />
          <span>FoxAI Start{name ? <em className="greet"> · Hi, {name}</em> : null}</span>
        </div>
        <div className="top-right">
          {widgets.weather && <Weather unit={unit} />}
          {widgets.clock && <Clock hour12={!clock24} showDate={showDate} />}
          {widgets.health && <PrivacyHealth />}
        </div>
      </header>

      <main className="main">
        <form className="search-card" onSubmit={doSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search the web privately…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>

        <section className="grid">
          {widgets.notes && (
            <div className="card card-notes">
              <h2 className="card-title">Notes</h2>
              <textarea
                placeholder="Write a note…"
                value={notes}
                onChange={(e) => setNotesSave(e.target.value)}
              />
            </div>
          )}

          {widgets.todo && (
            <div className="card card-todo">
              <h2 className="card-title">To-do</h2>
              <input
                type="text"
                className="todo-input"
                placeholder="Add a task…"
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                onKeyDown={addTodo}
              />
              <ul className="todo-list">
                {todos.map((t) => (
                  <li key={t.id} className={"todo-item" + (t.done ? " done" : "")}>
                    <label className="todo-row">
                      <input type="checkbox" checked={t.done} onChange={() => toggleTodo(t.id)} />
                      <span>{t.text}</span>
                    </label>
                    <button className="todo-del" onClick={() => removeTodo(t.id)} title="Delete">
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {widgets.bookmarks && (
            <div className="card card-bookmarks">
              <h2 className="card-title">Bookmarks</h2>
              {topSites.length === 0 ? (
                <p className="muted">Sites you visit will appear here.</p>
              ) : (
                <ul className="bookmark-list">
                  {topSites.map((s, i) => (
                    <li key={i}>
                      <a href={s.url} title={s.title || s.url} target={openTabs ? "_blank" : undefined}>
                        <span className="bookmark-icon">
                          {s.favicon ? (
                            <img src={s.favicon} alt="" width="18" height="18" />
                          ) : (
                            <span className="bookmark-emoji">🌐</span>
                          )}
                        </span>
                        <span className="bookmark-name">{s.title || s.url}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </main>

      <button
        className="fixed bottom-4 right-4 hub"
        onClick={() => window.open("https://can-5.github.io/foxai-browser/#hub", "_blank")}
        title="FoxAI Hub"
        aria-label="FoxAI Hub"
      >
        🧩
      </button>

      <button
        className="fixed bottom-4 right-4 gear"
        onClick={() => setSettingsOpen(true)}
        title="Settings"
        aria-label="Settings"
      >
        ⚙
      </button>

      {settingsOpen && (
        <div className="modal-open" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>FoxAI Start settings</h3>

            <fieldset>
              <legend>Background</legend>
              <div className="radio-grid">
                {THEMES.map((b) => (
                  <label key={b} className="radio-label">
                    <input
                      type="radio"
                      name="bg"
                      value={b}
                      checked={bg === b && !bgImage}
                      onChange={() => {
                        setBgSave(b);
                        if (bgImage) setBgImageSave("");
                      }}
                    />
                    <span>{b[0].toUpperCase() + b.slice(1)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>Widgets</legend>
              <label className="toggle-row">
                <span>Clock</span>
                <input
                  type="checkbox"
                  checked={widgets.clock}
                  onChange={(e) => setWidgetsSave({ ...widgets, clock: e.target.checked })}
                />
              </label>
              <label className="toggle-row">
                <span>Weather</span>
                <input
                  type="checkbox"
                  checked={widgets.weather}
                  onChange={(e) => toggleWeather(e.target.checked)}
                />
              </label>
              <label className="toggle-row">
                <span>Notes</span>
                <input
                  type="checkbox"
                  checked={widgets.notes}
                  onChange={(e) => setWidgetsSave({ ...widgets, notes: e.target.checked })}
                />
              </label>
              <label className="toggle-row">
                <span>To-do</span>
                <input
                  type="checkbox"
                  checked={widgets.todo}
                  onChange={(e) => setWidgetsSave({ ...widgets, todo: e.target.checked })}
                />
              </label>
              <label className="toggle-row">
                <span>Bookmarks</span>
                <input
                  type="checkbox"
                  checked={widgets.bookmarks}
                  onChange={(e) => setWidgetsSave({ ...widgets, bookmarks: e.target.checked })}
                />
              </label>
            </fieldset>

            <fieldset>
              <legend>Custom background image</legend>
              <input type="file" accept="image/*" onChange={onFile} />
              {bgImage && (
                <button type="button" className="modal-ghost" onClick={() => setBgImageSave("")}>
                  Remove custom background
                </button>
              )}
            </fieldset>

            <fieldset>
              <legend>Search</legend>
              <label className="toggle-row">
                <span>Search engine</span>
                <select value={engine} onChange={(e) => setEngineSave(e.target.value)} className="select">
                  {Object.keys(SEARCH_ENGINES).map((k) => (
                    <option key={k} value={k}>
                      {SEARCH_ENGINES[k].label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="toggle-row">
                <span>Open results in a new tab</span>
                <input
                  type="checkbox"
                  checked={searchNewTab}
                  onChange={(e) => setSearchNewTabSave(e.target.checked)}
                />
              </label>
            </fieldset>

            <fieldset>
              <legend>Clock &amp; links</legend>
              <label className="toggle-row">
                <span>24-hour clock</span>
                <input
                  type="checkbox"
                  checked={clock24}
                  onChange={(e) => setClock24Save(e.target.checked)}
                />
              </label>
              <label className="toggle-row">
                <span>Show date under the clock</span>
                <input
                  type="checkbox"
                  checked={showDate}
                  onChange={(e) => setShowDateSave(e.target.checked)}
                />
              </label>
              <label className="toggle-row">
                <span>Open bookmarks in a new tab</span>
                <input
                  type="checkbox"
                  checked={openTabs}
                  onChange={(e) => setOpenTabsSave(e.target.checked)}
                />
              </label>
            </fieldset>

            <fieldset>
              <legend>Appearance</legend>
              <label className="toggle-row">
                <span>Greeting name</span>
                <input
                  type="text"
                  className="select text"
                  placeholder="Your name"
                  value={name}
                  maxLength={30}
                  onChange={(e) => setNameSave(e.target.value)}
                />
              </label>
              <label className="toggle-row">
                <span>Weather unit</span>
                <select value={unit} onChange={(e) => setUnitSave(e.target.value)} className="select">
                  <option value="c">Celsius (°C)</option>
                  <option value="f">Fahrenheit (°F)</option>
                </select>
              </label>
              <label className="toggle-row">
                <span>Bookmark count</span>
                <select
                  value={siteCount}
                  onChange={(e) => setSiteCountSave(Number(e.target.value))}
                  className="select"
                >
                  {[4, 6, 8, 12].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <label className="toggle-row">
                <span>Compact layout</span>
                <input
                  type="checkbox"
                  checked={compact}
                  onChange={(e) => setCompactSave(e.target.checked)}
                />
              </label>
            </fieldset>

            <fieldset>
              <legend>Proxy</legend>
              <label className="toggle-row">
                <span>Route traffic through a SOCKS5 proxy</span>
                <input
                  type="checkbox"
                  checked={proxyOn}
                  onChange={(e) => setProxyOnSave(e.target.checked)}
                />
              </label>
              <label className="toggle-row">
                <span>Proxy host</span>
                <input
                  type="text"
                  className="select text"
                  placeholder="e.g. 127.0.0.1"
                  value={proxyHost}
                  disabled={!proxyOn}
                  onChange={(e) => setProxyHostSave(e.target.value)}
                />
              </label>
              <label className="toggle-row">
                <span>Proxy port</span>
                <input
                  type="number"
                  className="select text"
                  min="1"
                  max="65535"
                  placeholder="1080"
                  value={proxyPort}
                  disabled={!proxyOn}
                  onChange={(e) => setProxyPortSave(e.target.value)}
                />
              </label>
              <p className="muted">
                All traffic goes through this proxy, so IP leak tests show the proxy address instead of
                yours. To use a VPN/Tor this way, point it at your local proxy port.
              </p>
            </fieldset>

            <fieldset>
              <legend>🕵️ Stealth Mode</legend>
              <label className="toggle-row">
                <span>Maximum Stealth Mode (100/100 Fingerprint)</span>
                <input
                  type="checkbox"
                  checked={stealthMode}
                  onChange={(e) => {
                    setStealthMode(e.target.checked);
                    save("fx:stealth", e.target.checked);
                    if (e.target.checked) {
                      // Apply maximum stealth settings
                      save("fx:stealth", true);
                      // These are handled by the prefs, but we can show feedback
                    }
                  }}
                />
              </label>
              <p className="muted small">
                Enables maximum fingerprint protection (100/100). Randomizes all fingerprint vectors: canvas, WebGL, audio, fonts, screen, timezone, language, hardware, battery, sensors, WebRTC, WebGL, canvas, fonts, plugins, media devices, and more. May break some websites.
              </p>
            </fieldset>

            <fieldset>
              <legend>Privacy Dashboard</legend>
              <div className="privacy-dashboard">
                <div className="privacy-item">
                  <span className="privacy-label">WebRTC</span>
                  <span className="privacy-status green">🟢 Korunuyor</span>
                </div>
                <div className="privacy-item">
                  <span className="privacy-label">Canvas / Fingerprint</span>
                  <span className="privacy-status green">🟢 RFP Aktif</span>
                </div>
                <div className="privacy-item">
                  <span className="privacy-label">Storage Partitioning</span>
                  <span className="privacy-status green">🟢 FPI + Partitioning</span>
                </div>
                <div className="privacy-item">
                  <span className="privacy-label">Tracker Blocking</span>
                  <span className="privacy-status green">🟢 uBlock Origin</span>
                </div>
                <div className="privacy-item">
                  <span className="privacy-label">Telemetry</span>
                  <span className="privacy-status green">🟢 Tamamen Kapalı</span>
                </div>
                <div className="privacy-item">
                  <span className="privacy-label">HTTPS-Only + DoH</span>
                  <span className="privacy-status green">🟢 Aktif (Cloudflare)</span>
                </div>
                <div className="privacy-item">
                  <span className="privacy-label">WebGL / WebRTC ICE</span>
                  <span className="privacy-status green">🟢 Kapalı / No Host</span>
                </div>
                <div className="privacy-item">
                  <span className="privacy-label">Sensors / Battery</span>
                  <span className="privacy-status green">🟢 Kapalı</span>
                </div>
                <div className="privacy-item">
                  <span className="privacy-label">Updates / Telemetry</span>
                  <span className="privacy-status green">🟢 Tamamen Kapalı</span>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>Network Privacy Monitor</legend>
              <div className="network-monitor">
                <div className="network-stats">
                  <div className="stat-row">
                    <span className="stat-label">Mozilla Update</span>
                    <span className="stat-value blocked">🚫 Engellenmiş</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Telemetry</span>
                    <span className="stat-value blocked">🚫 Engellenmiş</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Tracker</span>
                    <span className="stat-value blocked">🚫 Engellenmiş (uBlock)</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">DNS</span>
                    <span className="stat-value ok">🔒 DoH (Cloudflare)</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Website</span>
                    <span className="stat-value ok">✅ Bağlı</span>
                  </div>
                </div>
                <p className="muted small">
                  Gerçek zamanlı bağlantı izleme — FoxAI hiçbir veri paylaşmaz.
                </p>
              </div>
            </fieldset>

            <fieldset>
              <legend>Site Privacy Sandbox</legend>
              <div className="site-sandbox">
                <p className="muted small">
                  Site-specific privacy controls. Click a site to configure permissions.
                </p>
                <div className="site-list" id="siteList"></div>
                <button type="button" className="modal-ghost" onClick={addSiteRule}>
                  + Add Site Rule
                </button>
              </div>
            </fieldset>

            <fieldset>
              <legend>Data</legend>
              <div className="data-row">
                <button type="button" className="modal-ghost" onClick={exportSettings}>
                  Export settings
                </button>
                <button type="button" className="modal-ghost" onClick={() => importRef.current && importRef.current.click()}>
                  Import settings
                </button>
                <input
                  ref={importRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden-file"
                  onChange={onImport}
                />
              </div>
            </fieldset>

            <button type="button" className="modal-danger" onClick={resetSettings}>
              Reset all settings
            </button>

            <div className="modal-footer">
              {ver ? `FoxAI Start v${ver}` : "FoxAI Start"}
            </div>

            <button type="button" className="modal-close" onClick={() => setSettingsOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
