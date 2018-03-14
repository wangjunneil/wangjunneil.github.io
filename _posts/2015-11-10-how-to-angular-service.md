---
title: Angular服务定义与使用
name: how-to-angular-service
date: 2015-11-10
tags: [angular,angular服务]
categories: [Web]
---

* 目录
{:toc}

---

# Angular服务定义与使用

## 服务介绍

Angular服务提供应用整个生命周期内保持数据的方法，可以在多个控制器中进行通信，保持数据的一致性。服务是单例的且是延迟加载的。

## 注册服务

```js
var myApp = angular.module("myApp", []);

// 服务注册
myApp.factory("UserService", function($http) {
    var userService = {};

    userService.findAll = function() {
        console.log("userService.findAll");
        // 请求所有会员数据
    };

    userService.findById = function(userId) {
        console.log("userService.findById %s", userId);
        //  根据会员userId的请求数据
    };

    return userService;
});
```

## 使用服务

```js
// 服务使用
myApp.controller("ServiceController", function($scope, UserService) {
    UserService.findAll();
    UserService.findById("1001");
});
```

> 此时创建的UserService服务可以在多个控制器Controller里共用，只需要把服务在创建控制器时注入进即可使用

## 重构注册服务代码

将注册服务的通用请求进行封装，减少冗余代码

```js
// 服务注册
myApp.factory("UserService", function($http) {
    var rootUrl = "http://www.xxx.com/";

    var runUserRequest = function(userId, path) {
        // 通用的请求
        return $http({});
    }

    return {
        findAll : function() {
            console.log("userService.findAll");
            return runUserRequest(null, "findAll");
        },
        findById : function(userId) {
            console.log("userService.findById %s", userId);
            return runUserRequest("userId", "findById");
        }
    };
});
```

## 创建服务的5种方式

### 1. factory()

最常用的方式，上述代码就是factory创建服务的方式

### 2. service()

使用service()可以注册一个带构造函数的服务，允许我们为服务对象注册一个构造函数

```js
// 带构造函数的服务对象
var userService = function($http) {
    this.findAll = function() { console.log("userService.findAll"); };
    this.findById = function(userId) { console.log("userService.findById %s", userId); };
}

// 使用angular对象的service()方法
myApp.service("UserService", userService);
```

### 3. constant()

将一个已存在的变量注册为服务，在其他控制器中使用

```js
var myApp = angular.module("myApp", []);
myApp.constant("apiKey", "123456");
```

### 4. value()

将一个已存在的变量注册为服务，在其他控制器中使用

```js
var myApp = angular.module("myApp", []);
myApp.value("apiKey", "123456");
```

constant()和value()区别，常量constant可以注入带配置函数中，而值value()不行，如下：

```js
var myApp = angular.module("myApp", []);
myApp.constant("apiKey", "123456")
    .config(function(apiKey) {
        // 可以正常获取到apiKey
    })
    .value("token", "654321")
    .config(function(token) {
        // 异常
    });
```