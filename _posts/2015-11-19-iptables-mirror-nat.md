---
title: 通过iptables实现外网端口映射内网程序访问
name: iptables-mirror-nat
date: 2015-11-19
tags: [iptables]
categories: [Linux]
---

* 目录
{:toc}

---

# 通过iptables实现外网端口映射内网程序访问

## 背景

内网有一台oracle数据库，每次对oracle数据库操作不得不先进入外网机，然后从外网机跳入内网机进行oracle数据库的操作，针对于一些数据库管理软件也无法直接进行连接使用，现在使用iptables解决此问题。

## 环境

两台服务器AB，Oracle数据库安装在服务器B中，端口1521

服务器A 外网地址：122.56.122.18 内网地址：192.168.1.110
服务器B 内网地址：192.168.1.115

## 目的

通过TCP协议外网映射端口51521映射到内网服务器B中1521端口中，实现端口转发功能以供外网访问

## 步骤

### 1. 清除防火墙规则

停止iptables服务，清除已有规则

```shell
/etc/init.d/iptables stop
# 清除iptables已有规则
iptables -F
iptables -X
iptables -Z
```

### 2. 开启转发功能

编辑/etc/sysctl.conf文件，开启iptables转发（FORWARD）功能（默认是没有开启的）

```
vi /etc/sysctl.conf
net.ipv4.ip_forward = 1 # 默认是0
```

### 3. 使配置立即生效

```shell
# 或者执行命令 "echo 1 > /proc/sys/net/ipv4/ip_forward" 使其立即生效
# 注意这样操作服务器重启后需要重写配置
sysctl -p
```

### 4. 加入转发规则

```shell
iptables -t nat -A PREROUTING --dst 122.56.122.18 -p tcp --dport 51521 -j DNAT --to-destination 192.168.1.115:1521
iptables -t nat -A POSTROUTING --dst 192.168.1.115 -p tcp --dport 1521 -j SNAT --to-source 192.168.1.110
iptables -A FORWARD -o eth0 -d 192.168.1.115 -p tcp --dport 1521 -j ACCEPT
iptables -A FORWARD -i eth0 -s 192.168.1.115 -p tcp --sport 1521 -j ACCEPT
```

### 5. 保存路由规则

```shell
/etc/init.d/iptables save
```

### 6. 重启防火墙完成配置

```shell
/etc/init.d/iptables start
```

> 举一反三：使用unix中的iptables可以实现类似于路由器的端口转发，如果需要本机端口映射本机端口的配置应该如何写，下面规则实现本机端口80端口转发到本机8080端口，本机443端口转发到本机8443端口，应该是
> **iptables -t nat -A PREROUTING -p tcp –dport 80 -j REDIRECT –to-port 8080**
> **iptables -t nat -A PREROUTING -p tcp –dport 443 -j REDIRECT –to-port 8443**