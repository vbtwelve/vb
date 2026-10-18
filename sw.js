/* VB : fonctionnement hors connexion et mises à jour automatiques.
   La page est toujours demandée au réseau en premier (donc toujours à jour quand tu es connecté),
   et la copie en cache sert quand tu es hors ligne. */
const CACHE="vb-2026.10.18-3";
const ASSETS=["./","./index.html","./manifest.webmanifest","./fonts/newsreader.woff2","./fonts/newsreader-italic.woff2","./fonts/dmsans.woff2",
  "./icons/icon-192.png","./icons/icon-512.png","./icons/maskable-192.png","./icons/maskable-512.png","./icons/apple-touch-icon.png","./icons/favicon-64.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(r.mode==="navigate"){
    e.respondWith(fetch(r,{cache:"no-store"}).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put("./index.html",cp));}return res;})
      .catch(()=>caches.match("./index.html").then(m=>m||caches.match("./"))));
    return;}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));}return res;})));
});
