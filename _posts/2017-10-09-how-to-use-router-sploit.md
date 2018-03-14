---
title: 路由器漏洞检测与破解工具Routersploit
name: how-to-use-router-sploit
date: 2017-10-09
tags: [路由器,暴力破解]
categories: [Blackhat]
---

* 目录
{:toc}

---

# 路由器漏洞检测与破解工具Routersploit

## 1. 说明介绍

**Routersploit** 是一款针对路由器漏洞进行破解的工具，**使用面很窄**，另外还自带了暴力破解模块。

## 2. 如何下载

```shell
git clone https://github.com/reverse-shell/routersploit
```

## 3. 怎么更新

```shell
git pull
```

## 4. 包含模块

* scanners **检查目标设备是否存在可利用的安全漏洞**
* creds **针对网络服务器的登陆认证口令进行暴力破解**
* exploits **识别目标的漏洞后对漏洞进行利用实现提权**

## 5. 使用方式

**Routersploit** 的使用方式类似与 `metasploit`，属于交互式运行方式，大体为"选择模块"-"设置参数"-"执行攻击"。

### 5.1 路由器漏洞使用

```shell
rsf > use scanners/<tab> # 列出支持的路由器攻击列表
rsf > use scanners/autopwn # 遍历路由器列表进行攻击
rsf > show options # 查看选项
rsf > set target 192.168.1.1 # 设置参数
rsf > run # 执行
```

> 上面只是查找目标路由器是否存在特定的漏洞，若存在可以使用 **exploits** 模块进行漏洞攻击。

### 5.2 暴力破解的使用

支持http、ftp、ssh、telnet、snmp，自带了缺省的密码词典。

```shell
rsf > use creds/<tab> # 列出所有支持暴力破解的协议
```
