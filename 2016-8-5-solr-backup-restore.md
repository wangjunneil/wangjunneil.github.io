---
title: solr-索引迁移备份与恢复的配置与操作
name: solr-backup-restore
date: 2016-8-5 12:00
tags: [solr,backup-restore,索引备份]
categories: [Solr]
---

**solr** 在索引数据时，若索引数据丢失，数据量少的时候完全可以重新建立一次索引。但当索引数据量很大时，重建索引是个非常耗时和有风险的过程。**solr** 的索引往往像其他数据库或系统一样，做好备份操作尤为重要，本篇将简单的叙述如何通过 `replication`进行索引备份和恢复的操作。

## solr备份索引数据

备份索引数据需要先编辑对应的 **solrconfig.xml** 文件，在其中修改或添加 `Replication Handler` 的请求处理，具体如下：

```xml
<requestHandler name="/replication" class="solr.ReplicationHandler">
    <lst>
        <str name="replicateAfter">commit</str>
        <str name="replicateAfter">startup</str>
        <str name="confFiles">schema.xml,stopwords.txt</str>
    </lst>
</requestHandler>
```

配置并重启后，通过浏览器执行备份操作，备份请求地址 [http://localhost:8983/solr/core/replication?command=backup](http://localhost:8983/solr/core/replication?command=backup)，行结果若状态为OK，则表示备份成功。

备份成功后将会在原有 **core** 的 **data** 目录下生成类似于 `snapshot.20160717045436117` 的目录，此目录就是备份出来的索引库，妥善保存即可。

## solr恢复索引数据

**solr** 的索引恢复不需要配置或者请求地址，纯手工操作，主要步骤如下：

1. 停止当前solr服务器
2. 复制上述索引目录如 `snapshot.20160717045436117` 到对应 **core** 的 **data** 目录下，并重命名为 **index**
3. 启动solr服务器即可