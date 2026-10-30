'use strict';
/* =========================================================
   MAPA DE VIAJES · photos.js
   Fotos guardadas en el propio dispositivo (IndexedDB), nunca se suben a ningún sitio.
   Cada foto se reduce (máx. 1600 px) y se guarda con una miniatura para el mapa y la galería.
   ========================================================= */

const PhotoStore = (() => {
  const DB_NAME = 'mapa-de-viajes-fotos';
  const FULL_PX = 1600, THUMB_PX = 360;
  let dbp = null;
  let meta = [];                 // [{ id, country, city, date, added }] sin los blobs
  const thumbUrls = new Map();   // id -> objectURL de la miniatura

  function db() {
    if (!dbp) {
      dbp = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore('photos', { keyPath: 'id' });
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return dbp;
  }
  async function tx(mode, fn) {
    const d = await db();
    return new Promise((resolve, reject) => {
      const t = d.transaction('photos', mode);
      const out = fn(t.objectStore('photos'));
      t.oncomplete = () => resolve(out?.result ?? out);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    });
  }

  // Reduce la imagen a un JPEG de como mucho `max` px por lado
  async function shrink(file, max, quality) {
    let src;
    try { src = await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (e) { src = null; }
    if (!src) {
      src = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
    }
    const w0 = src.width || src.naturalWidth; const h0 = src.height || src.naturalHeight;
    const k = Math.min(1, max / Math.max(w0, h0));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w0 * k); canvas.height = Math.round(h0 * k);
    canvas.getContext('2d').drawImage(src, 0, 0, canvas.width, canvas.height);
    if (src.close) src.close(); else URL.revokeObjectURL(src.src);
    return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
  }

  const keyOf = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const pickMeta =({ id, country, city, date, added }) => ({ id, country, city, date, added });

  return {
    async init() {
      try {
        const all = await tx('readonly', (s) => s.getAll());
        meta = all.map(pickMeta);
        all.forEach((p) => thumbUrls.set(p.id, URL.createObjectURL(p.thumb)));
      } catch (e) { meta = []; }
      if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
    },
    all: () => meta,
    of: (country, city) => meta
      .filter((p) => p.country === country && (city === undefined || keyOf(p.city) === keyOf(city)))
      .sort((a, b) => (b.date || 0) - (a.date || 0)),
    thumb: (id) => thumbUrls.get(id),
    async full(id) {
      const p = await tx('readonly', (s) => s.get(id));
      return p ? URL.createObjectURL(p.full) : null;
    },
    async add(files, country, city, onProgress) {
      let n = 0;
      for (const file of files) {
        try {
          const [full, thumb] = [await shrink(file, FULL_PX, 0.84), await shrink(file, THUMB_PX, 0.78)];
          const rec = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
            country, city: city || '', date: file.lastModified || Date.now(), added: Date.now(), full, thumb };
          await tx('readwrite', (s) => s.put(rec));
          meta.push(pickMeta(rec));
          thumbUrls.set(rec.id, URL.createObjectURL(thumb));
          n++;
        } catch (e) { /* imagen que el navegador no sabe leer: la saltamos */ }
        onProgress?.(n);
      }
      return n;
    },
    async remove(id) {
      await tx('readwrite', (s) => s.delete(id));
      meta = meta.filter((p) => p.id !== id);
      URL.revokeObjectURL(thumbUrls.get(id)); thumbUrls.delete(id);
    },
    async clear() {
      await tx('readwrite', (s) => s.clear());
      thumbUrls.forEach((u) => URL.revokeObjectURL(u)); thumbUrls.clear(); meta = [];
    },
    // Copia de seguridad: fotos como data URL dentro del JSON
    async exportAll() {
      const all = await tx('readonly', (s) => s.getAll());
      const toData = (blob) => new Promise((resolve) => { const r = new FileReader(); r.onload = () => resolve(r.result); r.readAsDataURL(blob); });
      const out = [];
      for (const p of all) out.push({ ...pickMeta(p), full: await toData(p.full), thumb: await toData(p.thumb) });
      return out;
    },
    async importAll(list) {
      await this.clear();
      for (const p of list) {
        if (!p || typeof p.full !== 'string' || !p.full.startsWith('data:image/')) continue;
        const full = await (await fetch(p.full)).blob();
        const thumb = typeof p.thumb === 'string' && p.thumb.startsWith('data:image/') ? await (await fetch(p.thumb)).blob() : full;
        const rec = { id: String(p.id), country: String(p.country), city: String(p.city || ''), date: +p.date || Date.now(), added: +p.added || Date.now(), full, thumb };
        await tx('readwrite', (s) => s.put(rec));
        meta.push(pickMeta(rec));
        thumbUrls.set(rec.id, URL.createObjectURL(thumb));
      }
    },
  };
})();
