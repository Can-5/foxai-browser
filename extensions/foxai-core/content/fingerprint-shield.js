// FoxAI Fingerprint Shield - spoof high-entropy navigator/screen/timezone values.
(() => {
  const spoof = (obj, prop, value) => {
    try {
      Object.defineProperty(obj, prop, { get: () => value, configurable: true });
    } catch (e) {}
  };

  // Navigator
  spoof(navigator, "hardwareConcurrency", 2);
  spoof(navigator, "deviceMemory", 4);
  spoof(navigator, "maxTouchPoints", 0);
  spoof(navigator, "platform", "Linux x86_64");
  spoof(navigator, "vendor", "");
  spoof(navigator, "languages", ["en-US", "en"]);
  spoof(navigator, "language", "en-US");
  spoof(navigator, "userAgent", "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0");
  spoof(navigator, "appVersion", "5.0 (X11)");
  spoof(navigator, "oscpu", "Linux x86_64");

  // Screen
  try {
    spoof(screen, "width", 1920);
    spoof(screen, "height", 1080);
    spoof(screen, "availWidth", 1920);
    spoof(screen, "availHeight", 1040);
    spoof(screen, "colorDepth", 24);
    spoof(screen, "pixelDepth", 24);
  } catch (e) {}

  // Timezone: force UTC via Intl
  try {
    const origDateTimeFormat = Intl.DateTimeFormat;
    Intl.DateTimeFormat = function (locale, opts) {
      opts = opts || {};
      opts.timeZone = "UTC";
      return new origDateTimeFormat(locale || "en-US", opts);
    };
    Intl.DateTimeFormat.prototype = origDateTimeFormat.prototype;
  } catch (e) {}

  // Date.prototype.getTimezoneOffset -> 0
  try {
    Date.prototype.getTimezoneOffset = function () { return 0; };
  } catch (e) {}

  // WebGL renderer/vendor (if not disabled)
  try {
    const getParam = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function (p) {
      // UNMASKED_VENDOR_WEBGL = 37445, UNMASKED_RENDERER_WEBGL = 37446
      if (p === 37445) return "Intel Inc.";
      if (p === 37446) return "Intel Iris OpenGL Engine";
      return getParam.call(this, p);
    };
  } catch (e) {}

  // Battery API
  if (navigator.getBattery) {
    navigator.getBattery = function () {
      return Promise.resolve({
        charging: true,
        chargingTime: 0,
        dischargingTime: Infinity,
        level: 1,
        addEventListener: () => {},
        removeEventListener: () => {},
      });
    };
  }
})();
