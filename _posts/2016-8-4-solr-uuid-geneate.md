---
title: solr-使用uuid类型自动生成主键id
name: solr-uuid-geneate
date: 2016-8-4 12:00
tags: [solr,uuid]
categories: [Solr]
---

**solr** 中`document`中 **id** 是唯一标识，通常会取自数据库中主键id，特殊情况需要solr自动生成uuid，使用solr自动生成的配置也很简单，具体如下：

## 1. 编辑schema.xml文件添加uuid类型及字段

```xml
<!-- 增加uuid类型声明 -->
<fieldType name="uuid" class="solr.UUIDField" indexed="true" />

<!-- 指定id字段为uuid类型 -->
<field name="id" type="uuid" indexed="true" stored="true" multiValued="false" required="true" />
```

## 2. 编辑solrconfig.xml文件

```xml
<!-- 编辑或添加UpdateRequestHandler -->
<requestHandler name="/update" class="solr.UpdateRequestHandler">
     <lst name="defaults">
          <str name="update.chain">dispup</str>
     </lst>
</requestHandler>

<!-- 添加update.chain的UUID更新策略 -->
<updateRequestProcessorChain name="dispup">
     <processor class="solr.UUIDUpdateProcessorFactory">
          <str name="fieldName">id</str>
     </processor>
     <processor class="solr.LogUpdateProcessorFactory" />
     <processor class="solr.DistributedUpdateProcessorFactory" />
     <processor class="solr.RunUpdateProcessorFactory" />
</updateRequestProcessorChain>
```

按照上面的步骤配置好后，在添加或更新`document`时不需要制定 **id** 即可自动生成。