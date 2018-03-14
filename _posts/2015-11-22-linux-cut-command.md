---
title: Linux中cut命令使用详解
name: linux-cut-command
date: 2015-11-22
tags: [cut]
categories: [Linux]
---

* 目录
{:toc}

---

# Linux中cut命令使用详解

## 介绍

**cut**是一个选取命令，就是将一段数据经过分析，取出我们想要的。一般来说，选取信息通常是针对“行”来进行分析的，并不是整篇信息分析的。

## 格式

```
cut [-bn] [file]
cut [-c] [file]
cut [-df] [file]
```

## 参数解释

```
-b : 以字节为单位进行分割。这些字节位置将忽略多字节字符边界，除非也指定了 -n 标志。
-c : 以字符为单位进行分割。
-d : 自定义分隔符，默认为制表符。
-f : 与-d一起使用，指定显示哪个区域。
```

## 案例详解

```shell
# 以who的输出为案例
wangjun[192] /Volumes/TOD/download $ who
wangjun  console  Nov 20 18:39
wangjun  ttys000  Nov 22 20:03

# 截取每一行第4个字节
wangjun[192] /Volumes/TOD/download $ who | cut -b 4
g
g

# 截取每一行第4个和第7个字节
wangjun[192] /Volumes/TOD/download $ who | cut -b 4,7
gn
gn

# 截取每一行第1到第7个字节
wangjun[192] /Volumes/TOD/download $ who | cut -b 1-7
wangjun
wangjun

# 截取每一行第1个字节和第5到第第7个字节
wangjun[192] /Volumes/TOD/download $ who | cut -b 1,5-7
wjun
wjun

# 截取每一行从第7个字节开始一直到最后
wangjun[192] /Volumes/TOD/download $ who | cut -b 7-
n  console  Nov 20 18:39
n  ttys000  Nov 22 20:03

# 以空格为分隔符取第1块区域
wangjun[192] /Volumes/TOD/download $ who | cut -f1 -d " "
wangjun
wangjun

# 以空格为分隔符取第3块区域（第2块区域是空格）
wangjun[192] /Volumes/TOD/download $ who | cut -f3 -d " "
console
ttys000

# 以冒号为分隔符取第一块区域
wangjun[192] /Volumes/TOD/download $ cat /etc/passwd | cut -f1 -d ":"

# 查看访问量排名前10的ip地址
# 查看access.log文件 | 以空格取第1块内容 | 自然排序 | 去重 | 排序 | 取前10条
cat access.log | cut -f1 -d " " | sort | uniq -c | sort -k 1 -n -r | head -10
# 查看访问量排名前10的url
cat access.log | cut -f4 -d " " | sort | uniq -c | sort -k 1 -n -r | head -10
```