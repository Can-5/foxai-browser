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

export default function App() {
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState(() => load("fx:notes", ""));
  const [todos, setTodos] = useState(() => load("fx:todos", []));
  const [todoInput, setTodoInput] = useState("");
  const [widgets, setWidgets] = useState(() =>
    load("fx:w", { notes: true, todo: true, bookmarks: true, weather: false, clock: true })
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
