/* =====================================================================
   TRARU CERÁMICA — Interaction script
   Catálogo (Sanity + fallback demo), galería, detalle, formularios.
   ===================================================================== */

const WA_PHONE = '5492216399028';
const SITE_URL = 'ceramicatraru.com';

/* Sanity: completar projectId cuando el Studio esté creado.
   Mientras esté vacío, el sitio usa los datos demo de abajo. */
const SANITY = { projectId: '', dataset: 'production', apiVersion: '2024-10-01' };

function waLink(message) {
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
}
function openWhatsApp(message) {
  window.open(waLink(message), '_blank', 'noopener,noreferrer');
}
function esc(s) {
  return String(s == null ? '' : s)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
function formatARS(value) {
  return '$ ' + new Intl.NumberFormat('es-AR').format(value);
}

const TONES = {
  terracotta: { c1: '#E8B884', c2: '#7A3418' },
  arena:      { c1: '#EBD3A8', c2: '#A88248' },
  ceniza:     { c1: '#B5A696', c2: '#4A3F35' },
  ambar:      { c1: '#E8BB6F', c2: '#8C5A1F' },
  ocre:       { c1: '#D9A461', c2: '#6E4318' },
  hueso:      { c1: '#F4E6C9', c2: '#A89478' },
};

const STOCK = {
  disponible: 'Disponible',
  ultimas:    'Últimas unidades',
  sin_stock:  'Sin stock',
};

/* SVG illustrations: se usan SOLO como placeholder de demo mientras no
   haya fotos reales desde Sanity. */
const SHAPES = {
  Cuenco: `<svg class="piece" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="80" rx="68" ry="9" fill="rgba(0,0,0,0.35)"/><path d="M32 80 Q 40 165, 100 175 Q 160 165, 168 80 Z" fill="rgba(0,0,0,0.2)"/><path d="M36 80 Q 44 158, 100 168 Q 156 158, 164 80 Z" fill="rgba(255,240,210,0.28)"/><ellipse cx="100" cy="80" rx="64" ry="6" fill="rgba(0,0,0,0.45)"/></svg>`,
  Tinaja: `<svg class="piece" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg"><path d="M70 40 L 70 60 Q 30 100, 40 170 Q 50 220, 100 225 Q 150 220, 160 170 Q 170 100, 130 60 L 130 40 Z" fill="rgba(0,0,0,0.22)"/><ellipse cx="100" cy="40" rx="32" ry="5" fill="rgba(0,0,0,0.5)"/><path d="M70 40 L 70 60 Q 30 100, 40 170 Q 50 220, 100 225 Q 150 220, 160 170 Q 170 100, 130 60 L 130 40 Z" fill="rgba(255,240,210,0.25)"/></svg>`,
  Plato: `<svg class="piece" viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg"><ellipse cx="110" cy="86" rx="100" ry="32" fill="rgba(0,0,0,0.3)"/><ellipse cx="110" cy="82" rx="100" ry="32" fill="rgba(0,0,0,0.2)"/><ellipse cx="110" cy="82" rx="80" ry="22" fill="rgba(0,0,0,0.35)"/><ellipse cx="110" cy="79" rx="78" ry="20" fill="rgba(255,240,210,0.28)"/></svg>`,
  Jarrón: `<svg class="piece" viewBox="0 0 180 240" xmlns="http://www.w3.org/2000/svg"><path d="M70 28 Q 65 50, 50 80 Q 30 130, 50 180 Q 65 220, 90 225 Q 115 220, 130 180 Q 150 130, 130 80 Q 115 50, 110 28 Z" fill="rgba(0,0,0,0.2)"/><ellipse cx="90" cy="28" rx="22" ry="4" fill="rgba(0,0,0,0.5)"/><path d="M70 28 Q 65 50, 50 80 Q 30 130, 50 180 Q 65 220, 90 225 Q 115 220, 130 180 Q 150 130, 130 80 Q 115 50, 110 28 Z" fill="rgba(255,240,210,0.25)"/></svg>`,
  Taza: `<svg class="piece" viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg"><path d="M55 45 L 55 130 Q 60 165, 100 168 Q 140 165, 145 130 L 145 45 Z" fill="rgba(0,0,0,0.2)"/><ellipse cx="100" cy="45" rx="45" ry="6" fill="rgba(0,0,0,0.5)"/><path d="M145 70 Q 175 75, 175 100 Q 175 125, 145 130" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="9" stroke-linecap="round"/><path d="M55 45 L 55 130 Q 60 165, 100 168 Q 140 165, 145 130 L 145 45 Z" fill="rgba(255,240,210,0.28)"/></svg>`,
  Set: `<svg class="piece" viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg"><ellipse cx="80" cy="100" rx="55" ry="8" fill="rgba(0,0,0,0.4)"/><path d="M28 100 Q 35 160, 80 168 Q 125 160, 132 100 Z" fill="rgba(0,0,0,0.2)"/><path d="M28 100 Q 35 160, 80 168 Q 125 160, 132 100 Z" fill="rgba(255,240,210,0.28)"/><path d="M150 60 L 150 140 Q 152 165, 185 168 Q 218 165, 220 140 L 220 60 Z" fill="rgba(0,0,0,0.2)"/><ellipse cx="185" cy="60" rx="36" ry="5" fill="rgba(0,0,0,0.5)"/><path d="M220 80 Q 235 88, 232 110 Q 230 130, 220 130" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="7" stroke-linecap="round"/><path d="M150 60 L 150 140 Q 152 165, 185 168 Q 218 165, 220 140 L 220 60 Z" fill="rgba(255,240,210,0.28)"/></svg>`,
};

/* media demo: varias "tomas" (distintos tonos) para probar la galería */
function demoMedia(category, tones) {
  return tones.map((t) => ({ kind: 'svg', tone: t, svg: SHAPES[category] || SHAPES.Cuenco }));
}

const DEMO_PRODUCTS = [
  { id: 'd1', name: 'Cuenco Rastrojo', category: 'Cuenco', price: 165000, material: 'Gres rojo · esmalte ceniza', edition: '1 de 6', tone: 'terracotta', stockState: STOCK.disponible, description: 'Cuenco torneado a mano en gres rojo, con un esmalte de ceniza que deja ver la textura del barro. Ideal para uso diario; cada pieza varía levemente en tono y forma.', media: demoMedia('Cuenco', ['terracotta', 'ocre']) },
  { id: 'd2', name: 'Tinaja Lluvia', category: 'Tinaja', price: 540000, salePrice: 459000, onSale: true, material: 'Barro chamota · esmalte mate', edition: 'Pieza única', tone: 'ambar', stockState: STOCK.disponible, description: 'Tinaja de gran porte en barro con chamota. Esmalte mate que reacciona al fuego dejando matices únicos. Pieza decorativa o para flores secas.', media: demoMedia('Tinaja', ['ambar', 'ocre', 'terracotta']) },
  { id: 'd3', name: 'Plato Salina', category: 'Plato', price: 125000, material: 'Gres blanco · borde sin esmaltar', edition: '1 de 8', tone: 'hueso', stockState: STOCK.ultimas, description: 'Plato playo de gres blanco con el borde sin esmaltar, que conserva el tacto crudo del barro. Apto para horno y lavavajillas.', media: demoMedia('Plato', ['hueso', 'arena']) },
  { id: 'd4', name: 'Jarrón Sereno', category: 'Jarrón', price: 360000, material: 'Gres negro · esmalte tenmoku', edition: 'Pieza única', tone: 'ceniza', stockState: STOCK.sin_stock, description: 'Jarrón alto en gres negro con esmalte tenmoku de profundidad oscura y reflejos. Una pieza serena, pensada para acompañar un rincón con luz.', media: demoMedia('Jarrón', ['ceniza', 'ambar']) },
  { id: 'd5', name: 'Taza Otoño', category: 'Taza', price: 95000, material: 'Gres rojo · interior cobalto', edition: 'Serie de 12', tone: 'ocre', stockState: STOCK.disponible, description: 'Taza de gres rojo con interior esmaltado en cobalto. Capacidad generosa, asa cómoda. Se vende por unidad.', media: demoMedia('Taza', ['ocre', 'terracotta']) },
  { id: 'd6', name: 'Set Hogaza', category: 'Set', price: 325000, salePrice: 279000, onSale: true, material: 'Gres tostado · esmalte miel', edition: '1 de 4', tone: 'arena', stockState: STOCK.disponible, description: 'Set de fuente y jarra en gres tostado con esmalte miel. Pensado para la mesa: pan, aceites, salsas. Cada set es una pequeña serie.', media: demoMedia('Set', ['arena', 'ocre', 'hueso']) },
];

/* ============== DATA SOURCE (Sanity o demo) ============== */
let products = [];

function sanityImg(url, w, h) {
  if (!url) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}w=${w}&h=${h}&fit=crop&auto=format&q=75`;
}

function normalizeStock(s) {
  if (s === STOCK.sin_stock) return STOCK.sin_stock;
  if (s === STOCK.ultimas) return STOCK.ultimas;
  return STOCK.disponible;
}

async function loadProducts() {
  if (SANITY.projectId) {
    const query = `*[_type=="product"]|order(order asc, _createdAt desc){
      _id,name,category,description,material,edition,price,onSale,salePrice,stockState,tone,
      "images": images[]{ "url": asset->url, "alt": coalesce(alt, ^.name) }
    }`;
    const url = `https://${SANITY.projectId}.apicdn.sanity.io/v${SANITY.apiVersion}/data/query/${SANITY.dataset}?query=${encodeURIComponent(query)}`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      const docs = (json && json.result) || [];
      if (docs.length) {
        return docs.map((d) => ({
          id: d._id,
          name: d.name,
          category: d.category,
          description: d.description || '',
          material: d.material || '',
          edition: d.edition || '',
          price: d.price || 0,
          onSale: !!d.onSale,
          salePrice: d.salePrice || 0,
          stockState: normalizeStock(d.stockState),
          tone: d.tone || 'terracotta',
          media: (d.images || []).map((im) => ({ kind: 'img', src: im.url, alt: im.alt })),
        }));
      }
    } catch (err) {
      console.warn('No se pudo leer Sanity, uso datos demo:', err);
    }
  }
  return DEMO_PRODUCTS;
}

