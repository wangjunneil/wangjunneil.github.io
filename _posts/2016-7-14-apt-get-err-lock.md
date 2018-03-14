---
title: apt-get安装或更新时的错误Could not get lock /var/lib/dpkg/lock
name: apt-get-err-lock
date: 2016-7-14 12:00
tags: [apt-get]
categories: [Linux]
---


# apt-get安装或更新时的错误Could not get lock /var/lib/dpkg/lock

执行`apt-get install xxx`安装程序或者`apt-get upgrade`更新时出现以下错误：

```
Could not get lock /var/lib/dpkg/lock – open (11: Resource temporarily unavailable)
Unable to lock the administration directory (/var/lib/dpkg/), is another process using it?
```

**出现这种错误有两种原因及其解决方法：**

* 当前有进程正在占用资源

等到当前的apt进程执行完，直接kill掉会生成lock文件。

* 上次执行安装或者更新时被中断生成了lock文件

删除lock文件在此执行apt安装或更新，删除路径如下：

```shell
rm /var/cache/apt/archives/lock
rm /var/lib/dpkg/lock
```
