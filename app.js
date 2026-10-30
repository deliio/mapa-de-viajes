'use strict';
/* =========================================================
   MAPA DE VIAJES · app.js
   Todo funciona en el navegador; los datos viven en localStorage
   (y en la copia de seguridad JSON que exportes desde el menú).
   ========================================================= */

const STORE_KEY = 'mapa-de-viajes';
const UN_TOTAL = COUNTRIES.filter((c) => c.u).length; // 195
const LAND_TOTAL = COUNTRIES.filter((c) => c.k !== 'AN').reduce((s, c) => s + c.a, 0);
const CONTINENTS = ['EU', 'AS', 'AF', 'NA', 'SA', 'OC'];
const BY_CODE = new Map(COUNTRIES.map((c) => [c.c, c]));
const ASPECT = MAP_W / MAP_H;

/* ---------- Textos (ES / EN) ---------- */
const T = {
  es: {
    'app.title': 'Mapa de viajes',
    'app.lead': 'Guarda todos los viajes que has hecho y descubre qué porcentaje del mundo conoces.',
    'map.title': 'Mi mapa de viajes', 'map.hint': 'Toca un país para marcarlo o añadir un viaje.',
    'map.search': 'Buscar país', 'map.searchPh': 'Ej: Vietnam', 'map.noResults': 'Sin resultados',
    'stats.world': 'del mundo visitado', 'stats.countries': 'países', 'stats.cities': 'ciudades',
    'stats.continents': 'continentes', 'stats.trips': 'viajes',
    'stats.detail': '{n} de {t} países · {a} % de la superficie terrestre',
    'stats.territories': ' · +{n} territorios',
    'legend.none': 'Sin visitar', 'legend.visited': 'Visitado', 'legend.home': 'Casa',
    'trips.title': 'Viajes guardados', 'trips.add': 'Viaje', 'trips.all': 'Todos',
    'trips.byCont': 'Continente', 'trips.byYear': 'Año',
    'trips.empty': 'Aún no has guardado ningún viaje. Toca un país del mapa o pulsa «+ Viaje».',
    'trips.emptyFilter': 'Ningún viaje con este filtro.',
    'chart.title': 'Viajes por año', 'chart.empty': 'Aquí verás cuántos viajes haces cada año.',
    'cont.title': 'Por continente',
    'cs.addTrip': 'Añadir viaje', 'cs.mark': 'Marcar como visitado', 'cs.unmark': 'Quitar visitado',
    'cs.byTrips': 'Visitado por tus viajes', 'cs.setHome': 'Fijar como casa', 'cs.isHome': 'Es tu casa',
    'cs.visited': 'Visitado', 'cs.notVisited': 'Sin visitar', 'cs.home': 'Tu casa',
    'cs.trips1': '1 viaje', 'cs.tripsN': '{n} viajes', 'cs.territory': 'Territorio',
    'tf.new': 'Nuevo viaje', 'tf.edit': 'Editar viaje', 'tf.country': 'País', 'tf.year': 'Año',
    'tf.month': 'Mes (opcional)', 'tf.noMonth': '—', 'tf.cities': 'Ciudades (separadas por comas)',
    'tf.citiesPh': 'Lisboa, Oporto', 'tf.note': 'Nota (opcional)', 'tf.notePh': 'Viaje de fin de carrera',
    'tf.save': 'Guardar', 'tf.delete': 'Borrar', 'tf.confirmDelete': '¿Borrar este viaje?',
    'menu.title': 'Opciones', 'menu.home': 'Mi casa', 'menu.noHome': 'Sin definir',
    'menu.homeCounts': 'Contar mi país como visitado',
    'menu.export': '⬇ Copia de seguridad (exportar)', 'menu.import': '⬆ Restaurar copia (importar)',
    'menu.reset': 'Borrar todos los datos',
    'menu.about': 'Porcentaje calculado sobre los 195 países reconocidos por la ONU (193 miembros + Vaticano y Palestina). Los territorios se muestran en el mapa pero no cuentan para el %.',
    'menu.confirmImport': 'Esto sustituirá tus datos actuales por los de la copia. ¿Continuar?',
    'menu.confirmReset': '¿Seguro que quieres borrar todos tus viajes y países marcados?',
    'toast.saved': 'Viaje guardado', 'toast.deleted': 'Viaje borrado', 'toast.marked': 'Marcado como visitado',
    'toast.unmarked': 'Ya no está marcado', 'toast.home': 'Casa actualizada', 'toast.imported': 'Copia restaurada',
    'toast.badFile': 'El archivo no es una copia válida', 'toast.reset': 'Datos borrados', 'toast.exported': 'Copia descargada',
    'foot.local': 'Tus datos se guardan solo en este dispositivo. Usa «Copia de seguridad» en el menú ⋯ para pasarlos a otro.',
    'k.EU': 'Europa', 'k.AS': 'Asia', 'k.AF': 'África', 'k.NA': 'América del Norte', 'k.SA': 'América del Sur', 'k.OC': 'Oceanía', 'k.AN': 'Antártida',
    'legend.city': 'Ciudad', 'legend.photos': 'Con fotos',
    'ph.title': 'Fotos', 'ph.all': 'Todas', 'ph.general': 'General', 'ph.addTo': '+ Fotos de {p}',
    'ph.empty': 'Añade las fotos que hiciste aquí. Elige antes la ciudad en las pestañas de arriba.',
    'ph.emptyNoCities': 'Añade las fotos que hiciste aquí. Si guardas un viaje con ciudades, podrás separarlas por ciudad.',
    'ph.adding': 'Guardando fotos… {n}/{t}', 'ph.added': '{n} fotos guardadas', 'ph.added1': '1 foto guardada',
    'ph.confirmDelete': '¿Borrar esta foto?', 'ph.deleted': 'Foto borrada', 'ph.n': '{n} fotos', 'ph.n1': '1 foto',
    'menu.exportPhotos': '⬇ Copia con fotos (exportar)', 'menu.exporting': 'Preparando copia…',
    'menu.photosNote': 'Las fotos se guardan solo en este dispositivo. En iPhone, añade la app a la pantalla de inicio para que Safari no las borre y haz de vez en cuando una «Copia con fotos».',
    'lang.other': 'English',
  },
  en: {
    'app.title': 'Travel map',
    'app.lead': 'Save every trip you have taken and find out what percentage of the world you know.',
    'map.title': 'My travel map', 'map.hint': 'Tap a country to mark it or add a trip.',
    'map.search': 'Search country', 'map.searchPh': 'e.g. Vietnam', 'map.noResults': 'No results',
    'stats.world': 'of the world visited', 'stats.countries': 'countries', 'stats.cities': 'cities',
    'stats.continents': 'continents', 'stats.trips': 'trips',
    'stats.detail': '{n} of {t} countries · {a}% of the world’s land area',
    'stats.territories': ' · +{n} territories',
    'legend.none': 'Not visited', 'legend.visited': 'Visited', 'legend.home': 'Home',
    'trips.title': 'Saved trips', 'trips.add': 'Trip', 'trips.all': 'All',
    'trips.byCont': 'Continent', 'trips.byYear': 'Year',
    'trips.empty': 'No trips saved yet. Tap a country on the map or press “+ Trip”.',
    'trips.emptyFilter': 'No trips match this filter.',
    'chart.title': 'Trips per year', 'chart.empty': 'Your trips per year will show up here.',
    'cont.title': 'By continent',
    'cs.addTrip': 'Add trip', 'cs.mark': 'Mark as visited', 'cs.unmark': 'Unmark visited',
    'cs.byTrips': 'Visited through your trips', 'cs.setHome': 'Set as home', 'cs.isHome': 'This is home',
    'cs.visited': 'Visited', 'cs.notVisited': 'Not visited', 'cs.home': 'Home',
    'cs.trips1': '1 trip', 'cs.tripsN': '{n} trips', 'cs.territory': 'Territory',
    'tf.new': 'New trip', 'tf.edit': 'Edit trip', 'tf.country': 'Country', 'tf.year': 'Year',
    'tf.month': 'Month (optional)', 'tf.noMonth': '—', 'tf.cities': 'Cities (comma separated)',
    'tf.citiesPh': 'Lisbon, Porto', 'tf.note': 'Note (optional)', 'tf.notePh': 'Graduation trip',
    'tf.save': 'Save', 'tf.delete': 'Delete', 'tf.confirmDelete': 'Delete this trip?',
    'menu.title': 'Options', 'menu.home': 'My home', 'menu.noHome': 'Not set',
    'menu.homeCounts': 'Count my country as visited',
    'menu.export': '⬇ Backup (export)', 'menu.import': '⬆ Restore backup (import)',
    'menu.reset': 'Delete all data',
    'menu.about': 'Percentage based on the 195 countries recognised by the UN (193 members + Vatican City and Palestine). Territories appear on the map but do not count towards the %.',
    'menu.confirmImport': 'This will replace your current data with the backup. Continue?',
    'menu.confirmReset': 'Are you sure you want to delete all your trips and marked countries?',
    'toast.saved': 'Trip saved', 'toast.deleted': 'Trip deleted', 'toast.marked': 'Marked as visited',
    'toast.unmarked': 'No longer marked', 'toast.home': 'Home updated', 'toast.imported': 'Backup restored',
    'toast.badFile': 'That file is not a valid backup', 'toast.reset': 'Data deleted', 'toast.exported': 'Backup downloaded',
    'foot.local': 'Your data is stored only on this device. Use “Backup” in the ⋯ menu to move it to another one.',
    'k.EU': 'Europe', 'k.AS': 'Asia', 'k.AF': 'Africa', 'k.NA': 'North America', 'k.SA': 'South America', 'k.OC': 'Oceania', 'k.AN': 'Antarctica',
    'legend.city': 'City', 'legend.photos': 'With photos',
    'ph.title': 'Photos', 'ph.all': 'All', 'ph.general': 'General', 'ph.addTo': '+ Photos of {p}',
    'ph.empty': 'Add the photos you took here. Pick the city in the tabs above first.',
    'ph.emptyNoCities': 'Add the photos you took here. Save a trip with cities to sort them by city.',
    'ph.adding': 'Saving photos… {n}/{t}', 'ph.added': '{n} photos saved', 'ph.added1': '1 photo saved',
    'ph.confirmDelete': 'Delete this photo?', 'ph.deleted': 'Photo deleted', 'ph.n': '{n} photos', 'ph.n1': '1 photo',
    'menu.exportPhotos': '⬇ Backup with photos (export)', 'menu.exporting': 'Preparing backup…',
    'menu.photosNote': 'Photos are stored only on this device. On iPhone, add the app to your Home Screen so Safari does not delete them, and make a “Backup with photos” now and then.',
    'lang.other': 'Español',
  },
};