/* ============== PRICE & MEDIA HELPERS ============== */
function effectivePrice(p) {
  return p.onSale && p.salePrice ? p.salePrice : p.price;
}
function priceHTML(p) {
  if (p.onSale && p.salePrice) {
    return `<span class="price-old">${formatARS(p.price)}</span><span class="price-now">${formatARS(p.salePrice)}</span>`;
  }
  return `<span class="card-price">${formatARS(p.price)}</span>`;
}
function toneVars(tone) {
  const t = TONES[tone] || TONES.terracotta;
  return `--c-light:${t.c1};--c-dark:${t.c2}`;
}
function slideHTML(slide, pid, idx, big) {
  const w = big ? 1100 : 700;
  const h = big ? 1100 : 735;
  const active = idx === 0 ? ' is-active' : '';
  if (slide.kind === 'img') {
    return `<figure class="slide${active}" style="${toneVars('terracotta')}"><img class="piece-photo" src="${esc(sanityImg(slide.src, w, h))}" alt="${esc(slide.alt)}" loading="lazy"></figure>`;
  }
  return `<figure class="slide slide--svg${active}" style="${toneVars(slide.tone)}">${slide.svg}</figure>`;
}
function stockBadgeHTML(p) {
  if (p.stockState === STOCK.sin_stock) return `<span class="badge badge-out">Sin stock</span>`;
  if (p.stockState === STOCK.ultimas) return `<span class="badge badge-last">Últimas unidades</span>`;
  return '';
}
function galleryNavHTML(count) {
  if (count <= 1) return '';
  return `<div class="gallery-nav">
    <button type="button" class="gnav gprev" aria-label="Foto anterior"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <button type="button" class="gnav gnext" aria-label="Foto siguiente"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
  </div>`;
}

