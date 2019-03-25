var CACHE_NAME = 'my-site-cache-v1';
var URL_TO_CACHE = [
    '/',
    '/offline.html',
    '/manifest.json',
    '/assets/jquery-1.9.1.min.js'
];

// --------------------------------------------------------------------

// 安装事件
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(URL_TO_CACHE);
        })
    );
});

// 激活事件
self.addEventListener('activate', function(event) {
    console.log('Service Worker Activate');
});

// 请求事件
self.addEventListener('fetch', function(event) {
    console.log(event.request.url);
});
