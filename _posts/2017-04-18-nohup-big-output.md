---
title: Nohup后台启动不输出及文件过大的问题
name: nohup-big-output
date: 2017-04-18
tags: [nohup,重定向]
categories: [Linux]
---

* 目录
{:toc}

---

# Nohup后台启动不输出及文件过大的问题

## 1. 背景

在Linux中常常使用**nohup**的方式启动程序，目的是当关闭终端时程序能自由的后台执行，**nohup**启动会将程序输出信息进行保持到**nohup.out**文件中，久而久之此文件会过于庞大，且程序有自己的日志系统，所以**nohup**的纪录往往是多余且没有效率的。

## 1. 重定向概念

* 0 标准输入（默认）
* 1 标准输出
* 2 错误输出

**将错误信息输出到error.log文件中**
```shell
nohup ./start.sh 2>error.log
```

**将错误信息重定向到标准输出上**
```shell
nohup ./start.sh 2>&1
```

## 2. 无底洞/dev/null文件

**/dev/null**可以比喻为Linux系统的垃圾桶，任何重定向到此的信息都会被丢掉。

**标准信息和错误信息都不纪录**

```shell
nohup ./start.sh 1>/dev./null 2>/dev/null
```

**将错误重定向到标准输出再重定向到/dev/null**

```shell
nohup ./start.sh 2>&1
```

## 3. nohup的正常用法

**标准信息丢弃，错误信息纪录到error.log文件**

```shell
nohup ./start.sh >/dev/null 2>error.log &
```

**标准信息和错误信息都丢弃**

```shell
nohup ./start.sh >/dev/null 2>&1 &
```


