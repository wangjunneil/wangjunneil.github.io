---
title: 通过搜索引擎批量获取email地址信息
name: theharvester-get-email
date: 2016-5-3
tags: [kali,theharvester]
categories: [Blackhat]
---


# 通过搜索引擎批量获取email地址信息

theharvester是批量获取互联网上用户的email地址，简单小巧实用，通过指定邮箱域名和数据源就可以批量抓取指定公司或企业的邮箱地址。

**具体使用如下**

```shell
# 在google搜索引擎中批量搜索以qq.com的邮箱地址，默认搜索100条
#
# -d 公司或企业域名
# -b 数据源，可用的有google、bing、linkedin、twitter等等
theharvester -d qq.com -b google

# 在google搜索引擎中批量搜索gmail地址，搜索500条记录为止
#
# -l 条目数
theharvester -d gmail.com -l 500 -b google

#  在google中搜索qq.com的域名邮箱地址并保存到a.xml文件中
#
# -f 结果集保存到指定文件，支持xml和html
theharvester -d qq.com -b google -f a.xml

# 更多配置使用请参看帮助文档
theharvester -h
```

关于数据源还是google的多、速度快、准确，当然你需要跨过天朝大门才能使用，theharvester不支持百度。