document.getElementById("f").addEventListener("submit", function (e) {
  e.preventDefault();
  var q = document.getElementById("q").value.trim();
  if (q) window.location.href = "https://duckduckgo.com/?q=" + encodeURIComponent(q) + "&t=foxai";
});
