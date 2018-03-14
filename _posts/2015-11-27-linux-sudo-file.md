---
title: Linux下is not in the sudoers file解决方法
name: linux-sudo-file
date: 2015-11-27
tags: [sudo]
categories: [Linux]
---

* 目录
{:toc}

---

# Linux下is not in the sudoers file解决方法

## 背景

当我们需要执行root权限的命令时，通常会在命令前使用"**sudo ifconfig**"，有时会出现以下错误：

```shell
evan@kali-evan:~$ sudo ifconfig
[sudo] password for evan:
evan is not in the sudoers file.  This incident will be reported.
```

## 解决步骤

### 1. 编辑sudo配置文件

```shell
# 切换当期用户到root用户（会提示输入root密码），或者你需要找到服务器root的管理人员
evan@kali-evan:~$ su - root
# 使用命令"visudo"打开sudo文件或者直接定位到文件打开"vi /etc/sudoers"
root@kali-evan:~# visudo
```

### 2. sudo增加用户配置

在**sudoers**文件中找到"**#User privilege specification**"节点，在此节点配置用户的权限，具体如下：

```
# User privilege specification
root    ALL=(ALL:ALL) ALL
evan    ALL=(ALL:ALL) ALL
```

这里的evan就是用户登录名，保存推出即可正常使用sudo命令

### 3. 生成环境下的配置

在生成环境中需要控制非root用户的命令权限，在为用户开通sudo的时候控制可以访问某些命令

定义命令别名：

```
Cmnd_Alias NETWORKING = /sbin/route, /sbin/ifconfig, /bin/ping, /sbin/dhclient , /usr/bin/net, /sbin/iptables, /usr/bin/rfcomm, /usr/bin/wvdial, /sbin/iwconfig , /sbin/mii-tool
```

然后设置用户或者组可以sudo执行的命令

```
# User privilege specification
root    ALL=(ALL:ALL) ALL
evan    ALL=NETWORKING ALL
```
