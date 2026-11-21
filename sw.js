// 小小情绪魔法屋 service worker（自动生成）v2.0.0
const CACHE = "mofawu-v2.0.0-a4701f91e4";
const AUDIO_CACHE = "mofawu-audio-4199ef010d";
const ASSETS = [
 "./",
 "./assets/app-BIGpzByg.js",
 "./icons/apple-touch-icon.png",
 "./icons/icon-192.png",
 "./icons/icon-512.png",
 "./icons/icon-maskable-512.png",
 "./index.html",
 "./manifest.webmanifest"
];
const AUDIO = [
 "./audio/s00-a2488855.mp3",
 "./audio/s01-e51a596e.mp3",
 "./audio/s02-d42c897e.mp3",
 "./audio/s03-dada3930.mp3",
 "./audio/s04-983f5135.mp3",
 "./audio/s05-0b126b73.mp3",
 "./audio/s06-034eba95.mp3",
 "./audio/s07-a5aa47f0.mp3",
 "./audio/s08-94a901ea.mp3",
 "./audio/s09-80db7ea6.mp3"
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("mofawu-") && k !== CACHE && k !== AUDIO_CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim())
    .then(() => { // 空闲时把还没缓存的音频补齐，保证离线可用
      caches.open(AUDIO_CACHE).then(async (c) => { for (const u of AUDIO) { const url = new URL(u, self.registration.scope).href; if (!(await c.match(url))) { try { const r = await fetch(url); if (r.ok) await c.put(url, r); } catch (err) { /* 离线时下次再补 */ } } } });
    }));
});
self.addEventListener("message", (e) => { if (e.data === "SKIP_WAITING") self.skipWaiting(); });
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put("./index.html", cp)); return r; })
      .catch(() => caches.match("./index.html").then((r) => r || caches.match("./"))));
    return;
  }
  const isAudio = url.pathname.includes("/audio/");
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((r) => {
    if (r && r.ok) { const cp = r.clone(); caches.open(isAudio ? AUDIO_CACHE : CACHE).then((c) => c.put(req, cp)); }
    return r;
  })));
});
