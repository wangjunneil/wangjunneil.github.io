---
title: Telnet命令方式收发邮件
name: telnet-smtp-pop
date: 2015-12-08
tags: [telnet]
categories: [Linux]
---

# Telnet命令方式收发邮件

## Telnet收邮件

```
# telnet连接邮件服务器，默认端口110
> telnet pop3.qiye.163.com 110
# 邮件user命令后输入登录名称（不需要）
user xxx@163.com
# 邮件pass命令后输入登录密码
pass 12345678
# 邮件stat命令列出邮件总数和占用空间大小
stat
# 邮件list命令列出邮件中所有邮件，也可以使用uidl命令
list
# 邮件retr命令读取指定id的邮件
retr 312
# 邮件dele命令删除指定id邮件，quit后提交
dele 312
# 退出邮箱服务器
quit
```

## Telnet发邮件

```
# telnet连接邮件服务器，默认端口25
> telnet smtp.qiye.163.com 25
# 邮件ehlo访问命令
ehlo li
# 请求登录
auth login
# base64编码的用户名
anVuLndhbmdAwq1nY7hpbmEuY29tLmNu
# base64编码的用户密码
d2o0NzksNacx
# 邮件发自那里
mail from: <jun.wang@imgchina.com.cn>
＃ 邮件发给谁
rcpt to: <297489@qq.com>
# 邮件data命令输入内容
data
＃ 定义邮件消息头
Date:2015-12-6 21:40
To: 8888888@qq.com
Cc: 9999999@qq.com
Subject: a test
Content-Type: text/html
# 回车换行，输入正文
<h1>Hello</h1>
# 回车换行，输入点"."结束邮件正文输入
.
# quit退出
quit
```