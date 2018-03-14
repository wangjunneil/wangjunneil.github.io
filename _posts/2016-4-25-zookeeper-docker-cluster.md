---
title: zookeeper在docker中的集群配置
name: zookeeper-docker-cluster
date: 2016-4-25
tags: [zookeeper,docker]
categories: [Linux]
---


* 目录
{:toc}

---

# zookeeper在docker中的集群配置


## 简介

尽管网上有很多zookeeper的集群文章，但我还是决定自己搭建测试下。为什么要看zookeeper，主要是因为目前的主流大数据支持都在使用zookeeper进行管理，如hadoop、hbase等等，不看zookeeper还真不行，所以从这篇文章开始溜下。我没有拿虚拟机进行测试，这里使用了docker的centos镜像进行模拟测试。

## 下载zookeeper

点击下载**[zookeeper](http://apache.opencas.org/zookeeper/zookeeper-3.4.6/zookeeper-3.4.6.tar.gz)**，解压缩即可运行，当然需要准备好jdk1.6的环境。

## 创建docker容器

```shell
# 创建并运行zoo1容器，id是ecac484660f5
docker run -dt --privileged --name zoo1 -v /home/soft:/root/soft centos

# 创建并运行zoo2容器，id是882a51294f94
docker run -dt --privileged --name zoo2 -v /home/soft:/root/soft centos

# 创建并运行zoo3容器，id是8613343953e8
docker run -dt --privileged --name zoo3 -v /home/soft:/root/soft centos
```

## 配置zookeeper

解压缩zookeeper，在配置文件目录conf中复制zoo_sample.cfg一份为zoo.cfg，配置以下信息：

```
tickTime=2000
initLimit=10
syncLimit=5
dataDir=/var/lib/zookeeper
clientPort=2181
server.1=172.17.0.17:2888:3888
server.2=172.17.0.16:2888:3888
server.3=172.17.0.15:2888:3888
```

> 这里的172开头的IP是第2步中创建的3个docker容器的IP地址，这里可以是IP也可以是hostname。

## 创建myid文件

分别进入3个docker容器中在`/var/lib/zookeeper`目录下创建一个myid的文件，文件里分别填写在zoo.cfg中的对应server的id，如1、2、3。

## 启动zookeeper

将配置好的zookeeper分别拷贝到容器中并使用”zkServer.sh start”启动。

```shell
# 拷贝到容器中
docker cp zookeeper-3.4.6 ecac484660f5:/root
docker cp zookeeper-3.4.6 882a51294f94:/root
docker cp zookeeper-3.4.6 8613343953e8:/root

# 分别启动zookeeper
docker exec -it ecac484660f5 /root/zookeeper-3.4.6/bin/zkServer start
docker exec -it 882a51294f94 /root/zookeeper-3.4.6/bin/zkServer start
docker exec -it 8613343953e8 /root/zookeeper-3.4.6/bin/zkServer start
```

### 测试集群状态

任意进入一个zookeeper的容器中，使用自带的客户端工具`zkCli.sh`连接，**create**一个数据节点，然后去集群中其他的zookeeper里去查询，若可以查到则表示集群配置是成功的。