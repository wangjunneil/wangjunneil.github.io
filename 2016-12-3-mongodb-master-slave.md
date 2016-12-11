---
title: 高可用的mongodb:master-slave配置
name: mongodb-master-slave
date: 2016-12-3
tags: [mongodb, mongodb集群, mongodb-master-slave]
categories: [Database]
---


* 目录
{:toc}


## 1. master-slave模式

主从模式可以避免单机故障，双机备份后，若主节点挂掉，从节点可以接替主节点继续服务。主节点数据的录入会实时同步到从节点上。

## 2. MongoDB的主从master-slave模式

### 2.1 环境准备

两台服务器，一台用作主节点，一台用作从节点，如下：

* 192.168.1.101 (主节点)
* 192.168.1.102 (从节点)

### 2.2 下载安装包并分别创建数据目录

从 MongoDB官网下载安装包，地址：[http://fastdl.mongodb.org/linux/mongodb-linux-x86_64-2.4.9.tgz](http://fastdl.mongodb.org/linux/mongodb-linux-x86_64-2.4.9.tgz)

分别上传到主从服务器中并解压，分别创建各自的数据目录，如下：

主节点数据目录：**/root/mongodb-linux-x86_64-2.4.9/data/master**
从节点数据目录：**/root/mongodb-linux-x86_64-2.4.9/data/slave**

> 数据目录可以随意创建，这里只是为了区分主从，也可以直接各自指定 **{MONGODB_HOME}/data**目录即可。

### 2.3 分别启动主从节点的mongodb

**启动主节点上（192.168.1.101）的 MongoDB**

```shell
./mongod --dbpath /root/mongodb-linux-x86_64-2.4.9/data/master --master
```

**启动从节点上（192.168.1.102）的 MongoDB**

```shell
./mongod --dbpath /root/mongodb-linux-x86_64-2.4.9/data/slave --slave --source 192.168.1.101:27017
```

**--master** 表明此节点是作为主节点使用，**--slave** 和 **--source** 表示节点是从节点且主节点的源地址是哪里。

> 主从的启动仔细观察日志可以看出是否启动成功，在从节点上可以使用命令`db.printReplicationInfo()`进行查看。

## 3 验证主从配置

### 3.1 数据同步测试

进入主节点的`mongodb`环境，创建一条数据

```shell
> ./mongo 192.168.1.101:27017
> use demo;
> db.post.insert({"title":"AAAAAA"});
> db.post.find();
{ "_id" : ObjectId("5284e5cb1f4eb215b2ecc463"), "title" : "AAAAAA" }
```

> 此时查看日志，发现新添加的数据已经同步到子节点上。

进入子节点的`mongodb`环境，查看主节点上创建的数据

```shell
> ./mongo 192.168.1.102:27017
> use demo;
> db.post.find();
{ "_id" : ObjectId("5284e5cb1f4eb215b2ecc463"), "title" : "AAAAAA" }
```

从子节点上可以看出，主节点上创建的任何数据都会实时同步到子节点上，这样主从模式基本就形成了。

### 3.2 故障转移测试

从节点上不允许插入数据，只允许读，插入数据时会提示 **no master** 错误。

关闭主节点后，从节点会不断尝试连接主节点，还是只读模式，并不能自动切换成主节点，

## 4. MongoDB主从模式结论

**MongoDB** 的主从配置很简单，主从模式只有数据同步没有**master**节点自动转移功能，当主节点不可用时，需要手动将从节点升级成master。

> 从节点手动升级为主节点：./mongod --dbpath /root/mongodb-linux-x86_64-2.4.9/data/slave --master



./mongod --dbpath /Volumes/TOD/mongodb-osx-x86_64-2.0.6/data/replset0 --replSet replse