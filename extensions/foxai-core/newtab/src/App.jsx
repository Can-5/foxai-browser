import React, { useEffect, useState } from "react";

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

const THEMES = ["gray", "aurora", "midnight", "ocean", "light"];

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="clock">
      <div className="time">{now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
      <div className="date">
        {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </div>
    </div>
  );
}

function Weather() {
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
  return <span className="weather">{Math.round(w.temperature_2m)}°C</span>;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState(() => load("fx:notes", ""));
  const [todos, setTodos] = useState(() => load("fx:todos", []));
  const [todoInput, setTodoInput] = useState("");
  const [widgets, setWidgets] = useState(() => load("fx:w", { notes: true, todo: true, bookmarks: true, weather: false }));
  const [bg, setBg] = useState(() => load("fx:bg", "gray"));
  const [bgImage, setBgImage] = useState(() => load("fx:bgimg", ""));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [topSites, setTopSites] = useState([]);

  useEffect(() => {
    if (typeof browser !== "undefined" && browser.topSites && browser.topSites.get) {
      browser.topSites
        .get({ limit: 8 })
        .then((sites) => setTopSites(sites || []))
        .catch(() => setTopSites([]));
    }
  }, []);

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

  const doSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (typeof browser !== "undefined" && browser.search && browser.search.search) {
      browser.search.search({ query: q }).catch(() => {
        window.location.href = "https://duckduckgo.com/?q=" + encodeURIComponent(q);
      });
    } else {
      window.location.href = "https://duckduckgo.com/?q=" + encodeURIComponent(q);
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

  return (
    <div className={"app theme-" + theme} style={appStyle}>
      <header className="topbar">
        <div className="brand">
          <img src="./favicon.svg" alt="FoxAI" className="brand-mark" />
          <span>FoxAI Start</span>
        </div>
        <div className="top-right">
          {widgets.weather && <Weather />}
          <Clock />
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
                      <a href={s.url} title={s.title || s.url}>
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
                <span>Weather</span>
                <input
                  type="checkbox"
                  checked={widgets.weather}
                  onChange={(e) => setWidgetsSave({ ...widgets, weather: e.target.checked })}
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

            <button type="button" className="modal-close" onClick={() => setSettingsOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
