---
title: linux中数据恢复foremost和安全删除wipe工具使用
name: linux-foremost-wipe
date: 2016-5-8
tags: [foremost,wipe,数据恢复]
categories: [Linux]
---

# linux中数据恢复foremost和安全删除wipe工具使用

**foremost**是linux上的一个数据恢复工具，支持多种类型的文件恢复，可以对U盘、硬盘或镜像文件进行数据恢复操作。**wipe**是linux系统中删除的工具，使用**wipe**删除文件或者目录则很难使用一些数据恢复工具进行恢复操作。

## 数据恢复操作

```shell
# 查看U盘盘符
fdisk -l

# 恢复U盘中图片数据数据
foremost -t jpg -i /dev/sdb1

# 恢复U盘中多个类型的文件
foremost -v -T -t doc,pdf,jpg -i /dev/sdb1 -o ~/recover

# 使用配置文件指定要恢复的类型
# foremost.conf 指定文件类型，去除对应注释即可指定要恢复的类型
foremost -v -c /etc/foremost.conf -i /dev/sdb1 -o ~/recover

# 从镜像文件中恢复数据
foremost -v -t doc,png -i /home/chidge/image.dd -o ~/recover
```

## 数据安全删除

```shell
# 删除文件
wipe -i -f -q a.png

# 指定擦除次数的删除
wipe -i -Q 5 a.png

# 删除目录
wipe -rcf aaa/
```

关于数据恢复流程，恢复本机文件直接使用命令指定盘符后恢复即可，如何恢复非本机数据。正常的做法是在目标系统上对需要恢复的盘符进行镜像操作，然后使用工具对此镜像文件进行恢复操作。windows系统中可以使用untroiso等工具，linux系统中可以使用dd命令，如`dd if=/dev/sdb1/ of=/home/chidge/image.dd`。