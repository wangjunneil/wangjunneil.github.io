// var CACHE_VERSION = "V1.1.0";
// var CACHE_NAME = CACHE_VERSION + ":sw-cache::";
var URL_TO_CACHE = [
    '/',
    '/offline.html',
    '/manifest.json',
    '/assets/jquery-1.9.1.min.js',
    '/assets/core.css',
    '/assets/js/nav.js',
    '/assets/js/zepto.min.js',
    '/assets/header.png',
    '/assets/offline.gif',
    '/assets/search.png',
    '/assets/main.js',
    '/assets/hacker.png',
    '/assets/5-13050G31J7.gif',
    '/assets/clear.png',
    '/assets/icons/icon-144x144.png',
    '/assets/favicon.ico',
    '/assets/clear.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('sw-cache')
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(URL_TO_CACHE);
      })
  );
});

// self.addEventListener('install', function(event) {
//   event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
//         console.log("SERVICE WORKER: Install cache.")
//         return cache.addAll(URL_TO_CACHE);
//       })
//   );
// });

// self.addEventListener("activate", function(e) {
//     console.log("[Serviceworker]", "Activating!", e);

//     e.waitUntil(caches.keys().then(keyList => {
//         return Promise.all(keyList.map(key => {
//             if (key != CACHE_NAME) {
//                 console.log('[ServiceWorker] Removing old cache', key);
//                 return caches.delete(key);
//             }
//         }));
//     }));
// });

self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['pages-cache-v1', 'blog-posts-cache-v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});



self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT:Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT:Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// self.addEventListener("fetch", function(e) {
//     e.respondWith(
//         caches.match(e.request).then(resp => {
//             // 缓存命中直接返回
//             if (resp) {
//                 return resp;
//             }

//             var fetchRequest = e.request.clone();
//             return fetch(fetchRequest).then(response => {
//                 // 检查是否收到无效的响应
//                 if (!response || response.status !== 200 || response.type !== 'basic') {
//                     return response || caches.match("/offline.html");
//                 }

//                 var responseToCache = response.clone();
//                 caches.open(CACHE_NAME).then(cache => {
//                     cache.put(e.request, responseToCache);
//                 });

//                 return response;
//             })
//             .catch (err => {
//                 return caches.match('/offline.html');
//             });
//         })
//     )
// });

// // 接收推送消息
// function onPush(event) {
//     let push_message = event.data.text();

//     const title = "New Message from Vinny's Blog";
//     // const actions = [
//     //     { action: 'like', title: '👍Like' },
//     //     { action: 'reply', title: '⤻ Reply' }
//     // ];
//     const options = {
//         // body: push_message,
//         body: 'Did you make a $1,000,000 purchase at Dr. Evil...',
//         icon: '/assets/hacker.png',
//         vibrate: [200, 100, 200, 100, 200, 100, 400],
//         tag: "request",
//         badge: '/assets/push/badge.png',
//         actions: [
//             { "action": "yes", "title": "Yes", "icon": "images/yes.png" },
//             { "action": "no", "title": "No", "icon": "images/no.png" }
//         ]
//     };

//     event.waitUntil(self.registration.showNotification(title, options));
// }

// // 通知点击事件
// function onNotificationClick(event) {
//     console.log('[Service Worker] Notification click Received.');

//     // event.notification.close();

//     // event.waitUntil(
//     //     clients.openWindow('https://developers.google.com/web/')
//     // );

//     var messageId = event.notification.data;

//     event.notification.close();

//     if (event.action == 'like') {
//         // TODO
//     } else if (event.action == 'reply') {
//         // TODO
//     }
// }

// // Service Worker 事件注册
// self.addEventListener("install", onInstall);
// self.addEventListener("activate", onActivate),
// self.addEventListener("fetch", onFetch),
// self.addEventListener('push', onPush),
// self.addEventListener('notificationclick', onNotificationClick);