/* ---------- Estado ---------- */
let state = load();
let filter = 'all';
let selected = null;   // país abierto en la hoja
let editing = null;    // viaje en edición

function load() {
  // geo: caché de ciudades ya localizadas → [x, y] en el mapa (o 0 si no se encontró)
  const base = { lang: 'es', home: 'ES', homeCounts: true, marked: [], trips: [], geo: {} };
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY));
    if (raw && typeof raw === 'object') return { ...base, ...raw };
  } catch (e) { /* datos corruptos o sin acceso: empezamos de cero */ }
  if (!(navigator.language || '').toLowerCase().startsWith('es')) base.lang = 'en';
  return base;
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* sin espacio o modo privado */ }
}

const $ = (id) => document.getElementById(id);
const t = (k, vars) => (T[state.lang][k] ?? T.es[k] ?? k).replace(/\{(\w+)\}/g, (_, v) => vars?.[v] ?? '');
const cname = (c) => (state.lang === 'es' ? c.e : c.n);
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const locale = () => (state.lang === 'es' ? 'es-ES' : 'en-GB');
const fmt = (n, d = 0) => n.toLocaleString(locale(), { minimumFractionDigits: d, maximumFractionDigits: d });
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

function visitedSet() {
  const s = new Set(state.marked);
  state.trips.forEach((tr) => s.add(tr.country));
  if (state.homeCounts && state.home) s.add(state.home);
  return s;
}
const tripsOf = (code) => state.trips.filter((tr) => tr.country === code);
const sortTrips = (list) => [...list].sort((a, b) => (b.year - a.year) || ((b.month || 0) - (a.month || 0)));

