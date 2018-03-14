---
title: Nginx常用配置汇总
name: nginx-general-config
date: 2017-03-11
tags: [nginx]
categories: [Linux]
---

* 目录
{:toc}

---

# Nginx常用配置汇总

## 1. 反向代理简要配置

### 1.1. HTTP方式的代理转发配置

```
server {
    listen       80;
    server_name  www.example.cn;

    location / {
        proxy_set_header Host $host:80;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://192.168.1.199:8080;
    }
}
```

### 1.2 HTTPS方式的代理转发配置

```
server {
    listen       443;
    server_name  www.example.com;

    ssl on;
    ssl_certificate server.crt;
    ssl_certificate_key server.key;
    ssl_session_timeout 5m;

    location / {
        proxy_set_header Host $host:443;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass https://192.168.1.197:8443;
    }
}
```

## 2. 正向HTTP代理使用

**背景**：子网中存在两台服务器AB，服务器A可以连接到互联网，服务器B不能上网，服务器B需要使用服务器A中的nginx正向代理功能使其连接到互联网上。

### 2.1 配置正向代理

```
server {
    resolver 8.8.8.8;
    resolver_timeout 5s;

    listen 0.0.0.0:8080;

    location / {
        proxy_pass $scheme://$host$request_uri;
        proxy_set_header Host $http_host;

        proxy_buffers 256 4k;
        proxy_max_temp_file_size 0;

        proxy_connect_timeout 30;

        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 301 1h;
        proxy_cache_valid any 1m;
    }
}
```

### 2.2 客户端使用正向代理

**全局HTTP代理**

```shell
# 添加全局HTTP代理
export http_proxy="http://10.132.10.116:8080"

# 删除全局HTTP代理
unset http_proxy
```

**yum使用代理**

```shell
# 编辑yum.conf文件
vim /etc/yum.conf

# 底部添加
proxy = http://10.132.10.116:8080
```

> 据网络上文章所说，nginx的正向代理不支持HTTPS的方式

## 3. HTTPS证书生成

```shell
openssl genrsa -des3 -out server.key 1024
openssl req -new -key server.key -out server.csr
cp server.key server.key.org
openssl rsa -in server.key.org -out server.key
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

## 4. 代理缓存配置

### 4.1 创建缓存目录并授与权限

```shell
mkdir -p /usr/local/nginx/temp
chmod -R 755 /usr/local/nginx/temp
```

> 缓存目录的创建位置可以随意，但必须具有读写权限

### 4.2 利用缓存目录配置代理缓存

```
http {
    # levels=1:2 配置缓存空间有两层hash目录
    # keys_zone=cache_zone:50m 配置缓存的名称及缓存空间大小
    # inactive 设置缓存有效期，1d表示在1天时间内没有被访问则自动删除
    # max_size 硬盘缓存的最大大小
    proxy_cache_path /usr/local/nginx/cache levels=1:2 keys_zone=cache_one:50m inactive=1d max_size=10g;
    server {
        listen       80;
        server_name  www.testcache123.com;

        location / {
            proxy_cache cache_one; # 指定上面配置的缓存名称
            proxy_cache_valid 200 302 1h; # 200和302请求缓存1小时
            proxy_cache_valid 301 1d; # 301请求缓存1天
            proxy_cache_key $host$uri$is_args$args; # 缓存请求匹配的key
            expires 30d;

            proxy_set_header Host $host:80;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://www.wangjunneil.com;
        }
    }
}
```

## 5. 跨域请求配置

### 5.1 跨域消息头说明

|名称|含义|
|-------|
|Access-Control-Allow-Origin|授权那些地址或者域名可以访问|
|Access-Control-Allow-Credentials|是否响应与该请求可以暴露|
|Access-Control-Allow-Methods|指定运行请求的HTTP方法|

### 5.2 具体配置明细

在nginx中，若设置在http段内则对所有server都启用，设置在server段内则只对该server启用，设置在location段内则对该请求启用。

```
server {
    listen       80;
    server_name  vinny.cc;

    location / {
        # 跨域请求头
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Headers true;
        add_header Access-Control-Allow-Methods GET,POST,OPTIONS;

        proxy_set_header Host $host:80;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://localhost:8080;
        client_max_body_size    1000m;
    }
}
```

## 6. 负载均衡配置

### 6.1 简单的权重示例

```
upstream backend {
    server  192.168.1.197:80 backup;
    server  192.168.1.196:80 weight=1;
    server  192.168.1.197:80 weight=3;
    # ip_hash;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```

> Nginx自带的负载均衡策略有轮询（默认），权重和ip_hash，第三方的有fair和url_hash等配置方式。

### 6.2 负载参数说明

|名称|含义|
|---|---|
|down|表示当前server不参与负载|
|weight|默认为1，weight越大，负载的权重就越大，分发到的请求就越多|
|max_fails|允许请求失败的次数，默认为1，当超过最大次数时，返回proxy_next_upstream 模块定义的错误|
|fail_timeout|max_fails多少次失败后，暂停请求的时间|
|backup|其它所有的非backup机器down或者忙的时候，请求backup机器。所以这台机器压力会最轻


