/* Projeto Vida - Financeiro — service worker da casca.
   Só recebe e mostra avisos. Não guarda nada em cache: o app sempre vem da rede.
   O texto chega criptografado para este aparelho; o navegador decifra antes de entregar aqui. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (ev) { ev.waitUntil(self.clients.claim()); });
self.addEventListener('push', function (ev) {
  var d = {};
  try { d = ev.data ? ev.data.json() : {}; } catch (e) { d = { body: ev.data ? ev.data.text() : '' }; }
  ev.waitUntil(self.registration.showNotification(d.title || 'Projeto Vida - Financeiro', {
    body: d.body || '', tag: d.tag || undefined, renotify: !!d.tag,
    icon: 'icon-192.png', badge: 'icon-192.png', data: { url: d.url || './' }
  }));
});
self.addEventListener('notificationclick', function (ev) {
  ev.notification.close();
  var alvo = new URL((ev.notification.data && ev.notification.data.url) || './', self.registration.scope).href;
  ev.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (lista) {
    for (var i = 0; i < lista.length; i++) { if (lista[i].url.indexOf(self.registration.scope) === 0) return lista[i].focus(); }
    return self.clients.openWindow(alvo);
  }));
});