/* ---------- Mapa ---------- */
const svg = $('map');
const NS = 'http://www.w3.org/2000/svg';
const shapes = new Map();
const dots = new Map();
let vb = { x: 0, y: 0, w: MAP_W, h: MAP_H };
let homeG = null;

function buildMap() {
  svg.setAttribute('viewBox', `0 0 ${MAP_W} ${MAP_H}`);
  const land = document.createElementNS(NS, 'g');
  MAP_DECOR.forEach((d) => {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d); p.setAttribute('class', 'decor');
    land.appendChild(p);
  });
  const dotG = document.createElementNS(NS, 'g');
  COUNTRIES.forEach((c) => {
    if (c.k === 'AN') return;
    if (c.d) {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', c.d); p.setAttribute('class', 'ct'); p.dataset.c = c.c;
      const title = document.createElementNS(NS, 'title');
      p.appendChild(title);
      land.appendChild(p);
      shapes.set(c.c, p);
    }
    // Islas y microestados: un punto para que se vean y se puedan tocar
    const tiny = !c.b || (c.b[2] - c.b[0]) * (c.b[3] - c.b[1]) < 6;
    if (tiny) {
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', c.p[0]); dot.setAttribute('cy', c.p[1]);
      dot.setAttribute('class', 'dot'); dot.dataset.c = c.c;
      dot.appendChild(document.createElementNS(NS, 'title'));
      dotG.appendChild(dot);
      dots.set(c.c, dot);
    }
  });
  homeG = document.createElementNS(NS, 'g');
  pinG = document.createElementNS(NS, 'g');
  const defs = document.createElementNS(NS, 'defs');
  defs.innerHTML = '<clipPath id="pinClip" clipPathUnits="objectBoundingBox"><circle cx=".5" cy=".5" r=".5"/></clipPath>';
  svg.append(defs, land, dotG, homeG, pinG);
  applyViewBox();
}

/* ---------- Ciudades: localizarlas y pintarlas con sus fotos ---------- */
let pinG = null;
const cityKey = (country, city) => `${country}|${norm(city)}`;

// Natural Earth 1, la misma proyección con la que se generó countries.js
function project(lat, lon) {
  const r = Math.PI / 180; const l = lon * r; const p = lat * r; const p2 = p * p; const p4 = p2 * p2;
  const x = l * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4)));
  const y = p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)));
  const [k, tx, ty] = MAP_PROJ;
  return [Math.round((tx + k * x) * 10) / 10, Math.round((ty - k * y) * 10) / 10];
}

// Todas las ciudades conocidas: las de los viajes y las que tienen fotos
function allCities() {
  const map = new Map();
  state.trips.forEach((tr) => tr.cities.forEach((city) => {
    const k = cityKey(tr.country, city);
    if (!map.has(k)) map.set(k, { country: tr.country, city });
  }));
  PhotoStore.all().forEach((p) => {
    if (!p.city) return;
    const k = cityKey(p.country, p.city);
    if (!map.has(k)) map.set(k, { country: p.country, city: p.city });
  });
  return [...map.values()];
}

// Abreviaturas que la gente escribe y el buscador no entiende
const CITY_ALIASES = {
  cdmx: 'Ciudad de México', df: 'Ciudad de México', nyc: 'New York', ny: 'New York', 'nueva york': 'New York',
  la: 'Los Angeles', sf: 'San Francisco', bcn: 'Barcelona', mad: 'Madrid', bsas: 'Buenos Aires', 'bs as': 'Buenos Aires',
  rio: 'Rio de Janeiro', 'gran canaria': 'Las Palmas de Gran Canaria', 'las palmas': 'Las Palmas de Gran Canaria',
};

// Busca las coordenadas de cada ciudad nueva (Open-Meteo, gratis y sin clave) y las guarda
let geocoding = false;
async function geocodeMissing() {
  if (geocoding || !navigator.onLine) return;
  geocoding = true;
  let found = false;
  try {
    for (const { country, city } of allCities()) {
      const k = cityKey(country, city);
      if (k in state.geo) continue;
      try {
        const name = CITY_ALIASES[norm(city)] || city;
        let hit = null;
        for (const lang of ['es', 'en']) { // el buscador solo reconoce «Lisboa» o «Londres» pidiendo el idioma
          const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&format=json&language=${lang}&countryCode=${country}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('geo');
          hit = (await res.json()).results?.[0];
          if (hit) break;
        }
        state.geo[k] = hit ? project(hit.latitude, hit.longitude) : 0;
        found = true;
      } catch (e) { break; } // sin conexión: se reintenta en el próximo cambio
    }
  } finally {
    geocoding = false;
    if (found) { save(); paintPins(); }
  }
}

function paintPins() {
  pinG.innerHTML = '';
  const items = allCities().map((c) => {
    const photos = PhotoStore.of(c.country, c.city);
    // si no se encontró la ciudad pero tiene fotos, la chincheta va en el centro del país
    const at = state.geo[cityKey(c.country, c.city)] || (photos.length && cityKey(c.country, c.city) in state.geo ? BY_CODE.get(c.country)?.p : null);
    return { ...c, at, photos };
  }).filter((c) => c.at);
  // Fotos «generales» de un país sin ninguna ciudad con fotos: chincheta en el país
  const withCityPhotos = new Set(items.filter((c) => c.photos.length).map((c) => c.country));
  const general = new Map();
  PhotoStore.all().forEach((p) => { if (!withCityPhotos.has(p.country)) general.set(p.country, true); });
  general.forEach((_, code) => {
    const c = BY_CODE.get(code);
    if (c) items.push({ country: code, city: '', at: c.p, photos: PhotoStore.of(code) });
  });
  // primero las ciudades sin fotos (debajo) y luego las chinchetas con foto
  items.sort((a, b) => a.photos.length - b.photos.length);
  for (const it of items) {
    if (!it.photos.length) {
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', it.at[0]); dot.setAttribute('cy', it.at[1]); dot.setAttribute('class', 'city');
      dot.dataset.c = it.country; dot.dataset.city = it.city;
      dot.innerHTML = `<title>${esc(it.city)}</title>`;
      pinG.appendChild(dot);
      continue;
    }
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'pin'); g.dataset.c = it.country; g.dataset.city = it.city;
    g.dataset.x = it.at[0]; g.dataset.y = it.at[1];
    const label = it.city || cname(BY_CODE.get(it.country));
    g.innerHTML = `<title>${esc(label)} · ${it.photos.length}</title><circle class="pin-ring"/>`
      + `<image clip-path="url(#pinClip)" preserveAspectRatio="xMidYMid slice" href="${PhotoStore.thumb(it.photos[0].id)}"/>`
      + (it.photos.length > 1 ? `<circle class="pin-badge"/><text class="pin-num">${it.photos.length > 99 ? '99+' : it.photos.length}</text>` : '');
    pinG.appendChild(g);
  }
  sizeMarkers();
}

