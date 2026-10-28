// FoxAI Gestures - content script.
// Right-button drag draws a trail; on release the dominant direction (or
// multi-segment sequence) triggers an action defined in gestures.json.
(() => {
  if (window.__foxaiGestures) return;
  window.__foxaiGestures = true;

  // Defaults mirror extensions/foxai-gestures/gestures.json
  const DEFAULTS = {
    sensitivity: "medium",
    trailColor: "#5b9dff",
    trailWidth: 3,
    trailOpacity: 0.85,
    rockerGestures: true,
    disableOnInputs: true,
  };
  const THRESHOLDS = { low: 40, medium: 60, high: 90 };
  let settings = Object.assign({}, DEFAULTS);
  let gestures = {
    left: "back", right: "forward", up: "newtab", down: "closetab",
    updown: "reload", rightleft: "reopenClosedTab", downright: "closeOtherTabs",
    leftup: "previousTab", leftright: "nextTab",
  };

  // Load settings/gestures from storage (best-effort, sync-ish).
  try {
    browser.storage.local.get(["foxaiGestures"]).then((st) => {
      if (st && st.foxaiGestures) {
        settings = Object.assign(settings, st.foxaiGestures.settings || {});
        gestures = Object.assign(gestures, st.foxaiGestures.gestures || {});
      }
    }).catch(() => {});
  } catch (e) {}

  let sx = 0, sy = 0;
  let active = false;
  let points = [];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const style = canvas.style;
  style.position = "fixed";
  style.top = "0";
  style.left = "0";
  style.width = "100vw";
  style.height = "100vh";
  style.zIndex = "2147483647";
  style.pointerEvents = "none";
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener("resize", resize);
  document.documentElement.appendChild(canvas);

  function threshold() { return THRESHOLDS[settings.sensitivity] || THRESHOLDS.medium; }

  function isInputTarget(el) {
    if (!settings.disableOnInputs) return false;
    if (!el) return false;
    const tag = (el.tagName || "").toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable;
  }

  window.addEventListener("mousedown", (e) => {
    if (e.button === 2) {
      if (isInputTarget(e.target)) { active = false; return; }
      sx = e.clientX; sy = e.clientY; active = false; points = [[sx, sy]];
    }
    // Rocker gestures: right + left click
    if (settings.rockerGestures && e.button === 0 && e.buttons === 2) {
      browser.runtime.sendMessage({ type: "foxai:gesture", action: "back" });
    }
    if (settings.rockerGestures && e.button === 2 && e.buttons === 1) {
      browser.runtime.sendMessage({ type: "foxai:gesture", action: "forward" });
    }
  });

  window.addEventListener("mousemove", (e) => {
    if (e.buttons === 2) draw(e.clientX, e.clientY);
  });

  window.addEventListener("mouseup", (e) => {
    if (e.button !== 2) return;
    finish(e.clientX, e.clientY);
  });

  window.addEventListener("contextmenu", (e) => {
    if (active) e.preventDefault();
  });

  window.addEventListener("mouseleave", () => {
    finish(window.innerWidth / 2, window.innerHeight / 2);
  });

  function draw(x, y) {
    if (!active) {
      active = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    points.push([x, y]);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = hexToRgba(settings.trailColor, settings.trailOpacity);
    ctx.lineWidth = settings.trailWidth;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.stroke();
    ctx.fillStyle = settings.trailColor;
    ctx.beginPath();
    ctx.arc(sx, sy, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  function finish(x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const wasActive = active;
    active = false;
    const dx = x - sx;
    const dy = y - sy;
    const len = Math.hypot(dx, dy);
    points = [];
    sx = 0; sy = 0;
    if (!wasActive || len < threshold()) return;

    const action = classify(dx, dy);
    if (action) browser.runtime.sendMessage({ type: "foxai:gesture", action });
  }

  function classify(dx, dy) {
    // Multi-segment: if path has a clear corner, build a sequence key.
    // Simple heuristic: dominant overall direction + optional second segment.
    const horizontal = Math.abs(dx) > Math.abs(dy);
    const primary = horizontal ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
    // Check for a corner: compare first half vs second half direction
    let seqKey = primary;
    if (points.length > 6) {
      const mid = Math.floor(points.length / 2);
      const dx1 = points[mid][0] - points[0][0];
      const dy1 = points[mid][1] - points[0][1];
      const dx2 = points[points.length-1][0] - points[mid][0];
      const dy2 = points[points.length-1][1] - points[mid][1];
      const dir1 = Math.abs(dx1) > Math.abs(dy1) ? (dx1 > 0 ? "right" : "left") : (dy1 > 0 ? "down" : "up");
      const dir2 = Math.abs(dx2) > Math.abs(dy2) ? (dx2 > 0 ? "right" : "left") : (dy2 > 0 ? "down" : "up");
      if (dir1 !== dir2) {
        seqKey = dir1 + dir2;
      }
    }
    const key = seqKey.toLowerCase();
    if (gestures[key]) return gestures[key];
    // fallback single direction
    if (gestures[primary]) return gestures[primary];
    return null;
  }

  function hexToRgba(hex, a) {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }
})();
