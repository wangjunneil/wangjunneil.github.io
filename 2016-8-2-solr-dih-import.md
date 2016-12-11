---
title: solr-dih增量与全量导入配置详解
name: solr-dih-import
date: 2016-8-2 12:00
tags: [solr,DataImportHandler,dih]
categories: [Solr]
---

* 目录
{:toc}


## 1. 背景简介

**solr** 对于数据的索引常常使用 solrj 或者 dih（DataImportHandler） 的方式索引数据，本篇文章将详细说明如何使用 DIH 的方式进行数据库数据索引的配置操作。

## 2. 前提条件

1. 使用的是solr5.3.1版本
2. 由于使用的是solr5的版本，所以jdk需要1.7或者以上的版本
3. 准备好mysql数据库及其测试数据


## 3. 配置步骤

### 3.1 配置依赖管理

在 **$SOLR_HOME/dist** 目录中找到 solr-dataimporthandler-5.3.1.jar 和 solr-dataimporthandler-extras-5.3.1.jar两个文件，拷贝到 **$SOLR_HOME/server/solr-webapp/webapp/WEB-INF/lib** 目录中，数据库驱动文件，如mysql的 mysql-connector-java-5.1.18-bin.jar 也需要拷贝。

### 3.2 添加 DIH 处理器

编辑 **solrconfig.xml** 文件，添加 DIH 处理器和数据库相关配置

```xml
<requestHandler name="/dataimport" class="org.apache.solr.handler.dataimport.DataImportHandler">
    <lst name="defaults">
        <str name="config">db-data-config.xml</str>
        <lst name="datasource">
            <str name="driver">com.mysql.jdbc.Driver</str>
            <str name="url">jdbc:mysql://127.0.0.1:3306/solr</str>
            <str name="user">root</str>
            <str name="password">root</str>
        </lst>
    </lst>
</requestHandler>
```

### 3.3 创建 db-data-config.xml

在 **$SOLR_HOME//server/solr/{CORE_NAME}/conf** 目录中创建 db-data-config.xml 文件，db-data-config.xml 文件是配置数据库连接信息以及具体的增量与全量导入的规则。

```xml
<dataConfig>
    <!-- <dataSource driver="com.mysql.jdbc.Driver" url="jdbc:mysql://localhost:3306/solr" user="root" password="root"/> -->
    <document>
        <entity name="product" query="select * from product"
            deltaQuery="select product_id from product where create_time > '${dataimporter.last_index_time}'"
            deltaImportQuery="select * from product where product_id = '${dih.delta.product_id}'">
            <field column="product_id" name="productId" />
            <field column="product_name" name="productName" />
            <field column="product_price" name="productPrice" />
            <field column="product_code" name="productCode" />
            <field column="create_time" name="createTime" />
        </entity>
    </document>
</dataConfig>
```

### 3.4 编辑 schema.xml 文件

schema.xml 文件主要定义索引字段的类型与存储结构，其中字段应与在 db-data-config.xml 中查询的一致。这里需要注意的是在下面的 productName 字段，这里配置的是 text_ik 类型，text_ik 类型是用于中文分词的，若还未涉及到中文分词，这里可以给其string类型即可。

```xml
<field name="productId" type="int" indexed="true" stored="true" required="true" multiValued="false" />
<field name="productName" type="text_ik" indexed="true" stored="true" required="true" multiValued="false" termVectors="true" />
<field name="productPrice" type="float" indexed="true" stored="true" required="true" multiValued="false" />
<field name="productCode" type="string" indexed="true" stored="true" required="true" multiValued="false" termVectors="true" />
<field name="createTime" type="date" indexed="true" stored="true" required="true" multiValued="false" />
```

## 4. 启动验证

启动好 solr 后可以进入对应 core 的 DataImport 界面，点击 execute 完成导入操作。

**浏览器方式执行**

```
http://localhost:8080/solr/dataimport?command=full-import           全量导入
http://localhost:8080/solr/dataimport?command=status                查看导入状态
http://localhost:8080/solr/dataimport?command=reload-config         刷新DIH配置
http://localhost:8080/solr/dataimport?command=abort                 终止正在进行的导入
```

***

## 附录 A

全量索引的代价过大，一般初全量始化后使用的是增量索引。
如果需要对某个模型进行增量索引，则该模型必须具有更新时间的字段，如updatetime，类型为timestamp。此字段用于维护纪录的更新时间。

