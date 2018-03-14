---
title: solr-中文分词器ik-analyzer-solr5使用
name: solr-ik-analyzer
date: 2016-8-3 12:00
tags: [solr,ik-analyzer-solr5]
categories: [Solr]
---

* 目录
{:toc}

---

# Solr中文分词器ik-analyzer-solr5使用

## 1. 简介

**中文分词含义是将检索语句按照一定的规则进行拆分，便于检索输出。**如果对拆分的效果不满意，可以使用扩展词字典（**ext.dic**）或者停止词字典（**stopword.dic**）进行控制。

关于字典的需要根据不同行业规则来区分和维护，例如"的"在语句"张三的手机"，这里的"的"字并没有含义，而在"今天路上的的士很多"这句中，"的"字并不能加入到停止词中。

本篇文章将介绍solr里中文分词器**ik-analyzer-solr5**的使用和配置。

## 2. 前提条件

* solr5.3.1，点击[下载](http://archive.apache.org/dist/lucene/solr/5.3.1/solr-5.3.1.zip)
* jdk1.8，点击[下载](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* mysql数据库及测试数据
* 中文分词器ik-analyzer-solr5，点击[下载](https://github.com/wangjunneil/ik-analyzer-solr5)
* maven构建工具，点击[下载](http://maven.apache.org/download.cgi)

## 3. 构建ik-analyzer-solr5

下载的**ik-analyzer-solr5**分词器是适用于solr5版本以上的，如果使用旧版本的ik-analyzer分词器，则会出现"**java.lang.AbstractMethodError**"的异常。将克隆或者下载的ik-analyzer-solr5使用`maven install`编译后在target目录中生成**ik-analyzer-solr5-5.x.jar**的库文件，这里值得注意的是扩展词字典和停止词字典也在编译好的jar包中。

将编译好的**ik-analyzer-solr5-5.x.jar**文件拷贝到**$SOLR_HOME/server/solr-webapp/webapp/WEB-INF/lib**目录中，若需要编辑扩展词字典（**ext.dic**）和停止词字典（**stopword.dic**），可以将两个词典拖出来放到classpath中便于编辑。

## 4. 添加分词器类型

在对应core的配置目录中找到**schema.xml**文件，添加分词器类型：

```xml
<fieldType name="text_ik" class="solr.TextField">
    <analyzer type="index">
        <tokenizer class="org.wltea.analyzer.lucene.IKTokenizerFactory" useSmart="false" />
    </analyzer>
    <analyzer type="query">
        <tokenizer class="org.wltea.analyzer.lucene.IKTokenizerFactory" useSmart="true" />
    </analyzer>
</fieldType>
```

## 5. 用分词器配置字段

上述步骤添加好中文分词器类型text_ik之后，此时需要指定哪些模型检索字段需要使用分词类型，这里的配置如下：

```xml
<field name="productId" type="int" indexed="true" stored="true" required="true" multiValued="false" />
<field name="productName" type="text_ik" indexed="true" stored="true" required="true" multiValued="false" termVectors="true" />
<field name="productPrice" type="float" indexed="true" stored="true" required="true" multiValued="false" />
<field name="productCode" type="string" indexed="true" stored="true" required="true" multiValued="false" termVectors="true" />
<field name="createTime" type="date" indexed="true" stored="true" required="true" multiValued="false" />
```

由上面的配置可知，这里将索引的**productName**字段设置为中文分词类型，因为需要对产品名称进行模糊检索。

## 6. 启动solr服务器

这里需要注意的是测试的方式都是standlone方式，关于solrcloud模式已经和zookeeper的方式使用请参看其他文章。

```
[192] /Volumes/TOD/solr-5.3.1/bin $ ./solr start
 Waiting up to 30 seconds to see Solr running on port 8983 [/]
 Started Solr server on port 8983 (pid=10337). Happy searching!
```

启动好之后通过浏览器打开地址**[http://localhost:8983](http://localhost:8983)**进入solr控制台。

## 7. 中文分词验证

![solr-ik-1](http://ohdpyqlwy.bkt.clouddn.com/solr-ik-1.png)

将数据库的数据索引到solr中有多种方式，可以solrj也可以通过DIH，数据索引到solr服务器中使用控制台查询下索引到的数据如下：

![solr-ik-2](http://ohdpyqlwy.bkt.clouddn.com/solr-ik-2.png)

此时可以使用一条productName去测试分词器的效果，这里使用的是productId为10005的"**华为 P9 全网通 3GB+32GB版 流光金 移动联通电信4G手机 双卡双待**"产品，如下是分词效果：

![solr-ik-3](http://ohdpyqlwy.bkt.clouddn.com/solr-ik-3.png)

可以看出，上述的商品名称被切分成多个字和词组，这也就意味着检索条件中有任何上面的字或词组都会将此商品检索出来，这里使用"**p9**"做为关键词检索，如下：

![solr-ik-4](http://ohdpyqlwy.bkt.clouddn.com/solr-ik-4.png)

可以看出，"**p9**"做为检索条件已经被检索出来了，这里值得注意的是检索条件"**productName:p9**"，这样的solr语法是全量匹配，这里并没有使用类似于正则表达式的.号或者*号进行模糊查询，尽管可以这样做。如果对没有分词的productName进行这样的检索，是肯定检索不出的，必须使用全部文本匹配，这就是中文分词的效果。

这里还可以尝试下使用关键词"**32GB**"去检索，下面可以看出关键词"**32GB**"这个关键词有两个商品被索引了：

![solr-ik-5](http://ohdpyqlwy.bkt.clouddn.com/solr-ik-5.png)

## 8. 停止词与扩展词字典的使用

扩展词：**ext.dic**，希望被组合索引的词组纪录在ext.dic中避免被细粒度的索引
停止词：**stopword.dic**，希望不要索引的字或词可以记录在此文件中

**扩展词字典测试**

扩展词的详细意思是可以自己控制合并或者拆分的关键词，因为最后分词器的效果可能并不能达到你的要求，此时可以使用扩展词字典进行控制，这里还是拿商品id为10005的商品"**华为 P9 全网通 3GB+32GB版 流光金 移动联通电信4G手机 双卡双待**"进行测试，此时我们发现"**流光金**"这个词被分成了两个词"**流光**"和"**金**"，这里无论检索条件是"**流光**"或者"**金**"都能检索出此商品，粒度太细，需要控制下，必须检索条件是"**流光金**"全字才能检索到，这里把"**流光金**"这个词放到**classpath**的**ext.dic**扩展词字典中，如下：

```
# ext.dic
流光金
```

![solr-ik-6](http://ohdpyqlwy.bkt.clouddn.com/solr-ik-6.png)

从上面可知，我们配置的"**流光金**"被分词器使用了，这样检索条件是"**流光金**"的词也能检索出相关商品了。

**停止词字典测试**

```
# stopword.dic
流光
金
```

然后重新索引下数据，再使用此商品名称进行分词测试如下：

![solr-ik-7](http://ohdpyqlwy.bkt.clouddn.com/solr-ik-7.png)

配置停止词后可知，"**流光**"和"**金**"不被分词器分词了，不被分词也就意味着检索条件中若存在这两个关键词将不会被检索出来，必须输入"**流光金**"才能匹配到。