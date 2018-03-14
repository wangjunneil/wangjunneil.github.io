---
title: Linux中关于find命令全收集参考
name: linux-find-command
date: 2017-1-3
tags: [linux,find]
categories: [Linux]
---


* 目录
{:toc}

# Linux中关于find命令全收集参考

## 忽略大小写查找文件

```shell
find -iname "HelloWorld.java"
```

## 找到文件并执行命令

```shell
find -iname "HelloWorld.java" -exec md5sum {} \;
```

## 相反匹配

```shell
find -maxdepth 1 -not -iname "HelloWorld.java"
```

## 查找空文件（0字节）

```shell
find ~ -empty
```

## 查找5个最大文件

```shell
find . -type f -exec ls -s {} \; | sort -n -r | head -5
```

## 查找5个最小的文件

```shell
find . -type f -exec ls -s {} \; | sort -n  | head -5
```

## 查找所有的目录

```shell
find . -type d
```

## 查找所有的一般文件

```shell
find . -type f
```

## 查找所有的隐藏文件

```shell
find . -type f -name ".*"
```

## 查找所有的隐藏目录

```shell
find -type d -name ".*"
```

## 查找比指定文件大的文件

```shell
find ~ -size +100M
```

## 查找比指定文件小的文件

```shell
find ~ -size -100M
```

## 查找符合给定大小的文件

```shell
find ~ -size 100M
```

## 用find命令删除大型打包文件

```shell
find / -type f -name *.zip -size +100M -exec rm -i {} \;"
```