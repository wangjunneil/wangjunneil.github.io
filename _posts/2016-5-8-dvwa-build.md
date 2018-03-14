---
title: 本地渗透测试平台DVWA的搭建步骤
name: dvwa-build
date: 2016-5-8
tags: [kali,dvwa]
categories: [Blackhat]
---

* 目录
{:toc}

---

# 本地渗透测试平台DVWA的搭建步骤

## 1. 介绍

**[DVWA(Damn Vulnerable Web Application)](https://github.com/RandomStorm/DVWA)** 是一个基于php/mysql架构的测试漏洞平台，它的主要目标是帮助安全测试人员在合法的情况下测试漏洞，帮助web开发人员更好的理解和解决web中各种各样的漏洞防范措施。DVWA的目的是用一种直观的表现形式去练习一些最常见的安全漏洞。

> **警告**
> DVWA是易于受到攻击的web测试应用，不要将其上传到公网服务器中，这样别人很容易就能入侵你的服务器系统。

## 2. 下载安装包

**DVWA**的代码目前托管在Github中，可以使用Git克隆或者直接点击[下载](https://github.com/RandomStorm/DVWA)下来。

## 3. 创建数据库

这里使用mysql作为数据库载体，在数据库中创建DVWA的数据库

```shell
mysql> create database dvwa DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
Query OK, 1 row affected (0.00 sec)
```

## 4. 修改DVWA配置文件

```
# vi ./config/config.inc.php
$_DVWA[ 'db_user' ] = 'root';
$_DVWA[ 'db_password' ] = 'root';
$_DVWA[ 'db_database' ] = 'dvwa';
```

## 5. 申请google的reCAPTCHA并配置

这一步可以省略，毕竟需要翻墙，如果你不希望在后面测试图片验证码等操作，可以不申请google的验证码。

点击申请[https://www.google.com/recaptcha/admin/create](https://www.google.com/recaptcha/admin/create)，申请完之后需要将google验证码的公钥和私钥配置到dvwa中。

```
# vi ./config/config.inc.php

# ReCAPTCHA settings
#   Used for the 'Insecure CAPTCHA' module
#   You'll need to generate your own keys at: https://www.google.com/recaptcha/admin/create
$_DVWA[ 'recaptcha_public_key' ]  = '6LfHHh8TAAAAAL6tNpcT5ltvHbtmAYL-OqWtzDMi';
$_DVWA[ 'recaptcha_private_key' ] = '6LfHHh8TAAAAAAl8kIgwIsPj-5uKcxaD9MzRWCNn';
```

## 6. 放置到web服务器中

由于**DVWA**是基于php实现的web应用，所以需要使用web服务器做为容器启动，可以直接放到apache的程序目录中，并且给该目录赋权限`chmod -R 777 /var/html/www/dvwa`，然后启动apache。

## 7. 登陆进DVWA配置

打开浏览器访问[http://localhost:8888/setup.php](http://localhost:8888/setup.php)，然后点击页面下部的"**Create / Reset Database**"按钮。

## 8. 登陆进DVWA

登录地址是[http://localhost:8888/login.php](http://localhost:8888/login.php)，默认用户名密码**admin/password**。

![dvwa-install-1](http://ohdpyqlwy.bkt.clouddn.com/dvwa-1.png)

![dvwa-install-2](http://ohdpyqlwy.bkt.clouddn.com/dvwa-2.png)

另外除了本地搭建渗透测试平台，也可以使用在线渗透测试平台，如：[http://attack.samsclass.info/](http://attack.samsclass.info/)