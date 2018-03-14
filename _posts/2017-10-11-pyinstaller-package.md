---
title: Pyinstaller打包python应用
name: pyinstaller-package
date: 2017-10-11
tags: [pyinstaller,python打包]
categories: [Python]
---

* 目录
{:toc}

---

# Pyinstaller打包python应用

## 打包参数

|参数|说明|
|-|-|
|**-w**|直接打包会带调试窗口，使用-w参数可以进行屏蔽|
|**-C**|使用调试界面，与-w参数相反，缺省|
|**-F**|打包成独立的exe文件|
|**-D**|与-F相反，生成多个以来文件，缺省|
|**-p**|搜索模块路径|
|**-i**|改变生产的exe图标|

## 使用方法

```shell
pyinstaller -w main.py
pyinstaller -w -F main.py
pyinstaller -w -F -p [绝对路径] main.py
pyinstaller -w -F -i main.ico -p [绝对路径] main.py
```