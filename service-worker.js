var CACHE_VERSION = "V1.1.0";
var CACHE_NAME = CACHE_VERSION + ":sw-cache::";
var URL_TO_CACHE = [
    "/",
    "/offline.html",
    "/manifest.json",
    "/assets/jquery-1.9.1.min.js",
    "/assets/core.css",
    "/assets/js/nav.js",
    "/assets/js/zepto.min.js",
    "/assets/header.png",
    "/assets/offline.gif",
    "/assets/search.png",
    "/assets/main.js",
    "/assets/hacker.png",
    "/assets/5-13050G31J7.gif",
    "/assets/clear.png",
    "/assets/icons/icon-144x144.png",
    "/assets/favicon.ico",
    "/assets/clear.png"
];

// --------------------------------------------------------------------

// 安装事件
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (e) {
            return e.addAll(URL_TO_CACHE).then(function () {
                console.log("WORKER: Install completed")
            })
        })
        .then(self.skipWaiting())
    );
});

// 激活事件
self.addEventListener('activate', e => {
    console.log('Service Worker Activate')
});

// 请求事件
self.addEventListener('fetch', e => {
    console.log(e.request.url);
});
