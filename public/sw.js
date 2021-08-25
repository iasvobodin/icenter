self.addEventListener('install', event => {
  self.skipWaiting();
    console.log('Service worker installing...');
    // Add a call to skipWaiting here
  });
  
  self.addEventListener('activate', event => {
    console.log('Service worker activating...');
  });
const staticCacheName = 'test-cache-v1'

  // self.addEventListener('fetch', event => {
  //   if (event.request.url ==='http://localhost:8080/api/projects?status=open') {
  //         // TEST RESPOND
  //   // event.respondWith(
  //   //  (async ()=> fetch(event.request))()
  //   // )
  //   // const preFetct = async () => {
  //   //   const cache = await caches.open(staticCacheName);
  //   //   const data = await fetch(event.request)
  //   //   const cc = await cache.put(event.request.url, data.clone());
  //   //   console.log(cc);
  //   // };
  //   // event.waitUntil(preFetct());









  //       event.respondWith(
  //         //CHECK OUR CACHE
  //         caches.match(event.request)
  //         .then(response => {
  //           if (response) {
  //             console.log('Found ', event.request.url, ' in cache');
  //             return response;
  //           }
  //           console.log('Network request for ', event.request.url);
  //           return fetch(event.request)
  //           .then(response => {
  //               return caches.open(staticCacheName).then(cache => {
  //                 cache.put(event.request.url, response.clone());
  //                 return response;
  //               });
  //             });
      
  //         })
  //   )
  // }
  // });