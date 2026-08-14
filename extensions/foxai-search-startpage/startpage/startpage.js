document.getElementById("f").addEventListener("submit", function (e) {
  e.preventDefault();
  var q = document.getElementById("q").value.trim();
  if (q) window.location.href = "https://duckduckgo.com/?q=" + encodeURIComponent(q) + "&t=foxai";
});

var _m = (typeof browser !== "undefined" && browser.runtime && browser.runtime.getManifest)
  ? browser.runtime.getManifest() : null;
if (_m) {
  var _v = document.getElementById("ver");
  if (_v) _v.textContent = "FoxAI Search v" + _m.version;
}