/* gallery cycling within a container that holds .slide elements */
function bindGallery(root) {
  const slides = [...root.querySelectorAll('.slide')];
  if (slides.length <= 1) return;
  let idx = 0;
  const show = (n) => {
    idx = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    const dots = root.querySelectorAll('.gdot');
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  };
  root.querySelector('.gprev')?.addEventListener('click', (e) => { e.stopPropagation(); show(idx - 1); });
  root.querySelector('.gnext')?.addEventListener('click', (e) => { e.stopPropagation(); show(idx + 1); });
  root.querySelectorAll('.gdot').forEach((d, i) =>
    d.addEventListener('click', (e) => { e.stopPropagation(); show(i); }));
}

/* ============== CARD ============== */
const grid = document.getElementById('productGrid');

function buildReserveMessage(p) {
  const price = formatARS(effectivePrice(p));
  const sale = p.onSale && p.salePrice ? ` (en oferta, antes ${formatARS(p.price)})` : '';
  return `Hola Felipe, te escribo desde ${SITE_URL}. Me gustaría reservar esta pieza:

▸ ${p.name} (${p.category})
▸ ${p.material}
▸ Edición: ${p.edition}
▸ Precio: ${price}${sale}

¿Sigue disponible? ¡Gracias!`;
}

function reserve(p) {
  if (p.stockState === STOCK.sin_stock) return;
  openWhatsApp(buildReserveMessage(p));
  showToast(`Abriendo WhatsApp para reservar «${p.name}»…`);
}

