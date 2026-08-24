// FoxAI Canvas Shield v3 - main-world deterministic canvas
(() => {
  if (typeof exportFunction === "undefined") return;
  const w = typeof window.wrappedJSObject !== "undefined" ? window.wrappedJSObject : null;
  if (!w || !w.HTMLCanvasElement) return;

  const KEY = 0xA5;
  const scrambleFn = function (data) {
    for (let i = 0; i < data.length; i++) data[i] = data[i] ^ ((i * 31 + KEY) & 0xFF);
    return data;
  };

  // --- page-world getImageData ---
  const newGetImageData = function (...args) {
    const img = this._foxOrigGetImageData ? this._foxOrigGetImageData(...args)
      : CanvasRenderingContext2D.prototype.wrappedJSObject._foxOrig.apply(this, args);
    try { scrambleFn(img.data); } catch (e) {}
    return img;
  };

  const proto2d = w.CanvasRenderingContext2D.prototype;
  if (!proto2d._foxPatched) {
    proto2d._foxOrig = proto2d.getImageData;
    proto2d.getImageData = exportFunction(function (...args) {
      const img = proto2d._foxOrig.call(this, ...args);
      try { scrambleFn(img.data); } catch (e) {}
      return img;
    }, w);
    proto2d._foxPatched = true;
  }

  const scrambleDataClone = exportFunction(function (arrayLike) {
    try { scrambleFn(arrayLike); } catch (e) {}
    return arrayLike;
  }, w);

  const patchCanvasProto = (proto) => {
    if (!proto || proto._foxPatched) return;
    const origToDataURL = proto.toDataURL;
    const origToBlob = proto.toBlob;

    proto.toDataURL = exportFunction(function (...args) {
      try {
        const ctx = this.getContext("2d");
        if (ctx && this.width > 0 && this.height > 0) {
          const img = proto2d._foxOrig.call(ctx, 0, 0, this.width, this.height);
          scrambleFn(img.data);
          const tmp = new w.RGBColor ? null : null;
          const c2 = document.createElement("canvas");
          c2.width = this.width; c2.height = this.height;
          c2.getContext("2d").putImageData(img, 0, 0);
          return origToDataURL.call(c2, ...args);
        }
      } catch (e) {}
      return origToDataURL.call(this, ...args);
    }, w);

    proto.toBlob = exportFunction(function (cb, ...rest) {
      try {
        const ctx = this.getContext("2d");
        if (ctx && this.width > 0 && this.height > 0) {
          const img = proto2d._foxOrig.call(ctx, 0, 0, this.width, this.height);
          scrambleFn(img.data);
          const c2 = document.createElement("canvas");
          c2.width = this.width; c2.height = this.height;
          c2.getContext("2d").putImageData(img, 0, 0);
          return origToBlob.call(c2, cb, ...rest);
        }
      } catch (e) {}
      return origToBlob.call(this, cb, ...rest);
    }, w);

    proto._foxPatched = true;
  };

  patchCanvasProto(w.HTMLCanvasElement.prototype);
  try { patchCanvasProto(w.OffscreenCanvas.prototype); } catch (e) {}
})();