function paintMap() {
  const visited = visitedSet();
  for (const [code, el] of shapes) {
    el.classList.toggle('v', visited.has(code));
    el.classList.toggle('sel', code === selected);
    el.firstChild.textContent = cname(BY_CODE.get(code));
  }
  for (const [code, el] of dots) {
    el.classList.toggle('v', visited.has(code));
    el.firstChild.textContent = cname(BY_CODE.get(code));
  }
  homeG.innerHTML = '';
  const home = BY_CODE.get(state.home);
  if (home) {
    const ring = document.createElementNS(NS, 'circle');
    ring.setAttribute('cx', home.p[0]); ring.setAttribute('cy', home.p[1]); ring.setAttribute('class', 'home-ring');
    const core = document.createElementNS(NS, 'circle');
    core.setAttribute('cx', home.p[0]); core.setAttribute('cy', home.p[1]); core.setAttribute('class', 'home-core');
    homeG.append(ring, core);
  }
  sizeMarkers();
}

// Los puntos mantienen un tamaño parecido en pantalla al hacer zoom
function sizeMarkers() {
  const k = vb.w / MAP_W;
  for (const el of dots.values()) el.setAttribute('r', Math.max(0.35, 2 * k));
  const [ring, core] = homeG.children;
  if (ring) { ring.setAttribute('r', 6 * k); core.setAttribute('r', 1.8 * k); }
  if (!pinG) return;
  // Ciudades y chinchetas: tamaño fijo en píxeles de pantalla
  const px = vb.w / (svg.getBoundingClientRect().width || MAP_W);
  const R = 13 * px; const r = 3.2 * px;
  for (const el of pinG.children) {
    if (el.tagName === 'circle') { el.setAttribute('r', r); continue; }
    const x = +el.dataset.x; const y = +el.dataset.y;
    const [ringEl, img, badge, num] = [el.querySelector('.pin-ring'), el.querySelector('image'), el.querySelector('.pin-badge'), el.querySelector('.pin-num')];
    ringEl.setAttribute('cx', x); ringEl.setAttribute('cy', y); ringEl.setAttribute('r', R);
    img.setAttribute('x', x - R); img.setAttribute('y', y - R); img.setAttribute('width', 2 * R); img.setAttribute('height', 2 * R);
    if (badge) {
      badge.setAttribute('cx', x + R * 0.8); badge.setAttribute('cy', y - R * 0.8); badge.setAttribute('r', R * 0.48);
      num.setAttribute('x', x + R * 0.8); num.setAttribute('y', y - R * 0.8); num.setAttribute('font-size', R * 0.55);
    }
  }
}
window.addEventListener('resize', () => sizeMarkers());

function clampVB(v) {
  const w = Math.min(MAP_W, Math.max(MAP_W / 48, v.w));
  const h = w / ASPECT;
  const x = Math.min(MAP_W - w, Math.max(0, v.x));
  const y = Math.min(MAP_H - h, Math.max(0, v.y));
  return { x, y, w, h };
}
function applyViewBox() {
  svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  sizeMarkers();
}
function setVB(v) { vb = clampVB(v); applyViewBox(); }

let anim = 0;
function animateTo(target, ms = 320) {
  cancelAnimationFrame(anim);
  const from = { ...vb }; const to = clampVB(target); const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / ms); const e = 1 - Math.pow(1 - p, 3);
    vb = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, w: from.w + (to.w - from.w) * e, h: from.h + (to.h - from.h) * e };
    applyViewBox();
    if (p < 1) anim = requestAnimationFrame(step);
  };
  anim = requestAnimationFrame(step);
}
function zoomAt(factor, mx, my) {
  const w = Math.min(MAP_W, Math.max(MAP_W / 48, vb.w / factor));
  const f = w / vb.w;
  setVB({ x: mx - (mx - vb.x) * f, y: my - (my - vb.y) * f, w, h: w / ASPECT });
}
function toMap(clientX, clientY) {
  const r = svg.getBoundingClientRect();
  return [vb.x + ((clientX - r.left) / r.width) * vb.w, vb.y + ((clientY - r.top) / r.height) * vb.h];
}
function focusCountry(c) {
  let [x0, y0, x1, y1] = c.b || [c.p[0], c.p[1], c.p[0], c.p[1]];
  // Rusia, EE. UU., Fiyi… cruzan el antimeridiano: mejor centrar en su punto
  if (x1 - x0 > MAP_W * 0.5) { x0 = c.p[0] - 60; x1 = c.p[0] + 60; }
  const cx = (x0 + x1) / 2; const cy = (y0 + y1) / 2;
  const w = Math.max((x1 - x0) * 2.4, (y1 - y0) * 2.4 * ASPECT, MAP_W / 12);
  animateTo({ x: cx - w / 2, y: cy - w / ASPECT / 2, w, h: w / ASPECT });
}

