---
title: github中fork、watch和star的含义以及如何在网页中引用
name: github-fork-watch-star
date: 2016-01-11
tags: [github]
categories: [Other]
---

# Github中fork、watch和star的含义以及如何在网页中引用

## 介绍

github很早注册的帐号一直没有怎么用，源码的存储一直使用自己的私有仓库，发现不主流。看见一些国外博客可以在网页中引入仓库源码的状态，于是查了些资料，做个备注。

## 问题

### 什么是fork？

fork的意思是你觉得别人的源码库比较好，希望自己改造一下使用，于是你从别人的代码库复制一份到自己的仓库中，此时你复制的库是完全独立的，当然你也可以”pull request”向原始库进行提交合并请求，前提是别人允许你这样做。

### 什么是watch？

watch就是关注的意思，当你watch一个原始代码库时，别人做了提交操作，可以给你及时的通知。

### 什么是star？

star的意思是收藏，watch是关注，与watch的区别是你不会有新的通知。

## Github中的按钮组如何嵌入的网页中？

```html
<!-- 参数user和repo需要换成自己的 -->
<iframe src="https://ghbtns.com/github-btn.html?user=twbs&repo=bootstrap&type=fork&count=true"
frameborder="0" scrolling="0" width="170px" height="20px"></iframe>
```

```html
<!-- 参数user和repo需要换成自己的 -->
<iframe src="https://ghbtns.com/github-btn.html?user=twbs&repo=bootstrap&type=watch&count=true&v=2"
  frameborder="0" scrolling="0" width="170px" height="20px"></iframe>
```

## 连接参数说明

```
# 必选参数
user  Github的用户名
repo  Github的仓库名称
type  按钮类型：watch,fork,或者follow

# 可选参数
count 是否显示watch或者fork的次数，缺省true
size  使用小按钮还是大按钮图标，缺省large
```