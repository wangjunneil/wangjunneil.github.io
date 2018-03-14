---
title: ActiveMQ + Zookeeper 集群模式的配置整理
name: activemq-zookeeper-cluster
date: 2016-12-25
tags: [activemq, zookeeper, mq]
categories: [Linux]
---


* 目录
{:toc}

# ActiveMQ + Zookeeper 集群模式的配置整理

## 1. 介绍

**[ActiveMQ](http://activemq.apache.org/)**自5.9.0版本后集群的实现方式取消了传统的 **master-slave** 模式，取而代之的结合当下流行的**[ZooKeeper](http://zookeeper.apache.org/)**作为裁判的选举方式。**共享目录**和**数据库共享**依然存在。

本篇文章将阐述基于**zookeeper + leveldb**搭建的activemq集群。

## 2. 文件准备

* ActiveMQ 5.9.0 安装包，[下载](http://archive.apache.org/dist/activemq/apache-activemq/5.9.0/apache-activemq-5.9.0-bin.tar.gz)
* Jdk1.8 安装包，[下载](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* Zookeeper 3.4.6 安装包[下载](http://www.apache.org/dyn/closer.cgi/zookeeper/)

## 3. 环境准备

服务器环境最少准备3台，本文中服务器系统为**Centos7**。下面是服务器地址：

1. 10.10.201.110  - **Master**
2. 10.10.201.111  - **Slaver**
3. 10.10.201.112  - **Slaver**

## 4. 开始安装

首先把三个安装包（apache-activemq-5.9.0-bin.zip、jdk1.8.0_65.tar.gz、zookeeper-3.4.6.zip）分别上传到每个服务器中.

### 4.1 配置JDK环境

**ActiveMQ** 和 **Zookeeper** 的启动都需要java环境，所以首先需要配置好JAVA_HOME。

解压缩已经上传的`jdk1.8.0_65.tar.gz`压缩包

```shell
tar -zxvf jdk1.8.0_65.tar.gz
```

编辑`/etc/profile`文件，在文件结尾处添加 **JAVA_HOME** 环境变量并指定地址

```
export JAVA_HOME=/data/jdk1.8.0_65
export PATH=$JAVA_HOME/bin:$PATH
```

使用 **source** 命令使`/etc/profile`文件配置立即生效

```shell
source /etc/profile
```

使用 **java -version** 命令查看JDK是否配置成功

```shell
java -version

java version "1.8.0_20"
Java(TM) SE Runtime Environment (build 1.8.0_20-b26)
Java HotSpot(TM) 64-Bit Server VM (build 25.20-b23, mixed mode)
```

出现上述信息则表示**JDK**配置已经成功，反之亦然。


### 4.2 配置Zookeeper集群

加压缩`zookeeper-3.4.6.zip`安装包

```shell
unzip zookeeper-3.4.6.zip
```

编辑Zookeeper配置文件目录中的`conf/zoo.cfg`文件（没有就复制`zoo_sample.cfg`为`zoo.cfg`），添加如下内容

```
tickTime=2000
initLimit=10
syncLimit=5
dataDir=/var/lib/zookeeper
clientPort=2181
server.1=10.10.201.110:2888:3888
server.2=10.10.201.111:2888:3888
server.3=10.10.201.112:2888:3888
```

> 将zoo.cfg文件分别拷贝到其余2个服务器中，保持3台服务器的zoo.cfg是同样的上述配置信息。

分别在各个服务器中创建**myid**文件，这里注意各个IP对应的序号

```shell
# 10.10.201.110
echo 1 > /var/lib/zookeeper/myid

# 10.10.201.111
echo 2 > /var/lib/zookeeper/myid

# 10.10.201.112
echo 3 > /var/lib/zookeeper/myid
```

> 若创建myid文件失败，应该先创建`/var/lib/zookeeper`的目录，然后在执行上述命令，上面的命令是各自服务器执行各自的即可。

进入**zookeeper**的`bin/`目录，执行启动命令并观察日志（3台同理）

```shell
./zkServer.sh start

# 查看日志
tail -f zookeeper.out
```

验证**zookeeper**的集群，在其中一台服务器中创建一条节点的数据，看看其他服务器是否能查看到同步的节点信息

```shell
# 连接进入zookeeper
./zkCli.sh

# 创建节点数据
> create /vinny "HelloWorld"

# 在其他服务器节点中查看
> get /vinny
```

> 若能在其他服务器的Zookeeper环境中查看到已创建的节点信息，则表示Zookeeper的集群搭建完成。

### 4.3 配置ActiveMQ集群

介绍中也提到，在**ActiveMQ**新版中将结合**Zookeeper**进行集群的搭建，所以上面的操作只是为**ActiveMQ**集群在做准备。

解压缩`apache-activemq-5.9.0-bin.zip`安装包

```shell
unzip apache-activemq-5.9.0-bin.zip
```

编辑**ActiveMQ**配置文件`conf/activemq.xml`，查找到`persistenceAdapter`节点，将原有的**kahaDB**存储方式注释，添加**Zookeeper**的持久化方式，如下：

```xml
<persistenceAdapter>
    <!--<kahaDB directory="${activemq.data}/kahadb"/>-->
    <replicatedLevelDB
            directory="activemq-data"
            replicas="3"
            bind="tcp://0.0.0.0:0"
            zkAddress="10.10.201.110:2181,10.10.201.111:2181,10.10.201.112:2181"
            hostname="NGMQT01"
            zkPath="/activemq/leveldb-stores"
    />
</persistenceAdapter>
```

从上述配置文件的内容中看出，每个**ActiveMQ**配置都指定了**Zookeeper**的连接信息，并使用`zkPath`属性指明存储的节点名称，各个**ActiveMQ**抢占式的获取`/activemq/leveldb-stores`节点，谁抢到谁就是master。

分别启动**ActiveMQ**并观察日志输出（上述的配置内容其余2台都需要有同样的配置）

```shell
# 启动activemq
./activemq start

# 观察日志输出
tail -f ../data/activemq.log
```

> 进入**Zookeeper**环境中查看节点`/activemq/leveldb-stores`是否已经创建。

当3台服务器中的**ActiveMQ**启动完成后，且输出的日志没有任何错误时，集群搭建完成。

> 这里需要注意的是集群环境中的ActiveMQ，只会有一台提供服务，8161的控制界面也只会提供一个。

### 4.4 ActiveMQ集群下的客户端连接方式

客户端使用**failover**协议，当任何一台JMS的broker当机后，ActiveMQ能自动连接上一个可用的broker。同时会自动恢复**destinations**, **sessions**, **producers**和**consumers**。

**failover协议格式**

```
failover:(tcp://10.10.201.110:61616,tcp://10.10.201.111:61616,tcp://10.10.201.112:61616)
```

**传输URI选项**

failover协议下有很多选项可供配置，如 **randomize** 选项：

```
failover:(tcp://10.10.201.110:61616,tcp://10.10.201.111:61616)?randomize=false
```

> 更多的URI配置选项，请参看 [failover-transport-reference](http://activemq.apache.org/failover-transport-reference.html)

## 5. Broker Cluster模式

上面第4章节说明了ActiveMQ的**Master-slave**模式，这个模式中只是避免了单点故障，服务于客户端请求的仍然只会有一台ActiveMQ的服务器。当遇到大数据量、高并发的情况下，一台ActiveMQ的服务器并不能满足需求。此时需要做负载，使并发请求均衡的分发到不同的ActiveMQ服务器中。

所以一个可靠的ActiveMQ消息模型是：**Master Slave + Broker Cluster**

### 5.1 broker-cluster原理

在**broker-cluster**模式中，每个broker通过网络互相连接，共享Queue和Topic。当**broker-A**中的 *Queue-1* 收到消息时，所有**Consumer**由于还没有处理完上一次的消息，所以此时这条消息处于**pending**（待处理）状态。若此时在broker-B中有**Consumer**在等待消费 *Queue-1* 消息时，那么broker-B会通过网络获取到broker-A中的这条消息并通知自己等待的**Consumer**来消费。

> 这里的每个broker可以理解为第4章节的Master-Slave，也就是说一个broker就是三台ActiveMQ组成的Master-Slave模式。

### 5.2 部署方式

**broker-cluster**有两种实现方式：

* **Static Broker Cluster**
* **Dynamic Broker Cluster**

**Static Broker Cluster配置**

```xml
<networkConnectors>
	<networkConnector uri="static:(tcp://0.0.0.0:61617)" duplex="false"/>
</networkConnectors>
```

**Dynamic Broker Cluster**

```xml
<networkConnectors>
	<networkConnector uri="multicast://default"
		dynamicOnly="true"
        networkTTL="3"
		prefetchSize="1"
		decreaseNetworkConsumerPriority="true" />
</networkConnectors>
```