// Arrastrar, pellizcar, rueda y toque
const pointers = new Map();
let gesture = null;
svg.addEventListener('pointerdown', (e) => {
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  svg.setPointerCapture(e.pointerId);
  if (pointers.size === 1) {
    const hit = e.target.closest('[data-c]');
    gesture = { moved: false, sx: e.clientX, sy: e.clientY, target: hit?.dataset.c || null, city: hit?.dataset.city };
  } else if (gesture) gesture.moved = true;
});
svg.addEventListener('pointermove', (e) => {
  const prev = pointers.get(e.pointerId);
  if (!prev || !gesture) return;
  const r = svg.getBoundingClientRect();
  const scale = vb.w / r.width;
  if (pointers.size === 1) {
    if (!gesture.moved && Math.hypot(e.clientX - gesture.sx, e.clientY - gesture.sy) < 6) return;
    gesture.moved = true; svg.classList.add('dragging');
    setVB({ ...vb, x: vb.x - (e.clientX - prev.x) * scale, y: vb.y - (e.clientY - prev.y) * scale });
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  } else if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    const before = Math.hypot(a.x - b.x, a.y - b.y);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const [a2, b2] = [...pointers.values()];
    const after = Math.hypot(a2.x - b2.x, a2.y - b2.y);
    const mid = [(a2.x + b2.x) / 2, (a2.y + b2.y) / 2];
    const midPrev = [(a.x + b.x) / 2, (a.y + b.y) / 2];
    setVB({ ...vb, x: vb.x - (mid[0] - midPrev[0]) * scale, y: vb.y - (mid[1] - midPrev[1]) * scale });
    if (before > 0) zoomAt(after / before, ...toMap(mid[0], mid[1]));
  }
});
function endPointer(e) {
  if (!pointers.has(e.pointerId)) return;
  pointers.delete(e.pointerId);
  if (pointers.size === 0 && gesture) {
    if (!gesture.moved && gesture.target && e.type === 'pointerup') openCountry(gesture.target, false, gesture.city);
    gesture = null; svg.classList.remove('dragging');
  }
}
svg.addEventListener('pointerup', endPointer);
svg.addEventListener('pointercancel', endPointer);
svg.addEventListener('wheel', (e) => {
  e.preventDefault();
  zoomAt(Math.exp(-e.deltaY * 0.0022), ...toMap(e.clientX, e.clientY));
}, { passive: false });
$('zoomIn').onclick = () => animateTo({ x: vb.x + vb.w / 4, y: vb.y + vb.h / 4, w: vb.w / 2, h: vb.h / 2 }, 220);
$('zoomOut').onclick = () => animateTo({ x: vb.x - vb.w / 2, y: vb.y - vb.h / 2, w: vb.w * 2, h: vb.h * 2 }, 220);
$('zoomReset').onclick = () => animateTo({ x: 0, y: 0, w: MAP_W, h: MAP_H }, 260);

/* ---------- Estadísticas ---------- */
function renderStats() {
  const visited = visitedSet();
  const list = [...visited].map((c) => BY_CODE.get(c)).filter(Boolean);
  const un = list.filter((c) => c.u).length;
  const terr = list.length - un;
  const pct = (un / UN_TOTAL) * 100;
  const area = (list.reduce((s, c) => s + c.a, 0) / LAND_TOTAL) * 100;
  const cities = new Set(state.trips.flatMap((tr) => tr.cities.map((x) => `${tr.country}|${norm(x)}`)));
  const conts = new Set(list.map((c) => c.k).filter((k) => CONTINENTS.includes(k)));

  $('pctWorld').textContent = un > 0 && pct < 1 ? '<1' : fmt(Math.round(pct));
  $('pctBar').style.width = `${Math.min(100, pct)}%`;
  $('pctDetail').textContent = t('stats.detail', { n: un, t: UN_TOTAL, a: fmt(area, area < 10 ? 1 : 0) })
    + (terr ? t('stats.territories', { n: terr }) : '');
  $('stCountries').textContent = un;
  $('stCities').textContent = cities.size;
  $('stContinents').textContent = `${conts.size}/6`;
  $('stTrips').textContent = state.trips.length;
  const home = BY_CODE.get(state.home);
  $('homeName').textContent = home ? `· ${cname(home)}` : '';

  // Por continente
  $('contList').innerHTML = CONTINENTS.map((k) => {
    const total = COUNTRIES.filter((c) => c.u && c.k === k).length;
    const n = list.filter((c) => c.u && c.k === k).length;
    return `<li class="cont-row${n ? ' done' : ''}"><span>${t('k.' + k)}</span><span class="num">${n}/${total}</span>
      <div class="progress"><span style="width:${(n / total) * 100}%"></span></div></li>`;
  }).join('');
}

/* ---------- Lista de viajes ---------- */
function renderFilter() {
  const sel = $('tripFilter');
  const years = [...new Set(state.trips.map((tr) => tr.year))].sort((a, b) => b - a);
  const conts = CONTINENTS.filter((k) => state.trips.some((tr) => BY_CODE.get(tr.country)?.k === k));
  if (filter !== 'all' && !conts.map((k) => 'k:' + k).concat(years.map((y) => 'y:' + y)).includes(filter)) filter = 'all';
  sel.innerHTML = `<option value="all">${t('trips.all')}</option>`
    + (conts.length ? `<optgroup label="${t('trips.byCont')}">${conts.map((k) => `<option value="k:${k}">${t('k.' + k)}</option>`).join('')}</optgroup>` : '')
    + (years.length ? `<optgroup label="${t('trips.byYear')}">${years.map((y) => `<option value="y:${y}">${y}</option>`).join('')}</optgroup>` : '');
  sel.value = filter;
}
function tripRow(tr) {
  const c = BY_CODE.get(tr.country);
  const month = tr.month ? new Date(2000, tr.month - 1, 1).toLocaleString(locale(), { month: 'short' }).replace('.', '') + ' ' : '';
  return `<li class="trip" data-id="${tr.id}">
    <div class="trip-main">
      <div class="trip-title"><span class="yr">${month}${tr.year}</span> — ${esc(c ? cname(c) : tr.country)}</div>
      ${tr.note ? `<div class="trip-note">${esc(tr.note)}</div>` : ''}
      ${(() => { const n = tr.cities.reduce((s, city) => s + PhotoStore.of(tr.country, city).length, 0); return n ? `<div class="trip-photos">📷 ${n === 1 ? t('ph.n1') : t('ph.n', { n })}</div>` : ''; })()}
    </div>
    <div class="trip-cities">${esc(tr.cities.join(', '))}</div>
  </li>`;
}
function renderTrips() {
  renderFilter();
  let list = state.trips;
  if (filter.startsWith('k:')) list = list.filter((tr) => BY_CODE.get(tr.country)?.k === filter.slice(2));
  if (filter.startsWith('y:')) list = list.filter((tr) => tr.year === +filter.slice(2));
  $('tripList').innerHTML = sortTrips(list).map(tripRow).join('');
  const empty = $('tripEmpty');
  empty.hidden = list.length > 0;
  empty.textContent = state.trips.length ? t('trips.emptyFilter') : t('trips.empty');
}

