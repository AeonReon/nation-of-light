/* Nation of Light — service worker. The shell is network-first so a deploy is
   seen on the next open; audio is cache-first because it never changes. */
const V = 'nol-v35';
const SHELL = ['./', 'index.html', 'style.css?v=34', 'rig.js?v=34', 'scene.js?v=34', 'app.js?v=34', 'content.json', 'school.json', 'audio/marcus/visemes.json', 'manifest.webmanifest?v=34'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  if (u.pathname.includes('/audio/') || u.pathname.includes('/images/')) {
    e.respondWith(caches.open(V).then(async c => { const hit = await c.match(e.request); if (hit) return hit; const r = await fetch(e.request); if (r.ok) c.put(e.request, r.clone()); return r; }));
    return;
  }
  e.respondWith(fetch(e.request).then(r => { if (r.ok) caches.open(V).then(c => c.put(e.request, r.clone())); return r; }).catch(() => caches.match(e.request)));
});
