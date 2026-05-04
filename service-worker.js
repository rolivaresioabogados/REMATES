// Service Worker para PWA Remates - con auto-update
// La versión se incrementa con cada cambio importante. Cambiar este número
// fuerza la actualización de todos los clientes.
const VERSION = 'v4';
const CACHE_NAME = 'remates-' + VERSION;

// Solo cachear assets estáticos que cambian poco
const STATIC_ASSETS = [
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalar: precache de assets estáticos y activar inmediatamente
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting()) // No esperar a que se cierren las pestañas
  );
});

// Activar: limpiar cachés antiguas y tomar control inmediatamente
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim()) // Tomar control de pestañas abiertas
  );
});

// Fetch:
// - index.html y la raíz → NETWORK-FIRST (siempre intenta traer fresh)
// - gviz/tq (datos de Google Sheets) → NETWORK-FIRST
// - Iconos y manifest → cache-first
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isGviz = url.hostname.includes('docs.google.com') && url.pathname.includes('/gviz/tq');

  // Detectar si es petición del HTML principal (raíz, index.html, navegación)
  const isHTML = request.mode === 'navigate' ||
                 url.pathname.endsWith('/') ||
                 url.pathname.endsWith('/index.html');

  if (isGviz || isHTML) {
    // NETWORK-FIRST: siempre intenta traer fresh, caché solo como fallback offline
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, copy)).catch(()=>{});
          }
          return res;
        })
        .catch(() => caches.match(request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Assets estáticos (íconos, manifest): cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, copy)).catch(()=>{});
        }
        return res;
      }).catch(() => null);
    })
  );
});

// Permitir que el cliente fuerce skipWaiting via mensaje
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