function tplProduct(p) {
  const card = document.createElement('article');
  card.className = 'card';
  card.style.cssText = toneVars(p.tone);
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Ver detalle de ${p.name}`);

  const slides = p.media.map((m, i) => slideHTML(m, p.id, i, false)).join('');
  const dots = p.media.length > 1
    ? `<div class="gdots">${p.media.map((_, i) => `<span class="gdot${i === 0 ? ' is-active' : ''}"></span>`).join('')}</div>`
    : '';
  const out = p.stockState === STOCK.sin_stock;

  card.innerHTML = `
    <div class="card-media">
      <span class="card-tag">${esc(p.category)}</span>
      ${p.onSale ? '<span class="badge badge-sale">Oferta</span>' : ''}
      ${galleryNavHTML(p.media.length)}
      <div class="slides">${slides}</div>
      ${stockBadgeHTML(p)}
      ${dots}
    </div>
    <div class="card-body">
      <h3 class="card-title">${esc(p.name)}</h3>
      <span class="card-mat">${esc(p.material)} · ${esc(p.edition)}</span>
      <div class="card-foot">
        <div class="price-wrap">${priceHTML(p)}</div>
        <button type="button" class="card-cta${out ? ' is-disabled' : ''}" ${out ? 'disabled aria-disabled="true"' : ''}>
          ${out ? 'Sin stock' : 'Reservar'}
          ${out ? '' : `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
        </button>
      </div>
    </div>`;

  bindGallery(card.querySelector('.card-media'));

  const cta = card.querySelector('.card-cta');
  cta.addEventListener('click', (e) => { e.stopPropagation(); reserve(p); });

  const open = (e) => {
    if (e.target.closest('.gnav') || e.target.closest('.card-cta') || e.target.closest('.gdot')) return;
    openDetail(p);
  };
  card.addEventListener('click', open);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(p); }
  });
  return card;
}

function renderProducts() {
  grid.innerHTML = '';
  if (!products.length) {
    grid.innerHTML = `<p class="grid-empty">Pronto, nuevas piezas. Mientras tanto, escribinos por <a href="${esc(waLink('Hola Felipe, quería consultar por piezas disponibles.'))}" target="_blank" rel="noopener">WhatsApp</a>.</p>`;
    return;
  }
  products.forEach((p) => {
    const node = tplProduct(p);
    grid.appendChild(node);
  });
}

function renderSkeleton(n = 6) {
  grid.innerHTML = Array.from({ length: n }).map(() =>
    `<div class="card card-skeleton"><div class="card-media"></div><div class="card-body"><div class="sk-line"></div><div class="sk-line sk-short"></div></div></div>`
  ).join('');
}

/* ============== DETAIL MODAL ============== */
const detailDialog = document.getElementById('detailDialog');
const detailInner = document.getElementById('detailInner');

