---
title: Kali系统中使用smbclient访问windows共享目录
name: use-smbclient-in-kali
date: 2016-11-16
tags: [smbclient, kali, smb]
categories: [blackhat]
---

在类似与**kali**系统的**Linux**环境中，若要访问windows共享目录，即smb协议的目录共享机制，可以使用`smbclient`工具进行访问。

当然除了可以使用`smbclient`命令行的方式，还可以直接在资源管理器中使用**smb**协议进行访问，如`smb://192.168.1.22`。

# smbclient的使用方法

```shell
# 列出目标主机所有共享目录
smbclient -L 192.168.1.22 -U administrator

# 访问目标主机指定的共享目录
smbclient //192.168.1.22/test -U administrator

# 带密码的访问目标主机指定共享目录
smbclient //192.168.1.198/test -U administrator 123321
```

