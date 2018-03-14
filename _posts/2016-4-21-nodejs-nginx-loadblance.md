---
title: 使用nodejs模拟多server测试nginx负载均衡
name: nodejs-nginx-loadblance
date: 2016-4-21
tags: [nginx,nodejs,负载均衡]
categories: [Linux]
---

* 目录
{:toc}

---

# 使用nodejs模拟多server测试nginx负载均衡

## 测试的Server

首先创建一个`servers.js`的nodejs脚本文件，这个脚本文件将负责监听三个端口去模拟负载的WebServer服务器，然后启动`node servers.js`。

```js
var http = require('http');

function serve(ip, port) {
    http.createServer(function (req, resp) {
        resp.writeHead(200, {'Content-Type':'text/plain'});
        resp.end("There's no place like " + ip + ":" + port + "\n");
    }).listen(port, ip);
    console.log('Server running at http://' + ip + ':' + port + '/');
}
```

分别启动

```shell
// 模拟三台负载机器
serve('127.0.0.1', 9000);
serve('127.0.0.1', 9001);
serve('127.0.0.1', 9002);
```

## nginx的负载配置

```
# 定义upstream的server，请求将会发送到app_example的负载配置里
upstream app_example {
    # 使用最少连接的负载策略
    least_conn;
    server 127.0.0.1:9000; # nodejs server 1
    server 127.0.0.1:9001; # nodejs server 2
    server 127.0.0.1:9002; # nodejs server 3
}

server {
    listen 80;
    server_name example.com www.example.com;

    access_log /var/log/nginx/example.com-access.log;
    error_log /var/log/nginx/example.com-error.log error;

    location = /favicon.ico { log_not_found off; access_log off; }
    location = /robots.txt  { log_not_found off; access_log off; }

    # 搜索已存在的文件或目录，若不存在则跳转到@proxy的块里
    # location / {
    #   try_files $uri $uri/ @proxy;
    # }

    # location @proxy {
    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://app_example; # 定义upstream的别名
        proxy_redirect off;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## 配置域名

在上面配置了测试域名example.com和www.example.com，所以在本机测试需要在hosts文件中加上域名映射，如下：

```
127.0.0.1 example.com
127.0.0.1 www.example.com
```

## 模拟测试

使用浏览器打开 http://www.example.com 或者 http://example.com 进行测试，将会看见每次请求nginx将会分发请求到不同server中。