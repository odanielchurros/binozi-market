const C="binozi-v6";
const CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const rede=r=>new Promise((ok,no)=>{const t=setTimeout(()=>no("tempo"),3000);fetch(r).then(x=>{clearTimeout(t);ok(x)},er=>{clearTimeout(t);no(er)})});
const guarda=(r,res)=>{if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res};
/* arquivos do app: tenta a internet primeiro (pega a versão nova) e usa o guardado se estiver sem sinal.
   leitor de texto (CDN): usa o guardado e só baixa na primeira vez. */
self.addEventListener("fetch",e=>{
 const r=e.request;if(r.method!=="GET")return;
 if(new URL(r.url).origin===location.origin){
  e.respondWith(rede(r).then(res=>guarda(r,res)).catch(()=>caches.match(r).then(h=>h||caches.match("index.html"))));
 }else{
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>guarda(r,res))));
 }
});
