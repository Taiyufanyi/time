const C='tl-v6';const F=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).catch(()=>{}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Ask the server first so new uploads show up; if the server is unreachable OR answers with an error
// (for example a 404 after a GitHub rename), keep showing the last good copy so the app and its data stay usable.
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  const fallback=()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html')||caches.match('./'));
  e.respondWith(fetch(e.request.url,{cache:'no-store'}).then(r=>{
    if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}
    return fallback().then(c=>c||r)}).catch(fallback))});
