---
title: solr-使用游标cursorMark高效率的翻页查询
name: solr-cursormark
date: 2016-8-3 12:00
tags: [solr,cursorMark]
categories: [Solr]
---

## 1. 背景
**solr** 中在做翻页查询时常常使用 start 和 row 的请求参数，当数据量少的时候没有问题，但数据量很大时常规的翻页将会变得很慢。solr4.7的版本引入了游标的概念解决此类问题。

使用游标进行翻页查询不需要任何配置，只需要在查询请求中结合 **cursorMark** 的参数，值得一提的是 **cursorMark** 需要结合sort参数才能使用，核心含义是在排序的结果集上进行游标翻页查询。具体的使用方式如下：

## 2. 使用start和row基本翻页查询方式

```
http://localhost:8983/solr/product/select?q=*%3A*&wt=json&indent=true
  &start=1
  &rows=10
```

![solr基本翻页](http://ohdpyqlwy.bkt.clouddn.com/solr-start-row.png)


## 3. 使用cursorMark和row进行游标翻页

```
http://localhost:8983/solr/product/select?q=*%3A*&wt=json&indent=true
  &sort=productId+desc
  &rows=10
  &cursorMark=*
```

![solr游标翻页](http://ohdpyqlwy.bkt.clouddn.com/solr-cursor-row.png)

## 4. 下一页游标翻页

```
http://solr.qicolor.cn/solr/product/select?q=*%3A*&wt=json&indent=true
  &sort=productId+desc
  &rows=10
  &cursorMark=AoEmMjAwMDA0
```

![solr游标下一页](http://ohdpyqlwy.bkt.clouddn.com/solr-cursor-next.png)
