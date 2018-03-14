---
title: kali下windows远程桌面工具rdesktop的使用方法
name: kali-tool-rdesktop
date: 2016-5-12
tags: [kali,rdesktop]
categories: [Blackhat]
---

# kali下windows远程桌面工具rdesktop的使用方法

在linux中如何远程连接到windows的3389远程桌面，**rdesktop**是个不错的选择，**rdesktop**是命令行操作，简单方便。

## 使用

```shell
# 最简单的使用方式
rdesktop 192.168.1.198

# 指定凭证直接登录
# -u 用户名
# -p 用户密码
rdesktop 192.168.1.198 -u administrator -p 123321

# 指定显示分辨率大小
# -g 指定分辨率
rdesktop 192.168.1.198 -u administrator -p 123321 -g 640*480

# -f 全屏
rdesktop 192.168.1.198 -u administrator -p 123321 -f

# 共享本机目录到远程服务器中
# -r 启用共享，可以共享的有磁盘、打印机、声音和粘贴板等等
rdesktop 192.168.1.198 -u administrator -p 123321 -r disk:floppy=/root

# 共享剪切板
rdesktop 192.168.1.198 -u administrator -p 123321 -r clipboard:PRIMARYCLIPBOARD
```

更多的使用方式请直接参看帮助文档`rdesktop -h`