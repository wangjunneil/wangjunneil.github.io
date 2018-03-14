---
title: Apache ofbiz中订阅处理MQ消息
name: ofbiz-sub-activemq
date: 2016-01-20
tags: [ofbiz,activemq]
categories: [Java]
---

* 目录
{:toc}

---

# Apache ofbiz中订阅处理MQ消息

## 1. 添加MQ的JNDI配置

编辑`vi ${OFBIZ_HOME}/framework/base/config/jndi.properties`文件，如下：

```
java.naming.factory.initial=org.apache.activemq.jndi.ActiveMQInitialContextFactory
java.naming.provider.url=tcp://127.0.0.1:61616
# topic.OFBTopic=OFBTopic
queue.OFBQueue=OFBQueue
connectionFactoryNames=connectionFactory, queueConnectionFactory, topicConnectionFactory
```

## 2. 配置MQ消息处理器

编辑`vi ${OFBIZ_HOME}/framework/service/config/serviceengine.xml`文件，如下：

```xml
<!-- JMS Service Queue/Topic Configuration -->
<jms-service name="serviceMessenger" send-mode="all">
    <server jndi-server-name="default"
        jndi-name="queueConnectionFactory"
        topic-queue="OFBQueue"
        type="queue"
        username="admin"
        password="admin"
        listen="true"/>
</jms-service>
```

注意节点 **jndi-name**、**topic-queue**、**type**需要与 **jndi.properties** 文件中的内容一致。

## 3. 实现MQ消息处理

ofbiz中有关消息处理的类都在 **${OFBIZ_HOME}/framework/service/src/org/ofbiz/service/jms** 包中，其中 **JmsTopicListener** 是处理 **Topic** 消息的，**JmsQueueListener** 是处理 **Queue** 消息的。

上面两种消息的处理类默认继承了抽象类 **AbstractJmsListener**，消息的处理方法也是调用次抽象类的 **onMessage** 方法进行处理。

```java
/**
  * Receives the MapMessage and processes the service.
  * @see javax.jms.MessageListener#onMessage(Message)
  */
public void onMessage(Message message) {
    MapMessage mapMessage = null;
    if (Debug.verboseOn()) Debug.logVerbose("JMS Message Received --> " + message, module);
 
    if (message instanceof MapMessage) {
        mapMessage = (MapMessage) message;
    } else {
        Debug.logError("Received message is not a MapMessage!", module);
        return;
    }
    runService(mapMessage);
}
```

注意ofbiz的JMS消息是Map类型的，用于调用ofbiz服务使用的，简单的说就是使用JMS调用ofbiz服务。那么定义自己的消息处理器，在上述 **onMessage** 方法中判断消息类型来进行自己的消息处理模式。或者自己定义个消息处理类继承 **AbstractJmsListener** 抽象类，更深点就去在 **JmsServiceEngine.java** 中定义自己的消息处理引擎。