---
title: Shell执行时弹出xterm子进程终端窗口
name: shell-pop-xterm
date: 2017-1-9
tags: [shell,xtrem]
categories: [Linux]
---


* 目录
{:toc}

# Shell执行时弹出xterm子进程终端窗口

## 介绍

不知道是否在看美国大片时，黑客执行某些工具，整个屏幕会时不时弹出多个终端窗口在执行，看似很酷的样子，其实实现很简单，每弹出的窗口都是作为一个子进程在运行，下面介绍实现方案。

## 示例脚本

```shell
#!/bin/bash

# 弹出位置定义
TOPLEFT="-geometry 90x13+0+0"
TOPRIGHT="-geometry 83x26-0+0"
BOTTOMLEFT="-geometry 90x24+0-0"
BOTTOMRIGHT="-geometry 75x12-0-0"
TOPLEFTBIG="-geometry 91x42+0+0"
TOPRIGHTBIG="-geometry 83x26-0+0"

# 左上角弹出执行ping的命令
xterm -hold -title "test title" $TOPLEFT -bg "#000000" -fg "#FFFFFF" -e "ping www.baidu.com" &

# 右上角弹出执行下载的命令
xterm -hold -title "test title" $TOPRIGHT -bg "#000000" -fg "#FFFFFF" -e "wget http://nginx.org/download/nginx-1.10.2.tar.gz"
```

> xterm是阻塞式运行，即地一个xterm不执行完不会执行第二个，可以加上`&`号让其后台执行，但如果两个xterm都加上`&`号则主shell进行会立即关闭。

## 参数解释

|名称|含义|
|---|---|
|-hold|开启资源等待模式。shell执行完成不会销毁窗口|
|-title|定义终端标题|
|-geometry|大小和坐标定义|
|-bg|背景色定义|
|-fg|前景色定义|
|-e|需要执行的任务|