function openDetail(p) {
  const out = p.stockState === STOCK.sin_stock;
  const slides = p.media.map((m, i) => slideHTML(m, p.id, i, true)).join('');
  const thumbs = p.media.length > 1
    ? `<div class="d-thumbs">${p.media.map((m, i) =>
        `<button type="button" class="d-thumb${i === 0 ? ' is-active' : ''}" data-i="${i}" style="${toneVars(m.kind === 'svg' ? m.tone : p.tone)}" aria-label="Foto ${i + 1}">${m.kind === 'img' ? `<img src="${esc(sanityImg(m.src, 160, 160))}" alt="">` : m.svg}</button>`
      ).join('')}</div>`
    : '';

  detailInner.innerHTML = `
    <button type="button" class="detail-close" id="detailClose" aria-label="Cerrar"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 6l12 12M18 6l-12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
    <div class="detail-gallery">
      <div class="card-media d-media">
        ${p.onSale ? '<span class="badge badge-sale">Oferta</span>' : ''}
        ${galleryNavHTML(p.media.length)}
        <div class="slides">${slides}</div>
        ${stockBadgeHTML(p)}
      </div>
      ${thumbs}
    </div>
    <div class="detail-info">
      <span class="eyebrow">${esc(p.category)}</span>
      <h3 class="detail-name">${esc(p.name)}</h3>
      <p class="detail-edition">${esc(p.edition)} · ${esc(p.material)}</p>
      <p class="detail-desc">${esc(p.description)}</p>
      <div class="detail-price">${priceHTML(p)}</div>
      <button type="button" class="btn btn-solid btn-block detail-reserve${out ? ' is-disabled' : ''}" ${out ? 'disabled aria-disabled="true"' : ''}>
        <span>${out ? 'Sin stock' : 'Reservar por WhatsApp'}</span>
        ${out ? '' : `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
      </button>
      <p class="detail-note">Las piezas son únicas y artesanales: pueden variar levemente en tono y forma.</p>
    </div>`;

  const media = detailInner.querySelector('.d-media');
  bindGallery(media);
  // sync thumbnails with main gallery
  const slideEls = [...media.querySelectorAll('.slide')];
  detailInner.querySelectorAll('.d-thumb').forEach((th) => {
    th.addEventListener('click', () => {
      const i = +th.dataset.i;
      slideEls.forEach((s, k) => s.classList.toggle('is-active', k === i));
      media.querySelectorAll('.gdot').forEach((d, k) => d.classList.toggle('is-active', k === i));
      detailInner.querySelectorAll('.d-thumb').forEach((t2, k) => t2.classList.toggle('is-active', k === i));
    });
  });

  detailInner.querySelector('#detailClose').addEventListener('click', closeDetail);
  detailInner.querySelector('.detail-reserve').addEventListener('click', () => reserve(p));

  if (typeof detailDialog.showModal === 'function') detailDialog.showModal();
  else detailDialog.setAttribute('open', '');
}

function closeDetail() {
  if (typeof detailDialog.close === 'function') detailDialog.close();
  else detailDialog.removeAttribute('open');
}

detailDialog?.addEventListener('click', (e) => {
  const r = detailInner.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDetail();
});

/* ============== TOAST ============== */
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ============== APPOINTMENT FORM (email vía FormSubmit) ============== */
const citaForm = document.getElementById('citaForm');
const citaBtn = document.getElementById('citaSubmit');

if (citaForm && citaBtn) {
citaForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!citaForm.checkValidity()) {
    citaForm.reportValidity();
    return;
  }

  const label = citaBtn.querySelector('span');
  const original = label.textContent;
  citaBtn.disabled = true;
  label.textContent = 'Enviando…';

  try {
    const res = await fetch('https://formsubmit.co/ajax/durante_3@gmail.com', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(citaForm),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok && (data.success === true || data.success === 'true')) {
      citaForm.reset();
      showToast('¡Gracias! Recibimos tu solicitud, te escribimos pronto.');
    } else {
      throw new Error('FormSubmit no confirmó el envío');
    }
  } catch (err) {
    showToast('No pudimos enviar el formulario. Escribinos por WhatsApp al +54 9 221 639 9028.');
  } finally {
    citaBtn.disabled = false;
    label.textContent = original;
  }
});

/* Fecha mínima del formulario = hoy */
const dateInput = document.getElementById('f-date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}
} // fin guarda del formulario (#citaForm)

/* Confirmación si se volvió de un envío sin JS (?enviado=1) */
if (new URLSearchParams(location.search).get('enviado') === '1') {
  showToast('¡Gracias! Recibimos tu solicitud, te escribimos pronto.');
}

/* ============== INIT: cargar catálogo (sólo en la página de Catálogo) ============== */
if (grid) {
  (async function init() {
    renderSkeleton();
    products = await loadProducts();
    renderProducts();
  })();
}

/* ============== MENÚ MOBILE (toggle hamburguesa) ============== */
const navEl = document.querySelector('.nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navEl && navToggle && navLinks) {
  const closeNav = () => {
    navEl.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
  };
  navToggle.addEventListener('click', () => {
    const open = navEl.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
  document.addEventListener('click', (e) => {
    if (navEl.classList.contains('is-open') && !navEl.contains(e.target)) closeNav();
  });
}
