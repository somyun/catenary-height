// 현장에서 인터넷 없이 실행되도록 앱 파일을 저장한다. 두 값은 빌드할 때 채워진다.
const VERSION = "47071ecf5d2a";
const FILES = ["./","./assets/index-BamWRVPc.css","./assets/index-gmIF8hWV.js","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./index.html","./manifest.webmanifest"];
const CACHE = `catenary-${VERSION}`;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE).map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      // 스크립트 요청에는 Origin이 붙어서, Vary를 따지면 저장해 둔 파일을 찾지 못한다.
      const hit = await cache.match(request, { ignoreSearch: true, ignoreVary: true });
      if (hit) return hit;
      if (request.mode === "navigate") return (await cache.match("./")) ?? fetch(request);
      return fetch(request);
    }),
  );
});
