function onInstall(event) {
    console.log('[ServiceWorker] Install')
}

function onActivate(event) {
    console.log('[ServiceWorker] Activate')
}

function onFetch(event) {
    console.log('[ServiceWorker] Fetch')
}

var CACHE_VERSION = "V1.0.0";
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

self.addEventListener("install", onInstall),
self.addEventListener("activate", onActivate),
self.addEventListener("fetch", onFetch);
