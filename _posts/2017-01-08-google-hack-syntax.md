---
title: Google Hack 语法收集
name: google-hack-syntax
date: 2017-1-8
tags: [google,hack语法,搜索语法]
categories: [Blackhat]
---


* 目录
{:toc}

# Google Hack 语法收集

## 搜索语法

|名称|含义|
|----|----|
|intext|网页中的正文内容中的某个字符做为搜索条件|
|intitle|搜索网页标题中是否有我们所要找的字符|
|cache|关于某些内容的缓存|
|define|搜索某个词语的定义|
|filetype|搜索指定类型的文件|
|inf|查找指定站点的一些基本信息|
|inurl|搜索指定的字符是否存在于URL中|
|site|返回指定站点信息|

## 查找示例

### 查找后台地址

```
site:example.com intext:管理|后台|登陆|用户名|密码|验证码|系统|帐号
site:example.com inurl:login/admin/manage/manager/admin_login/login_admin/system/boss/master
site:example.com intitle:管理|后台|登陆|
```

### 查找上传漏洞

```
site:example.com inurl:file
site:example.com inurl:load
```

### 查找注入点

```
site:example.com inurl:php?id=
```

### 查找编辑器页面

```
site:example.com inurl:fck
site:example.com inurl:ewebeditor
```

### 查找重要文件

```
site:example.com inurl:robots.txt
site:example.com filetype:mdb
site:example.com filetype:ini
site:example.com inurl:txt
site:example.com filetype:php
site:example.com filetype:asp
```