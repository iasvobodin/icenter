
if (typeof idb === "undefined") {
  self.importScripts('../src/hooks/idb.js');
}

function createDB() {
  if (!('indexedDB' in self)) {
    console.log('This browser doesn\'t support IndexedDB');
    return;
  }
  const dbPromise = idb.open('products', 1, (upgradeDB) => {
    if (!upgradeDb.objectStoreNames.contains('beverages')) {
     const store = upgradeDb.createObjectStore('beverages', {
      keyPath: 'id'
    });
    }
    var store = upgradeDB.createObjectStore('beverages', {
      keyPath: 'id'
    });
    store.put({id: 123, name: 'coke', price: 10.99, quantity: 200});
    store.put({id: 321, name: 'pepsi', price: 8.99, quantity: 100});
    store.put({id: 222, name: 'water', price: 11.99, quantity: 300});
  });
}


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
    } return []
  } catch (error) {
    throw new Error(error)
  }

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
  createDB(),
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

  // TODO 5.3 - close all notifications when one is clicked

});
