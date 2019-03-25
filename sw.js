function onInstall(event) {
    console.log('[ServiceWorker] Install')
}

function onActivate(event) {
    console.log('[ServiceWorker] Activate')
}

function onFetch(event) {
    console.log('[ServiceWorker] Fetch')
}

self.addEventListener("install", onInstall),
self.addEventListener("activate", onActivate),
self.addEventListener("fetch", onFetch);
