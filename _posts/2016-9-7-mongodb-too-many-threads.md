---
title: mongodb异常Too many threads are already waiting for a connection
name: mongodb-too-many-threads
date: 2016-9-7 12:00
tags: [mongodb,UncategorizedMongoDbException]
categories: [Database]
---

通过 **java** 操作 **mongodb** 时，后台出现的 `UncategorizedMongoDbException` 错误。

```
Too many threads are already waiting for a connection.
Max number of threads (maxWaitQueueSize) of 50 has been exceeded.
```

上面的错误属于 **mongodb** 自身的异常，这个异常的原因在于 **mongodb** 的连接线程数不够使用，导致下面的客户端获取不到连接而抛出了队列等待线程数已满的错误。

**解决方式**

```java
# 设置属性connectionsPerHost
MongoClient client = new MongoClient("127.0.0.1",MongoClientOptions.builder()
    .connectionsPerHost(250)
    .build());
```

```xml
<!-- spring 4新版本中 -->
<mongo:mongo host="${mongo.db.host}" port="${mongo.db.port}">
    <!-- 设置属性connectionsPerHost -->
    <mongo:options connections-per-host="100"/>
</mongo:mongo>

<!-- spring 4版本之下的 -->
<bean id="options" class="com.mongodb.MongoOptions">
    <property name="connectionsPerHost" value="${mongo.db.pool.size}"/>
    <property name="maxWaitTime" value="${mongo.db.pool.maxwait}"/>
</bean>
<bean id="address" class="com.mongodb.ServerAddress">
    <constructor-arg name="host" value="${mongo.db.host}" />
    <constructor-arg name="port" value="${mongo.db.port}" />
</bean>
<bean id="mongo" class="com.mongodb.Mongo">
    <constructor-arg name="addr" ref="address" />
    <constructor-arg name="options" ref="options" />
</bean>
<bean id="mongoTemplate" class="org.springframework.data.mongodb.core.MongoTemplate">
    <constructor-arg ref="mongo" />
    <constructor-arg name="databaseName" value="${mongo.db.name}" />
</bean>
```

> 在配置文件或者代码中指定 `connectionsPerHost` 参数