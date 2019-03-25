// 安装事件
self.addEventListener('install', event => {
    console.log('Service Worker Install')
});

// 激活事件
self.addEventListener('activate', event => {
    console.log('Service Worker Activate')
});

// 请求事件
self.addEventListener('fetch', event => {
    console.log(event.request.url);
});
