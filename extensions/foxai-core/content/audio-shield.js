// FoxAI Audio Shield - reduce AudioContext fingerprinting entropy.
(() => {
  const origGetChannelData = (AudioBuffer && AudioBuffer.prototype.getChannelData) || null;
  if (origGetChannelData) {
    AudioBuffer.prototype.getChannelData = function (...args) {
      const data = origGetChannelData.apply(this, args);
      try {
        // Add tiny deterministic noise so trackers can't use raw samples.
        for (let i = 0; i < data.length; i += 100) {
          data[i] = data[i] + (i % 7) * 1e-9;
        }
      } catch (e) {}
      return data;
    };
  }

  // Spoof OfflineAudioContext rendering by overriding startRendering result timing.
  if (window.OfflineAudioContext) {
    const orig = window.OfflineAudioContext;
    const Wrapped = function (...args) {
      const ctx = new orig(...args);
      const origStart = ctx.startRendering.bind(ctx);
      ctx.startRendering = function () {
        return origStart().then((buf) => {
          try {
            const ch = buf.getChannelData(0);
            for (let i = 0; i < ch.length; i += 200) ch[i] += (i % 5) * 1e-9;
          } catch (e) {}
          return buf;
        });
      };
      return ctx;
    };
    try {
      window.OfflineAudioContext = Wrapped;
      window.webkitOfflineAudioContext = Wrapped;
    } catch (e) {}
  }
})();
