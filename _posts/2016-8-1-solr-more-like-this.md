---
title: solr-morelikethis相似度查询的使用说明
name: solr-more-like-this
date: 2016-8-1 12:00
tags: [solr,morelikethis,相似度查询]
categories: [Solr]
---

* 目录
{:toc}

---

# Solr-morelikethis相似度查询的使用说明

## 1. 简介

**solr**的**morelikethis**从字面的解释是"**更多的类似这个**"，常常用在关联查询上，使用上很简单，更多的是在solr查询语法上，**morelikethis**有两种实现方式，**MoreLikeThisHandler**和**SearchHandler**。

## 2. 使用

### 2.1 在需要使用相似度查询的字段上属性termVectors

在**schema.xml**中配置需要使用相似度查询的字段，在其增加"**termVectors=true**"的属性，这里在**productName**和**productCode**字段中增加，如下：

```xml
<field name="productId" type="int" indexed="true" stored="true" required="true" multiValued="false" />
<field name="productName" type="text_ik" indexed="true" stored="true" required="true" multiValued="false" termVectors="true" />
<field name="productPrice" type="float" indexed="true" stored="true" required="true" multiValued="false" />
<field name="productCode" type="string" indexed="true" stored="true" required="true" multiValued="false" termVectors="true" />
<field name="createTime" type="date" indexed="true" stored="true" required="true" multiValued="false" />
```

如何确定相似度字段，例如查询**productId**为**10005**的产品及其相似产品，那么就需要确定哪个属性做相似度，比如做了分词的商品名称、商品助记码或者商品关键字。**这里注意的是若是没有分词的字段是全量匹配**。

### 2.2 常用的morelikethis通用请求参数

现在不必理解这些参数，需要结合下面几个案例去理解。这里通用参数指的是**MoreLikeThisHandler**和**SearchHandler**都可以使用的。

|名称|含义|
|--|--|
|mlt.fl|指定需要查询的相似度字段，多个用逗号分隔（需要使用termVectors=”true”声明的字段）|
|mlt.mintf|最小分词频率，在单个文档中小于这个值的词将不用于相似判断|
|mlt.mindf|最小文档频率，所在文档的个数小于这个词将不用于相似判断|
|mlt.minwl|最小单词长度，小于此长度的字段都不做相似度查询|
|mlt.maxwl|最大单词长度，大于此长度的字段都不做相似度查询|

### 2.3 两种实现方式的使用

**SearchHandler**和**MoreLikeThisHandler**使用基本相同，**SearchHandler**使用的是原有的**select**方式检索数据，不需要配置什么，直接可以使用。而**MoreLikeThisHandler**则需要在**solrconfig.xml**中注册请求处理器，配置也很简单，将以下代码添加到**solrconfig.xml**中即可。

```xml
<requestHandler name="/mlt" class="solr.MoreLikeThisHandler"></requestHandler>
```

下面是两种方式请求相同数据的路径：

```
http://localhost:8983/solr/core/select?q=productId%3A10003&wt=json&indent=true&mlt=true&mlt.fl=productName

http://localhost:8983/solr/core/mlt?q=productId%3A10003&wt=json&indent=true&mlt=true&mlt.fl=productName
```

由上面可知，两种实现方式目前仅仅是请求的路径不一样，一个是"**/select**"，另外一个是"**/mlt**"的，返回的结果集是相同的，具体使用哪种方式还请自行实践。

## 3. 场景案例

```
# 根据productId查询单个商品并以productName为相似度字段检索出相关商品
http://localhost:8983/solr/core/mlt?q=productId%3A10003&wt=json&indent=true&mlt=true&mlt.fl=productName

# 根据productId查询单个商品并以productName和productCode为相似度字段检索出相关商品
http://localhost:8983/solr/core/mlt?q=productId%3A10003&wt=json&indent=true&mlt=true&mlt.fl=productName,productCode

# 根据productId查询单个商品并以productName为相似度字段检索出相关商品，条目数限定为5条
http://localhost:8983/solr/core/mlt?q=productId%3A10003&wt=json&indent=true&mlt=true&mlt.fl=productName&mlt.count=3
```

相似度检索数据，需要先定义需要做声明相似度的字段，这个字段可以是任何类型也可以是中文分词，根据不同参数控制检索的数据粒度，结合自己的业务筛选出合适的关联数据。