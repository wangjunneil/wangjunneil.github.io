---
title: Linux个人常用命令汇总收集（不断更新）
name: linux-skill-gather
date: 2017-07-23
tags: [linux,command]
categories: [Linux]
---

* 目录
{:toc}

---

# Linux个人常用命令汇总

## 查看端口被谁占用

```shell
lsof -i:8080
```

## 递归删除指定文件

```shell
find . -name "*.bak" -exec rm {} \;
find . -name "*.c" | xargs rm -rf;
```

## 内存cache占用大

使用`free -m`时会发现内存的**cache**段缓存的过多，导致内存不够用，可以使用以下命令进行清空。

```shell
shell> free -m
             total       used       free     shared    buffers     cached
Mem:         15888      15226        661        248        624       5123
-/+ buffers/cache:       9479       6408
Swap:          499          0        499
```

```shell
sync;
sync;
sync;
echo 3 > /proc/sys/vm/drop_caches
```

> 此命令有风险，会破坏内存中存储的数据，尤其不要在Oracle服务器中使用
