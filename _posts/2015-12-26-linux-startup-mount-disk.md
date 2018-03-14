---
title: linux启动挂载分区设定
name: linux-startup-mount-disk
date: 2015-12-26
tags: [mount]
categories: [Linux]
---

# Linux启动挂载分区设定

## 查看和设定分区Label

```shell
fdisk -l # 查看分区
e2label /dev/xvdb1 # 查看需要挂载的分区label
e2label /dev/xvdb1 bosyun # 没有label就设置一个
```

## 编辑fstab配置文件

修改/etc/fstab文件，把分区的label挂载到本地磁盘的/bosyun目录中

```
LABEL=bosyun /bosyun ext3 defaults 1 2
```