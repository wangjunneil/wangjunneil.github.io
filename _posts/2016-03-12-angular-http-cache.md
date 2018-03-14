---
title: Angular中缓存的简单备注使用
name: angular-http-cache
date: 2016-03-12
tags: [angular]
categories: [Web]
---

# Angular中缓存的简单备注使用

## 介绍

缓存是一个组件，它可以透明的存储数据，以便未来可以更快的服务于请求。缓存解决了服务请求越多，整体系统性能提升的越多。每种系统或多或少的存在各种缓存实现，angular也有自己的缓存实现。

## angular中缓存的基本使用

```js
// 使用$cacheFactory创建自定义缓存对象
// 第一个参数必选为缓存的Id，第二个参数capacity指定缓存的最大容积
var cache = $cacheFactory('userCache', {'capacity' : 20});
cache.put("name", "Evan");

// 输出缓存对象
console.log(cache.get('name'));
```

## $http请求中的缓存实现

```js
// $http中使用缓存的方式
$http({ method: 'GET', url: '/api/data.json', cache: true });
$http.get('/api/user.json', { cache: true });

// http请求的缓存Id默认为$http，可以通过$cacheFactory对象取出来
var cache = $cacheFactory('$http');
// http请求每个缓存内容的key为请求的url
var data = cache.get('http://www.wangjunneil.com/api/data.json');

// 自定义http缓存对象
var myHttpCache = $cacheFactory('myHttpCache', {'capacity' : 1000});
$http({ method: 'GET', url: '/api/data.json', cache: myHttpCache });
$http.get('/api/user.json', { cache: myHttpCache });

// 为http请求设置全局统一的默认缓存
angular.module('myApp', []).config(function($httpProvider) {
    $httpProvider.defaults.cache = $cacheFactory('myHttpCache', {capacity: 1000});
});
```