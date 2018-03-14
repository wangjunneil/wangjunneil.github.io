---
title: 使用mimipenguin工具在Linux系统中dump出明文密码
name: dump-password-linux
date: 2017-11-12
tags: [mimipenguin]
categories: [Blackhat]
---

* 目录
{:toc}

---

# 使用mimipenguin工具在Linux系统中dump出明文密码

## 1. 原理

**mimipenguin** 使用内存计算的技术，读取内存中的凭证信息，linux系统在运行中会将用户名和密码以明文的方式保存在内存中。

## 3. 下载

```shell
git clone https://github.com/huntergregal/mimipenguin.git
```

## 4. 使用

在目标机器直接运行`mimipenguin`命令，如下：

```shell
# shell
chmod u+x mimipenguin.py
./mimipenguin.sh

# python
python3 ./mimipenguin.py
```