/* ---------- Gráfico por año ---------- */
function renderChart() {
  const box = $('yearChart');
  if (!state.trips.length) { box.innerHTML = `<p class="empty">${t('chart.empty')}</p>`; return; }
  const counts = new Map();
  state.trips.forEach((tr) => counts.set(tr.year, (counts.get(tr.year) || 0) + 1));
  const maxY = Math.max(...counts.keys());
  const minY = Math.max(Math.min(...counts.keys()), maxY - 19); // como mucho 20 años a la vista
  const years = []; for (let y = minY; y <= maxY; y++) years.push(y);
  const W = Math.max(280, Math.round(box.clientWidth || 600)), H = 150, pad = 8, base = H - 20;
  const peak = Math.max(...years.map((y) => counts.get(y) || 0));
  const slot = (W - pad * 2) / years.length;
  const bw = Math.min(34, slot * 0.62);
  const every = years.length > 12 ? 2 : 1;
  let out = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('chart.title')}">`;
  years.forEach((y, i) => {
    const n = counts.get(y) || 0;
    const h = n ? Math.max(4, (n / peak) * (base - 22)) : 2;
    const x = pad + i * slot + (slot - bw) / 2;
    out += `<rect class="${n ? 'bar' : 'bar0'}" x="${x}" y="${base - h}" width="${bw}" height="${h}" rx="2"><title>${y}: ${n}</title></rect>`;
    if (n) out += `<text class="val" x="${x + bw / 2}" y="${base - h - 5}" text-anchor="middle">${n}</text>`;
    if (i % every === 0 || i === years.length - 1) out += `<text x="${x + bw / 2}" y="${H - 5}" text-anchor="middle">'${String(y).slice(-2)}</text>`;
  });
  out += `<line class="axis" x1="${pad}" x2="${W - pad}" y1="${base}" y2="${base}"/></svg>`;
  box.innerHTML = out;
}

/* ---------- Buscador ---------- */
const searchInput = $('search');
const results = $('searchResults');
let resultCodes = []; let active = -1;
function runSearch() {
  const q = norm(searchInput.value);
  if (!q) { results.hidden = true; return; }
  const visited = visitedSet();
  resultCodes = COUNTRIES.filter((c) => c.k !== 'AN')
    .map((c) => {
      const a = norm(c.e); const b = norm(c.n);
      const score = (a.startsWith(q) || b.startsWith(q)) ? 0 : (a.includes(q) || b.includes(q) || c.c.toLowerCase() === q) ? 1 : 9;
      return { c, score };
    })
    .filter((r) => r.score < 9)
    .sort((x, y) => x.score - y.score || cname(x.c).localeCompare(cname(y.c), locale()))
    .slice(0, 8).map((r) => r.c.c);
  active = resultCodes.length ? 0 : -1;
  results.innerHTML = resultCodes.length
    ? resultCodes.map((code, i) => {
      const c = BY_CODE.get(code); const v = visited.has(code);
      return `<li data-c="${code}" class="${i === active ? 'active' : ''}"><span>${esc(cname(c))}</span><span class="tag${v ? ' v' : ''}">${v ? '● ' + t('cs.visited') : t('k.' + c.k)}</span></li>`;
    }).join('')
    : `<li class="muted">${t('map.noResults')}</li>`;
  results.hidden = false;
}
function pickResult(code) {
  results.hidden = true; searchInput.value = ''; searchInput.blur();
  openCountry(code, true);
}
searchInput.addEventListener('input', runSearch);
searchInput.addEventListener('focus', runSearch);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (!resultCodes.length) return;
    active = (active + (e.key === 'ArrowDown' ? 1 : -1) + resultCodes.length) % resultCodes.length;
    [...results.children].forEach((li, i) => li.classList.toggle('active', i === active));
  } else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); pickResult(resultCodes[active]); }
  else if (e.key === 'Escape') { results.hidden = true; searchInput.blur(); }
});
results.addEventListener('pointerdown', (e) => {
  const li = e.target.closest('li[data-c]');
  if (li) { e.preventDefault(); pickResult(li.dataset.c); }
});
document.addEventListener('pointerdown', (e) => { if (!e.target.closest('.search')) results.hidden = true; });

/* ---------- Hojas (modales) ---------- */
function openSheet(el) { el.hidden = false; document.body.style.overflow = 'hidden'; }
function closeSheet(el) {
  el.hidden = true;
  if (![...document.querySelectorAll('.overlay')].some((o) => !o.hidden)) document.body.style.overflow = '';
  if (el.id === 'countrySheet') { selected = null; paintMap(); }
}
document.querySelectorAll('.overlay').forEach((ov) => {
  ov.addEventListener('click', (e) => { if (e.target === ov || e.target.closest('[data-close]')) closeSheet(ov); });
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const open = [...document.querySelectorAll('.overlay')].filter((o) => !o.hidden).pop();
  if (open) closeSheet(open);
});

// photoCity: null = todas las fotos del país, '' = fotos generales del país, 'Lisboa' = una ciudad
let photoCity = null;
function openCountry(code, zoom = false, city = null) {
  const c = BY_CODE.get(code);
  if (!c) return;
  if (selected !== code || city != null) photoCity = city ?? null;
  selected = code;
  if (zoom) focusCountry(c);
  renderCountrySheet();
  paintMap();
  openSheet($('countrySheet'));
}
function renderCountrySheet() {
  const c = BY_CODE.get(selected);
  if (!c) return;
  const trips = tripsOf(c.c);
  const visited = visitedSet().has(c.c);
  const isHome = state.home === c.c;
  $('csName').textContent = cname(c);
  $('csMeta').textContent = [t('k.' + c.k), c.u ? '' : t('cs.territory')].filter(Boolean).join(' · ');
  const st = $('csStatus');
  st.className = 'cs-status' + (visited ? ' v' : '');
  const parts = [isHome ? '⌂ ' + t('cs.home') : visited ? '● ' + t('cs.visited') : '○ ' + t('cs.notVisited')];
  if (trips.length) parts.push(trips.length === 1 ? t('cs.trips1') : t('cs.tripsN', { n: trips.length }));
  st.textContent = parts.join(' · ');
  const tog = $('csToggle');
  tog.disabled = trips.length > 0;
  tog.textContent = trips.length ? t('cs.byTrips') : state.marked.includes(c.c) ? t('cs.unmark') : t('cs.mark');
  const home = $('csHome');
  home.disabled = isHome;
  home.textContent = isHome ? '⌂ ' + t('cs.isHome') : '⌂ ' + t('cs.setHome');
  $('csTrips').innerHTML = sortTrips(trips).map(tripRow).join('');
  renderCountryPhotos();
}

