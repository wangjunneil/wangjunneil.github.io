---
title: Jetty作为嵌入式web容器使用事例
name: jetty-web-container
date: 2016-3-23
tags: [jetty]
categories: [Java]
---

# Jetty作为嵌入式web容器使用事例

## 背景

有时候你希望做一个后台程序，它主要是处理后台逻辑代码，你可以简单的使用main方法完成。但或许需要一点点的页面控制或者展现，可能只有一两个html文件，这时不希望为了这点界面功能而把它做成web程序结构，并且还不得不准备好一个web容器。

无论这个web容器有多大，对于程序而言是多余的，这时不妨使用在main方法里集成web处理。此时需要实现web容器，需要实现http协议、servlet和jsp等动态脚本，想想是很复杂的，面对这种问题，Jetty或许是你最好的选择。

## 案例

### 1. 处理静态资源

```java
package com.wangjunneil.web;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ResourceHandler;

public class App {
    public static void main( String[] args ) throws Exception {
        Server server = new Server(9000);

        ResourceHandler resourceHandler = new ResourceHandler();
        resourceHandler.setResourceBase("/Volumes/TOD/wwwroot");
        server.setHandler(resourceHandler);

        server.start();
        server.join();
    }
}
```

### 2. 处理动态资源

```java
package com.wangjunneil.web;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.webapp.WebAppContext;

public class App {
    public static void main( String[] args ) throws Exception {
        Server server = new Server(9000);

        WebAppContext context = new WebAppContext();
        context.setDescriptor("/Volumes/TOD/wwwroot/web.xml");
        context.setResourceBase("/Volumes/TOD/wwwroot");     // 可以是文件夹
        context.setWar("/Volumes/TOD/wwwroot/example.war");  // 可以是war包
        context.setParentLoaderPriority(true);
        server.setHandler(context);

        server.start();
        server.join();
    }
}
```

### 3. 高度自由定制

```java
package com.wangjunneil.web;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;

public class App {
    public static void main( String[] args ) throws Exception {
        Server server = new Server(9000);

        // 自定义web处理
        ResourceHandler resourceHandler = new ResourceHandler();
        resourceHandler.setDirectoriesListed(true);
        resourceHandler.setResourceBase("/Volumes/TOD/wwwroot");

        // 设置上下文
        ContextHandler contextHandler = new ContextHandler();
        contextHandler.setContextPath("/example");
        contextHandler.setHandler(resourceHandler);

        ServletContextHandler servletContextHandler = new ServletContextHandler(ServletContextHandler.SESSIONS);
        servletContextHandler.setContextPath("/");
        servletContextHandler.addServlet("com.wangjunneil.HelloWorldServlet", "/hello");
        servletContextHandler.addServlet("com.wangjunneil.DemoServlet", "/demo");

        HandlerList handlerList = new HandlerList();
        handlerList.addHandler(contextHandler);
        handlerList.addHandler(servletContextHandler);

        server.setHandler(handlerList);
        server.start();
        server.join();
    }
}
```

## Maven相关依赖

```xml
<dependency>
	<groupId>org.eclipse.jetty</groupId>
	<artifactId>jetty-server</artifactId>
	<version>9.3.4.RC1</version>
</dependency>
<dependency>
	<groupId>org.eclipse.jetty</groupId>
	<artifactId>jetty-io</artifactId>
	<version>9.3.4.RC1</version>
</dependency>
<dependency>
	<groupId>org.eclipse.jetty</groupId>
	<artifactId>jetty-http</artifactId>
	<version>9.3.4.RC1</version>
</dependency>
<dependency>
	<groupId>org.eclipse.jetty</groupId>
	<artifactId>jetty-util</artifactId>
	<version>9.3.4.RC1</version>
</dependency>
<dependency>
	<groupId>org.eclipse.jetty</groupId>
	<artifactId>jetty-servlet</artifactId>
	<version>9.3.4.RC1</version>
</dependency>
<dependency>
	<groupId>org.eclipse.jetty</groupId>
	<artifactId>jetty-webapp</artifactId>
	<version>9.3.4.RC1</version>
</dependency>
<dependency>
	<groupId>org.eclipse.jetty</groupId>
	<artifactId>jetty-xml</artifactId>
	<version>9.3.4.RC1</version>
</dependency>
<dependency>
	<groupId>org.eclipse.jetty</groupId>
	<artifactId>jetty-security</artifactId>
	<version>9.3.4.RC1</version>
</dependency>
<dependency>
	<groupId>org.eclipse.jetty</groupId>
	<artifactId>jetty-continuation</artifactId>
	<version>9.3.4.RC1</version>
</dependency>
<dependency>
	<groupId>org.eclipse.jetty</groupId>
	<artifactId>jetty-jsp</artifactId>
	<version>9.2.15.v20160210</version>
</dependency>
<dependency>
	<groupId>javax.servlet</groupId>
	<artifactId>servlet-api</artifactId>
	<version>2.5</version>
</dependency>
```