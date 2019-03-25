var CACHE_VERSION = "V1.1.0";
var CACHE_NAME = CACHE_VERSION + ":sw-cache::";
var URL_TO_CACHE = [
    "/",
    "/offline.html",
    "/manifest.json"
];

// --------------------------------------------------------------------

// 安装事件
self.addEventListener('install', e => {
    console.log("WORKER: Install completed");
});

// 激活事件
self.addEventListener('activate', e => {
    console.log('Service Worker Activate');
});

// 请求事件
self.addEventListener('fetch', e => {
    console.log(e.request.url);
});
