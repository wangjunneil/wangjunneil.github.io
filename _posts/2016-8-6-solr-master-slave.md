---
title: solr-master-slave主从模式的配置实现
name: solr-master-slave
date: 2016-8-6 12:00
tags: [solr,master-slave]
categories: [Solr]
---

## 1. 主从模式 Master-Slave

**master-slave** 模式在很多系统中都会有，**solr** 同样也具有这样的功能，主从模式是一种冗余的部署方式，具有容灾备份的特性。也可以利用此特性实现读写分离降低资源消耗，即 **master** 用于写，** slave** 用于读。

## 2. Solr的主从配置

**solr** 的主从 **master-slave** 配置很简单，主要配置master服务器solr和slave服务器solr的 **solrconfig.xml** 文件即可，具体如下：


**Master Solr**

```xml
<requestHandler name="/replication" class="solr.ReplicationHandler">
    <lst name="master">
        <str name="replicateAfter">commit</str>
        <str name="replicateAfter">startup</str>
	<!-- 同步索引并同步配置指定文件 -->
        <str name="confFiles">schema.xml,stopwords.txt</str>
	<!-- HTTP授权用户名 -->
        <str name="httpBasicAuthUser">admin</str>
	<!-- HTTP授权密码 -->
        <str name="httpBasicAuthPassword">123321</str>
    </lst>
</requestHandler>
```

**Slave Solr**

```xml
<requestHandler name="/replication" class="solr.ReplicationHandler">
    <lst name="slave">
	<!-- master服务器core的url地址 -->
	<str name="masterUrl">http://192.168.1.198:8983/solr/core</str>
	<!-- 每个60秒同步一次 -->
       	<str name="pollInterval">00:00:60</str>
	<!-- 压缩机制，internal内网，external外网 -->
       	<str name="compression">internal</str>
       	<str name="httpConnTimeout">50000</str>
       	<str name="httpReadTimeout">500000</str>
	<!-- 验证信息，同master -->
       	<str name="httpBasicAuthUser">admin</str>
       	<str name="httpBasicAuthPassword">123321</str>
	</lst>
</requestHandler>
```

从 **slave** 的配置可以看出，其实就是通过http请求去做备份和恢复索引的操作，加上定时、授权和压缩传输实现 **master-slave** 机制。

> solr4.0版本的 **solrcloud** 上不推荐使用此证方式，同步复制索引的机制将是 **push-style**。