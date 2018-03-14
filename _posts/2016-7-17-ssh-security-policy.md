---
title: linux上ssh服务安全策略的配置方法
name: ssh-security-policy
date: 2016-7-17
tags: [ssh,ssh配置,ssh安全策略,iptables]
categories: [Linux]
---

* 目录
{:toc}

---

# linux上ssh服务安全策略的配置方法

## 背景

当服务器准备开放某些服务或端口时，你不得不面对更大的安全风险，本篇将以常用的sshd服务为基准介绍当开启ssh服务时应该怎么做才能保证ssh远程连接的安全性，尽管是介绍ssh服务的，但可以举一反三到其他常规服务中。

## 基于ssh的配置文件的策略

```
# 端口号，可用多行开放多个端口号，修改成非22可直接规避入口
Port 4322

# 指定监听的IP地址，适用于多网卡/多IP情况，避免暴露多个连接地址
ListenAddress 192.168.1.198

# 禁止root用户登录，普通用户进入后建议使用su切换root或sudo进行工作
PermitRootlogin no

# 禁止空的密码登录
PermitEmptyPasswords no

# 仅允许SSHv2协议
Protocol 2

# 检查档案权限，不安全则禁止登录。如使用者的~/.ssh/authorized_keys权限为666，可能造成其他人可以盗用账号
StrictModes yes

# 修改或注释banner信息以迷惑扫描工具，banner信息会泄漏很多信息，操作系统、版本号、协议、服务关键字等
Banner /etc/issue.net

# 仅允许指定账号或用户组进行登录，对于同一账号，设置Allow和Deny，结果为Deny优先
AllowUsers <user1> <user2> <user3>
AllowGroups <group>
DenyUsers *
DenyGroups no-ssh

# 废除密码登录，改用证书登录的方式，关于如何使用证书登录请参看附录A
RSAAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile %h/.ssh/authorized_keys
PasswordAuthentication no
```

## 使用TCP wrappers限制来源IP

编辑`vi /etc/hosts.deny`文件，拒绝所有ssh登录的来源地址
```
ssh: ALL
```
编辑`vi /etc/hosts.allow`文件，仅允许192.168.1.150 192.168.1.181这两个IP地址可以访问ssh服务。
```
sshd: 192.168.1.150 192.168.1.181
```

## 基于iptables防火墙规则

使用iptables限制来源IP，下面规则仅允许192.168.1.150可以访问22端口，其他地址全部丢弃。

```shell
iptables -A INPUT -p tcp -m state --state NEW --source 192.168.1.150 --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j DROP
```

iptables除了可以限制来源IP，还可以在时间上进行控制，即在指定的时间内不能访问。下面的例子中使用/second、/minute、/hour或/day开关。

```shell
# 若用户输入错误的密码，锁定一分钟内不允许访问ssh服务，保证每隔用户一分钟只能尝试一次
iptables -A INPUT -p tcp -m state --syn --state NEW --dport 22 -m limit --limit 1/minute --limit-burst 1 -j ACCEPT
iptables -A INPUT -p tcp -m state --syn --state NEW --dport 22 -j DROP

# 只允许主机192.168.1.150可以访问ssh服务，在尝试三次失败登录后，iptables允许该主机每分钟尝试一次登录
iptables -A INPUT -p tcp -s 192.168.1.150 -m state --syn --state NEW --dport 22 -m limit --limit 1/minute --limit-burst 1 -j ACCEPT
iptables -A INPUT -p tcp -s 192.168.1.150 -m state --syn --state NEW --dport 22 -j DROP
```

## 基于ssh证书方式登录

不使用常规的用户名密码登录ssh服务，只允许ssh证书的登录，但记住仍然需要输入证书的密码，在生成证书时确保证书密码的可靠性。

### 1. 客户端生成私钥（id_rsa）和公钥（id_rsa.pub）文件

```shell
ssh-keygen -t rsa
```

### 2. 客户端上传公钥文件并添加至服务器authorized_keys中

```shell
scp -P 4322 ~/.ssh/id_rsa.pub zhangsan@192.168.1.110:/home/zhangsan
cat id_rsa.pub >> ~/.ssh/authorized_keys
```

### 3. 客户端通过私钥登录服务器

```shell
ssh -i ~/.ssh/id_rsa zhangsan@192.168.1.110
```