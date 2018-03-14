---
title: 高可用的mongodb:副本集replica set配置
name: mongodb-replica
date: 2016-12-9
tags: [mongodb, mongodb集群, mongodb-replset]
categories: [Database]
---


* 目录
{:toc}


## 1. 介绍
[上一篇文章](https://wangjun.bid/2016/12/mongodb-master-slave/)介绍了 **mongodb** 的master-slave模式及其配置方式，但 **mongodb** 官方已经不建议使用此模式，替代方案采用的是副本集（**Replica Set**）模式。

**master-slave**模式其实是单副本配置，没有很好的扩展性和容错性。而 **Replica Set** 具有多个副本保证了应用的高可用，即使一个副本挂掉还是有其他副本可以继续服务。副本集中的各个副本相互间通过心跳检测，当检测到主服务器中断后，会在内部自行进行选举一台新的主服务器。

## 2. 准备

三台服务器，分别用做主节点、备节点和仲裁节点，如下：

* 192.168.1.101 (主节点)
* 192.168.1.102 (备节点)
* 192.168.1.103 (仲裁节点)

主备节点用于数据存储，仲裁节点不存储数据，只用做选举。

## 3. 配置

### 3.1 创建数据目录

**mongodb** 的数据存储通常会存在指定的数据盘符中，这也这意味着并不会直接把数据目录放在 **mongodb** 的 **data** 目录里，所以这里专门创建数据存储目录。

```shell
# 192.168.1.101主节点数据目录
mkdir -p /data/mongodb/master

# 192.168.1.102备节点数据目录
mkdir -p /data/mongodb/slave

# 192.168.1.103仲裁节点数据目录
mkdir -p /data/mongodb/arbiter
```

### 3.2 创建配置文件

```
# master.conf 主节点配置文件
dbpath=/data/mongodb/master
logpath=/root/mongodb-linux-x86_64-2.4.9/log/master.log
pidfilepath=/root/mongodb-linux-x86_64-2.4.9/log/master.pid
directoryperdb=true
logappend=true
replSet=bid
bind_ip=192.168.1.101
port=27017
oplogSize=10000
fork=true
noprealloc=tru
```

```
# slave.conf 备节点配置文件
dbpath=/data/mongodb/slave
logpath=/root/mongodb-linux-x86_64-2.4.9/log/master.log
pidfilepath=/root/mongodb-linux-x86_64-2.4.9/log/master.pid
directoryperdb=true
logappend=true
replSet=bid
bind_ip=192.168.1.102
port=27017
oplogSize=10000
fork=true
noprealloc=tru
```

```
# arbiter.conf 仲裁节点配置文件
dbpath=/data/mongodb/arbiter
logpath=/root/mongodb-linux-x86_64-2.4.9/log/master.log
pidfilepath=/root/mongodb-linux-x86_64-2.4.9/log/master.pid
directoryperdb=true
logappend=true
replSet=bid
bind_ip=192.168.1.103
port=27017
oplogSize=10000
fork=true
noprealloc=tru
```


|参数名称|参数说明|
|--------------|
|**dbpath**|数据存储目录|
|**logpath**|日志存放目录|
|**pidfilepath**|进程PID文件位置|
|**directoryperdb**|按数据库名称创建文件夹存储数据|
|**logappend**|以追加的方式记录日志|
|**replSet**|副本集的名称|
|**bind_ip**|本地绑定的IP地址|
|**port**|启动的端口号|
|**oplogSize**|日志文件的最大大小，单位MB|
|**fork**|以后台的方式运行|
|**noprealloc**|不预先分配存储|

### 3.3 启动mongodb

```shell
./mongod -f master.conf # 启动主节点mongodb

./mongod -f slave.conf # 启动备节点mongodb

./mongod -f arbiter.conf # 启动仲裁节点mongodb
```

### 3.4 配置主备仲裁节点

连接进入主节点服务器，进入`admin`数据库进行配置，如下：

```shell
# 连接进入
./mongo 192.168.1.101:27017
> use admin # 进入admin集合
> config={_id:"bid", members:[
...{_id:0,host:'192.168.1.101.130:27017',priority:2},
...{_id:1,host:'192.168.1.102:27017',priority:1},
...{_id:2,host:'192.168.1.102',arbiterOnly:true}
]}
> rs.initiate(config) # 执行配置初始化
> rs.status() # 查看配置生效
```

**_id** 是各个mongodb配置文件中配置的副本集名称，**members** 包含集群的节点的地址及优先级，优先级最高的是主节点。仲裁节点需要使用`arbiterOnly:true`进行指定。

执行`rs.initiate(config)`完成后，等待一段时间后执行`rs.status()`查看配置是否已经生效。同时需要分别查看各个节点的日志文件是否已经开始执行数据同步。

## 4. 总结

至此所有配置已经完成，由此可见副本集的配置比较简单，测试时可以向主节点插入数据时是否可以正常同步到备份节点中。当关闭主节点，仲裁节点是否会自动将备节点选举为主节点，且数据不会丢失，客户端连接正常。

另外客户端连接mongodb集群，**只需要连接主和备节点地址，仲裁节点不需要指定连接**。