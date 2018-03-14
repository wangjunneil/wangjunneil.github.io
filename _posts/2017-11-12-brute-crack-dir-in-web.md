---
title: 几种暴力破解web服务器目录的方式
name: brute-crack-dir-in-web
date: 2017-11-12
tags: [暴力破解,brute]
categories: [Blackhat]
---

* 目录
{:toc}

---

# 几种暴力破解web服务器目录的方式

## 1. dirb

```shell
dir http://xxx.xxx.xxx
```

> 词典路径 /usr/share/dirb/wordlists

## 2. dirbuster

```shell
dirbuster
```
> `dirbuster`是图形化的界面，默认词典路径 /usr/share/dirbuster/wordlists


## 3. metasploit

```shell
msf > use auxiliary/scanner/http/dir_scanner
```

## 4. dirsearch

```shell
git clone https://github.com/maurosoria/dirsearch
```