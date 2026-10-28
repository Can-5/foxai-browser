// FoxAI WebRTC Shield - block IP-leaking peer connections and media capture.
(() => {
  const block = (name) => {
    try {
      Object.defineProperty(window, name, {
        value: function () { throw new Error("FoxAI: " + name + " disabled for privacy."); },
        writable: false,
        configurable: false,
      });
    } catch (e) {}
  };

  // Neuter RTCPeerConnection variants in the page world.
  ["RTCPeerConnection", "webkitRTCPeerConnection", "mozRTCPeerConnection"].forEach(block);

  // Block media capture APIs that can leak device labels.
  if (navigator.mediaDevices) {
    try {
      navigator.mediaDevices.getUserMedia = function () {
        return Promise.reject(new Error("FoxAI: getUserMedia disabled for privacy."));
      };
      navigator.mediaDevices.enumerateDevices = function () {
        return Promise.resolve([]);
      };
    } catch (e) {}
  }

  // Block Battery API (already off via prefs, belt-and-braces).
  if (navigator.getBattery) {
    try { navigator.getBattery = function () { return Promise.reject(new Error("FoxAI: Battery API disabled.")); }; } catch (e) {}
  }
})();
