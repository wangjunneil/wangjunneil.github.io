---
title: 破解windows密码的几种常用方式
name: crack-windows-password
date: 2017-11-12
tags: [ophcrack,utilman]
categories: [Blackhat]
---

* 目录
{:toc}

---

# 破解windows密码的几种常用方式

## 1. 前提说明

以下三种方式破解windows是基于 **kali live usb** 的方式，即需要准备一个安装了kali系统的U盘。

## 2. 基于Ophcrack的猜解

### 2.1 U盘启动

接上安装kali系统U盘，重新引导并使用U盘系统启动

### 2.2 使用ophcrack

打开终端，输入命令`ophcrack`，点击ophcrack工具栏中 **load** 按钮，选择 **Encrypted SAM**，此时弹出选择目录的对话框，选择windows硬盘的 ++windows/system32/config++ 目录。

待读取SAM数据库后会显示出windows系统的用户列表及其 **hashcode** 值

### 2.3 在线破解hashcode

将读取到的hashcode复制，粘贴到在线破解NTLM的网站中去，可用的在线破解站点有：

[https://hashkiller.co.uk/ntlm-decrypter.aspx](https://hashkiller.co.uk/ntlm-decrypter.aspx)
[https://crackstation.net/code](https://crackstation.net/code)


## 3. 基于chntpw破解工具

### 3.1 U盘启动

接上安装kali系统U盘，重新引导并使用U盘系统启动

### 3.2 定位到SAM目录

打开终端，`cd`进入windows系统的SAM数据库目录（++windows/system32/config++ ）

### 3.3 使用chntpw工具

在SAM目录中，输入命令`chntpw -l SAM`读取windows系统用户列表，确定好用户后，输入命令`chntpw -u administrator SAM`进入交互模式，选择 **1** 清除目标用户密码。

拔出U盘，再次重新进入windows系统，此时清除的目标用户已经不需要密码即可登录。

## 4. 基于文件系统的替换

### 4.1 U盘启动

接上安装kali系统U盘，重新引导并使用U盘系统启动

### 4.2 定位到SYS目录

打开终端，`cd`进入windows系统的System32目录（++windows/system32++）

### 4.3 替换特殊文件

使用命令`mv Utilman.exe Utilman.exe.bak`将windows辅助程序进行备份，`cp cmd.exe Utilman.exe`复制一个命令行程序为辅助程序的名称，拔出U盘重新启动进入window登录界面。

### 4.4 打开命令行程序

在windows登录界面右下角，点击辅助程序即可打开windows命令行程序，使用命令`net user`查看当前用户，`net user vinny *`创建一个不带密码的用户，重启即可进入。