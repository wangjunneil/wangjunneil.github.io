在使用 `java` 操作 **mongodb** 时，出现了以下的异常信息：

```
nested exception is com.mongodb.MongoWaitQueueFullException: Too many threads are already waiting for a connection. Max number of threads (maxWaitQueueSize) of 50 has been exceeded.
```

由上面的日志看出此类异常并不是发生在 **Spring** 中，而是发生在 **mongodb** 中，所以无论是否集成 **Spring** 或者单独使用 **MongoClient** 都有可能出现此错误。这个异常的原因在于 **mongodb** 的连接线程数不够使用，导致下面的客户端获取不到连接而抛出了队列等待线程数已满的错误，解决方法如下：

# 单独使用MongoClient对象

```java
# 设置属性connectionsPerHost
MongoClient client = new MongoClient("127.0.0.1",MongoClientOptions.builder()
    .connectionsPerHost(250)
    .build());
```

# 集成spring时的设置

```xml
<!-- spring 4新版本中 -->
<mongo:mongo host="${mongo.db.host}" port="${mongo.db.port}">
    <!-- 设置属性connectionsPerHost -->
    <mongo:options connections-per-host="100"/>
</mongo:mongo>
 
<!-- spring 旧版本中 -->
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