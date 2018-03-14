---
title: solr-suggest检索建议配置说明
name: solr-suggest
date: 2016-8-14 12:00
tags: [solr,suggest]
categories: [Solr]
---

## 1. 简介

**solr** 的搜索建议是 **solr** 基本的功能之一，它提供类似于单词联想的功能，以友好的方式提供用户的搜索感觉。

## 2. 利弊

 **solr** 的 **suggest** 功能有利有弊，且大多数情况下弊大于利，特别是在数据量非常大的情况下，使用 **suggest** 时由于需要重建字典启动时间可能会很长。另外搜索建议依赖于拼写检查组件的功能，拼写检查可以单独做为一个功能使用，而 **suggest** 则不可以，必须结合拼写组件一起使用。

## 3. 前提

配置 **suggest** 之前，需要确定输入源，比如商品的名称、分类的名称或者型号等等，这里使用的是商品助记码 `productCode` 类型是 `string`，建议的输入源不推荐使用复杂的类型。

## 4. 方式

 **suggest** 的配置方式有两种，一种是 **主库索引**，另一种是 **词库索引**。

1. 主库索引存在的建议词，即数据库模型中某个字段。
2. 使用自定义的词库作为建议词，所谓自定义词库就是需要使用文本维护好需要检索的关键词，放在对应 **core** 的 **conf** 目录即可。

## 5. 配置

下面使用自定义词库的方式去做 **suggest** 功能，首先需要准备好词库，如下的 **suggest.txt** 文件。

```
# This is a sample dictionary file.
茅台飞天酒53度500ml
52度全兴·全民开窖500ml
法国进口红酒拉菲尚品波尔多干红葡萄酒
比利时督威/杜威duvel啤酒\t2.0 
人头马（Remy Martin）洋酒诚印特优香槟干邑白兰地 
比利时舒弗/舒佛Lachouffe啤酒
五粮液股份公司1995专卖店酒52度整箱装
水井坊臻酿八號52度500ml单瓶装
比利时啤酒进口啤酒福佳白啤酒\t3.0 
德国进口Wurenbacher瓦伦丁小麦啤酒
比利时进口精酿啤酒Hoegaarden
```

### 5.1 修改solrconfig.xml配置文件增加对suggest的配置

```xml
<searchComponent class="solr.SpellCheckComponent" name="suggest">
    <lst name="spellchecker">
        <str name="name">suggest</str>
        <str name="classname">org.apache.solr.spelling.suggest.Suggester</str>
        <str name="lookupImpl">org.apache.solr.spelling.suggest.tst.TSTLookup</str>
	<!-- 基于schema.xml的目标索引字段 -->
        <str name="field">productCode</str>
	<!-- 限制一些不常用的词出现，值越大过滤的越多，导致的结果越少 -->
        <float name="threshold">0.005</float>
        <!--
        自定义词库字典的配置，使用自定义词库时将注释去除
        <str name="sourceLocation">suggest.txt</str>
        <str name="spellcheckIndexDir">spellchecker</str>
        -->
        <str name="comparatorClass">freq</str>
        <str name="buildOnOptimize">true</str>
        <str name="buildOnCommit">true</str>
        <!-- <str name="sourceLocation">american-english</str> -->
    </lst>
</searchComponent>
<requestHandler class="org.apache.solr.handler.component.SearchHandler" name="/suggest">
    <lst name="defaults">
        <str name="spellcheck">true</str>
        <str name="spellcheck.dictionary">suggest</str>
        <str name="spellcheck.onlyMorePopular">true</str>
        <str name="spellcheck.count">5</str>
        <str name="spellcheck.collate">true</str>
    </lst>
    <arr name="components">
        <str>suggest</str>
    </arr>
</requestHandler>
```

### 5.2 对应的schema.xml文件定义

```xml
<field name="productId" type="int" indexed="true" stored="true" required="true" multiValued="false" /> 
<field name="productName" type="text_ik" indexed="true" stored="true" required="true" multiValued="false" termVectors="true" /> 
<field name="productPrice" type="currency" indexed="true" stored="true" required="true" multiValued="false" /> 
<field name="productCode" type="string" indexed="true" stored="true" required="true" multiValued="false" termVectors="true" /> 
<field name="createTime" type="date" indexed="true" stored="true" required="true" multiValued="false" /> 
```

## 6. 测试

> 配置好后重新启动 **solr** 容器，首次启动需要使用 `suggest/?spellcheck.build=true` 来创建 **spellcheck** 索引。

打开浏览器进入 **solr** 管理界面进行 **suggest** 功能的验证操作。

![solr-suggest](http://ohdpyqlwy.bkt.clouddn.com/solr-suggest.png)
