function onInstall(e) {
    e.waitUntil(caches.open(CACHE_NAME).then(e => {
        return e.addAll(URL_TO_CACHE).then(() => {
            console.log("SERVICE WORKER: Install completed")
        })
    }))
}

function onActivate(e) {
    console.log("[Serviceworker]", "Activating!", e);

    e.waitUntil(caches.keys().then(keyList => {
        return Promise.all(keyList.map(key => {
            if (key != CACHE_NAME) {
                console.log('[ServiceWorker] Removing old cache', key);
                return caches.delete(key);
            }
        }));
    }));
}

function onFetch(e) {
    e.respondWith(
        caches.match(e.request).then(resp => {
            // 缓存命中直接返回
            if (resp) {
                return resp;
            }

            var fetchRequest = e.request.clone();
            return fetch(fetchRequest).then(response => {
                // 检查是否收到无效的响应
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response || caches.match("/offline.html");
                }

                var responseToCache = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(e.request, responseToCache);
                });

                return response;
            })
            .catch (err => {
                return caches.match('/offline.html');
            });
        })
    )
}

var CACHE_VERSION = "V1.0.0";
var CACHE_NAME = CACHE_VERSION + ":sw-cache::";
var URL_TO_CACHE = [
    "/",
    "/offline.html",
    "/manifest.json",
    "/assets/jquery-1.9.1.min.js",
    "/assets/core.css",
    "/assets/header.png",
    "/assets/offline.gif",
    "/assets/search.png",
    "/assets/main.js",
    "/assets/hacker.jpg",
    "/assets/5-13050G31J7.gif",
    "/assets/clear.png"
];
// Service Worker 事件注册
self.addEventListener("install", onInstall), self.addEventListener("activate", onActivate), self.addEventListener("fetch", onFetch); 