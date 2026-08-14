// FoxAI Browser landing page — version + year injection.
const VERSION = "1.3.0";

document.addEventListener("DOMContentLoaded", () => {
  const chip = document.getElementById("verChip");
  const footer = document.getElementById("verFooter");
  const dl = document.getElementById("dlBtn");
  if (chip) chip.textContent = "v" + VERSION;
  if (footer) footer.textContent = "v" + VERSION;
  if (dl) {
    dl.textContent = "Download v" + VERSION;
    dl.href = "FoxAI-Browser-v" + VERSION + ".zip";
  }
  const year = document.querySelector("footer p");
  if (year) {
    const copy = document.createElement("span");
    copy.textContent = " · © " + new Date().getFullYear() + " FoxAI";
    year.appendChild(copy);
  }
});
