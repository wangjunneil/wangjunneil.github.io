---
title: 使用gitbucker快速搭建git服务器
name: quick-build-gitbucker
date: 2017-10-30
tags: [git,gitlab,gitbucker]
categories: [Other]
---

* 目录
{:toc}

---

# 使用gitbucker快速搭建git服务器

## 介绍

[Gitbucker](https://gitbucket.github.io/) 是用Scala语言编写的开源git服务器，安装和使用非常简单。适合个人或者小型团队成员使用。

## 下载使用

下载地址：[https://github.com/gitbucket/gitbucket/releases](https://github.com/gitbucket/gitbucket/releases) (需要翻墙)

```shell
# 启动
java -jar gitbucket.war
```

## 访问地址

**Gitbucker** 启动后默认的端口是8080，登录的用户名密码都是 root。


![gitbucker](http://ohdpyqlwy.bkt.clouddn.com/screenshot-repository_viewer.png)

## 丰富特性

**Gitbucker** 除了具备基本的git服务器功能外，还提供了强大的插件系统，允许安装更多的插件以满足更多的项目要求。

![gitbucker](http://ohdpyqlwy.bkt.clouddn.com/screenshot-plugin_system.png)