/* ---------- Fotos de la ficha ---------- */
let galleryIds = [];
function renderCountryPhotos() {
  const c = BY_CODE.get(selected);
  const cities = allCities().filter((x) => x.country === c.c);
  const all = PhotoStore.of(c.c);
  const general = PhotoStore.of(c.c, '');
  const n = (list) => (list.length ? `<small>${list.length}</small>` : '');
  const chip = (val, label, list) => `<button type="button" class="chip${photoCity === val ? ' on' : ''}" ${val === null ? 'data-all="1"' : `data-city="${esc(val)}"`}>${esc(label)}${n(list)}</button>`;
  $('csCities').innerHTML = cities.length
    ? chip(null, t('ph.all'), all) + cities.map((x) => chip(x.city, x.city, PhotoStore.of(c.c, x.city))).join('') + chip('', t('ph.general'), general)
    : '';
  const shown = photoCity === null ? all : PhotoStore.of(c.c, photoCity);
  galleryIds = shown.map((p) => p.id);
  $('csGallery').innerHTML = shown.map((p) => `<button type="button" data-id="${p.id}"><img src="${PhotoStore.thumb(p.id)}" alt="" loading="lazy">`
    + (photoCity === null && p.city ? `<span class="g-city">${esc(p.city)}</span>` : '') + '</button>').join('')
    + `<button type="button" class="g-add" aria-label="+">+</button>`;
  $('csPhotoCount').textContent = all.length ? `· ${all.length}` : '';
  $('csAddPhotos').textContent = t('ph.addTo', { p: photoCity ? photoCity : cname(c) });
  $('csPhotoHint').textContent = shown.length ? '' : cities.length ? t('ph.empty') : t('ph.emptyNoCities');
}
$('csCities').addEventListener('click', (e) => {
  const b = e.target.closest('.chip');
  if (!b) return;
  photoCity = b.dataset.all ? null : b.dataset.city;
  renderCountryPhotos();
});
$('csGallery').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.classList.contains('g-add')) $('photoInput').click();
  else openLightbox(galleryIds.indexOf(b.dataset.id));
});
$('csAddPhotos').onclick = () => $('photoInput').click();
$('photoInput').onchange = async (e) => {
  const files = [...e.target.files]; e.target.value = '';
  if (!files.length || !selected) return;
  const country = selected; const city = photoCity || '';
  toast(t('ph.adding', { n: 0, t: files.length }));
  const n = await PhotoStore.add(files, country, city, (k) => toast(t('ph.adding', { n: k, t: files.length })));
  toast(n === 1 ? t('ph.added1') : t('ph.added', { n }));
  renderAll();
  geocodeMissing();
};

