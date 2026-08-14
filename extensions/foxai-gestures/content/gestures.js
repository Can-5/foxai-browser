// FoxAI Gestures - content script.
// Right-button drag draws a trail; on release the dominant direction triggers an action.
(() => {
  if (window.__foxaiGestures) return;
  window.__foxaiGestures = true;

  let sx = 0;
  let sy = 0;
  let active = false;
  const THRESHOLD = 60;

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
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);
  document.documentElement.appendChild(canvas);

  window.addEventListener("mousedown", (e) => {
    if (e.button === 2) {
      sx = e.clientX;
      sy = e.clientY;
      active = false;
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,77,109,0.9)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.fillStyle = "#ff4d6d";
    ctx.beginPath();
    ctx.arc(sx, sy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#8b5cf6";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  function finish(x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const wasActive = active;
    active = false;
    const dx = x - sx;
    const dy = y - sy;
    sx = 0;
    sy = 0;
    const len = Math.hypot(dx, dy);
    if (!wasActive || len < THRESHOLD) return;

    let action;
    if (Math.abs(dx) > Math.abs(dy)) {
      action = dx > 0 ? "forward" : "back";
    } else {
      action = dy > 0 ? "newtab" : "reload";
    }
    browser.runtime.sendMessage({ type: "foxai:gesture", action });
  }
})();
