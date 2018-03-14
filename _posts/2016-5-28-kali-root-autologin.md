---
title: kali中设置root用户自动登录
name: kali-root-autologin
date: 2016-5-28
tags: [kali]
categories: [Blackhat]
---

# kali中设置root用户自动登录

kali中默认使用的是root用户，因为系统中大部分工具都需要具有root权限才可以执行，每每我们使用的也大部分是root用户，是否可以在每次进入系统时不要输入root用户名和密码，可以让我们很快的进入系统。

编辑`vi /etc/gdm3/daemon.conf`文件，找到**AutomaticLoginEnable**和**AutomaticLogin**属性，将其注释去掉即可。

```
[daemon]
# Enabling automatic login
  AutomaticLoginEnable = true
  AutomaticLogin = root
```

现在重启kali，将不会再提示你输入用户名和密码，默认自动以root账户登录。