/* ---------- Visor de fotos ---------- */
let lbIndex = 0; let lbUrl = null;
async function showLightbox() {
  const id = galleryIds[lbIndex];
  const meta = PhotoStore.all().find((p) => p.id === id);
  if (!meta) return closeLightbox();
  $('lbImg').src = PhotoStore.thumb(id); // la miniatura aparece al instante, luego la foto completa
  const url = await PhotoStore.full(id);
  if (galleryIds[lbIndex] !== id) { URL.revokeObjectURL(url); return; }
  if (lbUrl) URL.revokeObjectURL(lbUrl);
  lbUrl = url; $('lbImg').src = url;
  const c = BY_CODE.get(meta.country);
  const date = meta.date ? new Date(meta.date).toLocaleDateString(locale(), { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  $('lbCap').textContent = [meta.city, c && cname(c), date].filter(Boolean).join(' · ');
  $('lbCount').textContent = `${lbIndex + 1} / ${galleryIds.length}`;
  $('lbPrev').hidden = lbIndex === 0; $('lbNext').hidden = lbIndex === galleryIds.length - 1;
}
function openLightbox(i) {
  if (i < 0) return;
  lbIndex = i; $('lightbox').hidden = false; showLightbox();
}
function closeLightbox() {
  $('lightbox').hidden = true; $('lbImg').removeAttribute('src');
  if (lbUrl) { URL.revokeObjectURL(lbUrl); lbUrl = null; }
}
function stepLightbox(d) {
  const i = lbIndex + d;
  if (i < 0 || i >= galleryIds.length) return;
  lbIndex = i; showLightbox();
}
$('lbClose').onclick = closeLightbox;
$('lbPrev').onclick = () => stepLightbox(-1);
$('lbNext').onclick = () => stepLightbox(1);
$('lbDelete').onclick = async () => {
  if (!confirm(t('ph.confirmDelete'))) return;
  await PhotoStore.remove(galleryIds[lbIndex]);
  galleryIds.splice(lbIndex, 1);
  toast(t('ph.deleted'));
  renderAll();
  if (!galleryIds.length) return closeLightbox();
  lbIndex = Math.min(lbIndex, galleryIds.length - 1); showLightbox();
};
// Deslizar para pasar de foto
let swipeX = null;
$('lbStage').addEventListener('pointerdown', (e) => { swipeX = e.clientX; });
$('lbStage').addEventListener('pointerup', (e) => {
  if (swipeX === null) return;
  const dx = e.clientX - swipeX; swipeX = null;
  if (Math.abs(dx) > 50) stepLightbox(dx < 0 ? 1 : -1);
});
document.addEventListener('keydown', (e) => {
  if ($('lightbox').hidden) return;
  if (e.key === 'ArrowLeft') stepLightbox(-1);
  if (e.key === 'ArrowRight') stepLightbox(1);
  if (e.key === 'Escape') { e.stopImmediatePropagation(); closeLightbox(); }
}, true);
$('csToggle').onclick = () => {
  const code = selected;
  if (state.marked.includes(code)) { state.marked = state.marked.filter((x) => x !== code); toast(t('toast.unmarked')); }
  else { state.marked.push(code); toast(t('toast.marked')); }
  commit();
};
$('csHome').onclick = () => { state.home = selected; toast(t('toast.home')); commit(); };
$('csAddTrip').onclick = () => openTripForm(null, selected);

/* ---------- Formulario de viaje ---------- */
function fillCountrySelect(sel, withNone) {
  const opts = COUNTRIES.filter((c) => c.k !== 'AN').sort((a, b) => cname(a).localeCompare(cname(b), locale()));
  sel.innerHTML = (withNone ? `<option value="">${t('menu.noHome')}</option>` : '')
    + opts.map((c) => `<option value="${c.c}">${esc(cname(c))}</option>`).join('');
}
function fillMonths() {
  const sel = $('tfMonth');
  sel.innerHTML = `<option value="">${t('tf.noMonth')}</option>` + Array.from({ length: 12 }, (_, i) =>
    `<option value="${i + 1}">${new Date(2000, i, 1).toLocaleString(locale(), { month: 'long' })}</option>`).join('');
}
function openTripForm(trip, presetCountry) {
  editing = trip;
  $('tfTitle').textContent = trip ? t('tf.edit') : t('tf.new');
  fillCountrySelect($('tfCountry'), false);
  fillMonths();
  $('tfCountry').value = trip?.country || presetCountry || state.home || 'ES';
  $('tfYear').value = trip?.year || new Date().getFullYear();
  $('tfMonth').value = trip?.month || '';
  $('tfCities').value = trip ? trip.cities.join(', ') : '';
  $('tfNote').value = trip?.note || '';
  $('tfDelete').hidden = !trip;
  openSheet($('tripModal'));
}
$('addTrip').onclick = () => openTripForm(null, null);
$('tripForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const year = parseInt($('tfYear').value, 10);
  if (!(year >= 1900 && year <= 2100)) { $('tfYear').focus(); return; }
  const data = {
    country: $('tfCountry').value,
    year,
    month: parseInt($('tfMonth').value, 10) || null,
    cities: $('tfCities').value.split(',').map((s) => s.trim()).filter(Boolean),
    note: $('tfNote').value.trim(),
  };
  if (editing) Object.assign(editing, data);
  else state.trips.push({ id: uid(), ...data });
  closeSheet($('tripModal'));
  toast(t('toast.saved'));
  commit();
});
$('tfDelete').onclick = () => {
  if (!editing || !confirm(t('tf.confirmDelete'))) return;
  state.trips = state.trips.filter((tr) => tr !== editing);
  closeSheet($('tripModal'));
  toast(t('toast.deleted'));
  commit();
};
function onTripClick(e) {
  const li = e.target.closest('.trip');
  if (!li) return;
  const trip = state.trips.find((tr) => tr.id === li.dataset.id);
  if (trip) openTripForm(trip);
}
$('tripList').addEventListener('click', onTripClick);
$('csTrips').addEventListener('click', onTripClick);
$('tripFilter').addEventListener('change', (e) => { filter = e.target.value; renderTrips(); });

/* ---------- Menú: casa, copia de seguridad ---------- */
$('openMenu').onclick = () => {
  fillCountrySelect($('homeSelect'), true);
  $('homeSelect').value = state.home || '';
  $('homeCounts').checked = state.homeCounts;
  openSheet($('menuSheet'));
};
$('homeSelect').onchange = (e) => { state.home = e.target.value || null; commit(); };
$('homeCounts').onchange = (e) => { state.homeCounts = e.target.checked; commit(); };
function downloadBackup(extra, suffix) {
  const { lang, ...data } = state;
  const blob = new Blob([JSON.stringify({ app: 'mapa-de-viajes', version: 1, ...data, ...extra })], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mapa-de-viajes${suffix}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
  toast(t('toast.exported'));
}
$('exportBtn').onclick = () => downloadBackup({}, '');
$('exportPhotosBtn').onclick = async () => {
  toast(t('menu.exporting'));
  downloadBackup({ photos: await PhotoStore.exportAll() }, '-fotos');
};
$('importBtn').onclick = () => $('importFile').click();
$('importFile').onchange = async (e) => {
  const file = e.target.files[0]; e.target.value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.trips) || !Array.isArray(data.marked)) throw new Error('bad');
    const trips = data.trips.filter((tr) => BY_CODE.has(tr.country) && Number.isFinite(+tr.year)).map((tr) => ({
      id: String(tr.id || uid()), country: tr.country, year: +tr.year, month: +tr.month || null,
      cities: Array.isArray(tr.cities) ? tr.cities.map(String) : [], note: String(tr.note || ''),
    }));
    if (!confirm(t('menu.confirmImport'))) return;
    state = { ...state, trips, marked: data.marked.filter((c) => BY_CODE.has(c)),
      home: BY_CODE.has(data.home) ? data.home : state.home, homeCounts: data.homeCounts !== false,
      geo: data.geo && typeof data.geo === 'object' ? { ...state.geo, ...data.geo } : state.geo };
    // Una copia sin fotos no toca las fotos que ya tienes
    if (Array.isArray(data.photos)) await PhotoStore.importAll(data.photos.filter((p) => BY_CODE.has(p?.country)));
    closeSheet($('menuSheet'));
    toast(t('toast.imported'));
    commit();
  } catch (err) { toast(t('toast.badFile')); }
};
$('resetBtn').onclick = () => {
  if (!confirm(t('menu.confirmReset'))) return;
  state = { ...state, trips: [], marked: [] };
  PhotoStore.clear().then(renderAll);
  closeSheet($('menuSheet'));
  toast(t('toast.reset'));
  commit();
};

/* ---------- Idioma ---------- */
function applyLang() {
  document.documentElement.lang = state.lang;
  document.title = t('app.title');
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  $('langLabel').textContent = t('lang.other');
}
$('langToggle').onclick = () => {
  state.lang = state.lang === 'es' ? 'en' : 'es';
  save(); applyLang(); renderAll();
};

/* ---------- Varios ---------- */
let toastTimer = 0;
function toast(msg) {
  const el = $('toast');
  el.textContent = msg; el.hidden = false;
  el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 2200);
}
function renderAll() {
  paintMap(); paintPins(); renderStats(); renderTrips(); renderChart();
  if (selected && !$('countrySheet').hidden) renderCountrySheet();
}
function commit() { save(); renderAll(); geocodeMissing(); }

let resizeTimer = 0;
window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(renderChart, 150); });

buildMap();
applyLang();
renderAll();
PhotoStore.init().then(() => { renderAll(); geocodeMissing(); });
window.addEventListener('online', geocodeMissing);

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
