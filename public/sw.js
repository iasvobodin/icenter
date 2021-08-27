const testF = async () => {
  const data = await fetch('./manifest.json')
   const dataRes = await data.json()
   const FILES = []
   for (const iterator in dataRes) {
     FILES.push(dataRes[iterator].file);
   }
     return FILES
   }



const NAME = 'v1'

self.addEventListener('install', (e) => {
 e.waitUntil(testF()
 .then(FILES => {
   caches.open(NAME)
   .then((cache) => cache.addAll([...FILES, 'index.html']))
   self.skipWaiting()
 }))
})

self.addEventListener('activate', (e) => {
 e.waitUntil(
   caches.keys().then((keys) =>
     Promise.all(
       keys.map((key) => {
         if (key !== NAME) {
           return caches.delete(key)
         }
       })
     )
   )
 )
 self.clients.claim()
})

self.addEventListener('fetch', (e) => {
 e.respondWith(
   caches
     .match(e.request)
     .then(
       (response) =>
         response ||
         fetch(e.request).then((response) =>
           caches.open(NAME).then((cache) => {
             // if (e.request.method === 'GET') {
             //   cache.put(e.request, response.clone())
             // }
             return response
           })
         )
     )
     .catch(() => caches.match('./src/404.html'))
 )
})
