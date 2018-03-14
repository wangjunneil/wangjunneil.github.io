---
title: Linux中curl命令使用详解
name: linux-curl-command
date: 2015-11-22
tags: [curl]
categories: [Linux]
---

* 目录
{:toc}

---

# Linux中curl命令使用详解

## 介绍

**curl**是利用URL语法在命令行方式下工作的开源文件传输工具。它被广泛应用在Unix、多种Linux发行版中，并且有DOS和Win32、Win64下的移植版本。

## 使用

### 简单请求操作

```shell
# 请求地址并输出
curl http://www.baidu.com
# 请求地址输出并保存
curl -o baidu.html http://www.baidu.com
# 只显示出header信息
curl -I http://www.baidu.com
```

### 模拟GET请求

```shell
# <form method="GET" action="junk.cgi">
#   <input type=text name="birthyear">
#   <input type=submit name="press" value="OK">
# </form>

curl "http://www.wangjunneil.com/when/junk.cgi?birthyear=1905&press=OK"
```

### 模拟POST请求

```shell
# <form method="POST" action="junk.cgi">
#   <input type=text name="birthyear">
#   <input type=submit name="press" value=" OK ">
# </form>

curl --data "birthyear=1905&press=%20OK%20" http://www.wangjunneil.com/junk.cgi
# 若参数中存在特殊字符可以加上参数--data-urlencode自动编码，如空格%20
curl --data-urlencode "name=I am Daniel" http://www.wangjunneil.com
```

### 模拟上传文件

```shell
# <form method="POST" enctype='multipart/form-data' action="upload.cgi">
#   <input type=file name="upload"/>
#   <input type=submit name="press" value="OK"/>
# </form>

curl --form upload=@localfilename --form press=OK http://www.wangjunneil.com/upload.cgi
```

### 自定义HTTP消息头

```shell
# Referer
curl --referer http://www.baidu.com http://www.wangjunneil.com
# User Agent
curl --user-agent "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)" http://www.wangjunneil.com
# 自定义Header内容
curl --header "Host: www.wangjunneil.com" http://www.wangjunneil.com
# 自定义提交内容和内容类型
curl --data "<xml>" --header "Content-Type: text/xml"  --request PROPFIND url.com
# 增加cooke
curl --cookie "name=zhangsan" http://www.wangjunneil.com
```

### 其他一些使用

```shell
# 监控网页的响应时间
curl -o /dev/null -s -w "time_connect: %{time_connect}\ntime_starttransfer: %{time_starttransfer}\ntime_total: %{time_total}\n" http://www.baidu.com
# 监控站点可用性
curl -o /dev/null -s -w %{http_code} http://www.baidu.com
# 下载文件
curl -o ideaIU.dmg http://download-cf.jetbrains.com/idea/ideaIU-15.0.1-custom-jdk-bundled.dmg
＃ 断点续传文件
curl -c -# -o ideaIU.dmg http://download-cf.jetbrains.com/idea/ideaIU-15.0.1-custom-jdk-bundled.dmg
```