有了更新的时间字段，solr才可以判断哪些数据是最新的。
solr本身有一个默认值last_index_time，纪录的是最后一次full import或者delta import的时间，这个值存储在dataimport.properties文件中。
solr使用last_index_time与数据库模型里的updatetime进行比较，在last_index_time之后的数据是需要增量索引的，具体可以看如下两行：

```xml
<entity name="product" query="select * from product"
    deltaQuery="select product_id from product where update_time > '${dataimporter.last_index_time}'"
    deltaImportQuery="select * from product where product_id = '${dih.delta.product_id}'">
    <field column="product_id" name="productId" />
    ......
</entity>
```

增量索引必知的几个关键字含义：

deltaQuery 增量索引查询主键ID 注意这个只能返回ID字段
deltaImportQuery 增量索引查询导入的数据
deletedPkQuery 增量索引删除主键ID查询 注意这个只能返回ID字段

从上面的描述再结合配置可知，首先从deltaQuery指定的sql查询出需要增量导入的id，然后根据deltaImportQuery指定的sql语句返回这些id的数据。
核心的思想是：通过内置变量${dih.delta.id}和${dataimporter.last_index_time}来纪录本次要索引的id和最后一次索引时间

## 附录 B

定时索引可以使用curl、wget结合corn的方式做到。但solr官方也有其定时的实现，详细文档请参考 http://wiki.apache.org/solr/DataImportHandler#Scheduling，下面将说明下如何使用solr自带的定时索引功能。

首先需要准备好定时的相关依赖库，可以在 http://code.google.com/p/solr-data-import-scheduler/ 里下载，不能翻墙的请点击直接下载。下载好之后放到 $SOLR_HOME/server/solr-webapp/webapp/WEB-INF/lib 目录中。

在web.xml中添加监听器，编辑 $SOLR_HOME/server/solr-webapp/webapp/WEB-INF/web.xml 文件，在其中添加如下监听配置：

```xml
<listener>
    <listener-class>org.apache.solr.handler.dataimport.scheduler.ApplicationListener</listener-class>
</listener>
```

在 $SOLR_HOME/server/solr 目录新建一个文件夹conf，这里的conf并不是core里的conf目录，应该是一个全局的调度配置目录。创建好之后在里面创建一个 dataimport.properties 文件用于配置具体的调度信息。里面的内容可以参考solr wiki上的，之前下载的jar包里也存在此文件，可以使用压缩工具打开，直接拷贝到 $SOLR_HOME/server/solr/conf 目录。具体的配置内容如下：

```
#################################################
#                                               #
#       dataimport scheduler properties         #
#                                               #
#################################################

#  是否启用定时同步，1是启用，非1是禁用
syncEnabled=1

# 指定哪个core需要使用此规则，可以配置多个用逗号分隔
syncCores=core

#  solr服务器的ip地址或者域名，如果为空则缺省使用localhost
server=localhost

#  solr服务器的端口号，若为空则缺省为80
port=8983

#  当前solr应用上下文的名称
webapp=solr

#  请求增量更新的URL地址
params=/dataimport?command=delta-import&clean=false&commit=true

#  定时执行的时间间隔，单位为分钟，若为空则默认30
interval=3
```

至此定时增量更新已配置完成，重新启动solr，观察是否有错误，没有任何问题的话，查看日志，每个3分钟会定时增量更新。

## 附录 C

经常在使用dih数据库导入时经常会出现sql的错误，此时定位问题常常很消耗时间，有时我们需要直接到日志中查看执行的sql语句方便用于丁文问题，此时可以通过log4jdbc实现此功能，具体步骤如下：

1. 下载log4jdbc包放到$SOLR_HOME/server/solr-webapp/webapp/WEB-INF/lib目录中
2. 在solrconfig.xml或者db-data-config.xml文件中进行配置

```xml
<requestHandler name="/dataimport" class="org.apache.solr.handler.dataimport.DataImportHandler">
    <lst name="defaults">
      <str name="config">db-data-config.xml</str>
      <lst name="datasource">
         <!--
         <str name="driver">com.mysql.jdbc.Driver</str>
         <str name="url">jdbc:mysql://127.0.0.1:3306/solr</str>
         -->
         <str name="driver">net.sf.log4jdbc.DriverSpy</str>
         <str name="url">jdbc:log4jdbc:mysql://127.0.0.1:3306/solr</str>
         <str name="user">root</str>
         <str name="password">root</str>
      </lst>
    </lst>
</requestHandler>
```

此时执行的sql日志输出如下

```
1441106 INFO  (qtp987405879-18) [   x:core] j.sqltiming select product_id from product where create_time > '2016-07-12 03:21:29' 
 {executed in 1 msec}
```