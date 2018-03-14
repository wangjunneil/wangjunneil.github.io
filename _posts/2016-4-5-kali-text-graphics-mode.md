---
title: Kali linux中关于图形与文本模式切换配置
name: kali-text-graphics-mode
date: 2016-4-5
tags: [kali,文本模式]
categories: [Blackhat]
---


# Kali linux中关于图形与文本模式切换配置

默认的unix系统中切换文本和图形只需要修改`/etc/inittab`文件即可，但在kali中却没有这样的文件，关于在kali中切换文本与图形的方式有三种：

## 1. 快捷键切换

**文本模式**：`CTRL + ALT + F1`
**图形模式**：`CTRL + ALT + F7`

## 2. 修改grub文件

修改`/etc/default/grub`文件，将第8行的**GRUB_CMDLINE_LINUX_DEFAULT="quiet"**"修改为 **GRUB_CMDLINE_LINUX_DEFAULT="text"**，
保存后执行`update-grub`命令并重新启动即可。

## 3. 修改x11显示文件

修改`/etc/X11/default-display-manager`文件，里面只有一行**/usr/sbin/gdm3**，把其改成**false**为文本启动，还原回来即图形启动。