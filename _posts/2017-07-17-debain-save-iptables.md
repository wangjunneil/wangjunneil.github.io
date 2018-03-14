---
title: Debain防火墙规则保存
name: debain-save-iptables
date: 2017-07-17
tags: [iptables,防火墙规则]
categories: [Linux]
---

* 目录
{:toc}

---

# Debain防火墙规则保存

## 1. 背景

配置好防火墙规则后，为防止服务器重启导致配置的规则被清除，应该将防火墙规则进行文件保存，在启动时进行自动加载。

## 2. 步骤

## 2.1 保存规则

```shell
# 将现有防火墙规则保存到/etc/iptables文件中
iptables-save > /etc/iptables
```

## 2.2 启动文件

```shell
# 创建启动脚本文件
touch /etc/network/if-pre-up.d/iptables
# 赋予执行权限
chmod u+x /etc/network/if-pre-up.d/iptables
```

## 2.3 文件内容

```shell
# 编辑启动配置文件
vi /etc/network/if-pre-up.d/iptables

# 文件内容为还原保存的防火墙配置规则
#!/bin/sh
/sbin/iptables-restore < /etc/iptables
```


