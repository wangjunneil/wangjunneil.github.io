---
title: 简单的几个命令快速创建http服务器的方式
name: http-server-ways
date: 2017-10-10
tags: [python,http服务器]
categories: [Linux]
---

* 目录
{:toc}

---

# 简单的几个命令快速创建http服务器的方式

```shell
python2 -m SimpleHTTPServer 8000
python3 -m http.server 8000
php -S 0.0.0.0:80000
ruby -rwebrick -e "WEBrick::HTTPServer.new(:Port => 8000, :DocumentRoot => Dir.pwd).start"
```