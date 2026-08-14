// FoxAI AI - on-demand content extraction.
// Runs via browser.tabs.executeScript after user consent.
(() => {
  const selection = window.getSelection ? (window.getSelection().toString() || "") : "";
  const text = (document.body && document.body.innerText ? document.body.innerText : "").trim().slice(0, 12000);
  return {
    selection: selection.trim().slice(0, 6000),
    text,
    title: document.title || "",
    url: location.href || "",
  };
})();
