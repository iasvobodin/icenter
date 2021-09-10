//AM I UPDATED????
const testF = async () => {
  try {
    const data = await fetch('./manifest.json')
    if (data.ok) {
      const dataRes = await data.json()
      const FILES = []
      for (const iterator in dataRes) {
        FILES.push(dataRes[iterator].file);
      }
      return FILES
    }
    return []
  } catch (error) {
    throw new Error(error)
  }
}



const NAME = 'v1'

self.addEventListener('install', (e) => {
  self.skipWaiting(),
  e.waitUntil(
    testF()
    .then(FILES => {
      caches.open(NAME)
        .then((cache) => cache.addAll([...FILES, 'index.html']))
    })
    )
})

self.addEventListener('activate', (e) => {
  console.log(e, 'hellow from activate');
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
          if (e.request.url.includes('api/templates')) {
            console.log(e.request);
            //  cache.put(e.request, response.clone())
          }
          return response
        })
      )
    )
    .catch(() => caches.match('./src/404.html'))
  )
})

self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const primaryKey = notification.data.primaryKey;
  console.log(primaryKey);
  const action = event.action;

  if (action === 'close') {
    notification.close();
  } else {
    self.clients.openWindow('projects');
    notification.close();
  }
});