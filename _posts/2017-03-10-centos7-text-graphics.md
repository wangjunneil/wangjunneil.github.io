---
title: Centos7文本界面与图形界面的切换
name: centos7-text-graphics
date: 2017-03-10
tags: [centos7,文本模式,图形界面]
categories: [Linux]
---

* 目录
{:toc}

---

# Centos7文本界面与图形界面的切换

## 文本模式

```shell
systemctl set-default multi-user.target
```

## 图形模式

```shell
systemctl set-default graphical.target
```

> 使用命令`reboot`重启即可


