---
title: 使用Tomcat时应该注意的安全策略
name: tomcat-security
date: 2017-04-06
tags: [tomcat]
categories: [Linux]
---

* 目录
{:toc}

---

# 使用Tomcat时应该注意的安全策略

## 1. 删除默认应用

新部署的Tomcat，在webapps目录中有几个工程，包含了示例、管理等功能，这些绝大部分都用不到且有风险，应该删除。

```shell
rm -rf apache-tomcat/webapps/*
```

## 2. 默认用户管理

若不想通过web的方式部署应用，建议注释或者删除**tomcat-users.xml**下用户权限相关配置。

```xml
<tomcat-users>
<!--
  <role rolename="tomcat"/>
  <role rolename="role1"/>
  <user username="tomcat" password="tomcat" roles="tomcat"/>
  <user username="both" password="tomcat" roles="tomcat,role1"/>
  <user username="role1" password="tomcat" roles="role1"/>
-->
</tomcat-users>
```

> 高版本的Tomcat默认已经将此注释

## 3. 隐藏混淆版本信息

使用Tomcat时，若不使用nginx等反向代理，则会在消息头或者异常的页面直接暴露web服务器的名称及其版本号，这样攻击者可以有针对性的进行攻击。

修改**$CATALINA_HOME/conf/server.xml**,在Connector节点添加server字段，如下：

```xml
<Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" server="KBS1.1"/>
```

![消息头](http://ohdpyqlwy.bkt.clouddn.com/10-08-40.png)

## 4. 关闭自动部署

自动部署即将war包放在已经启动中的Tomcat时，自动解压缩和进行热部署。若不需要此功能则建议关闭。修改**$CATALINA_HOME/conf/server.xml**中的**host**字段，修改**unpackWARs="false" autoDeploy="false"**。

```xml
<Host name="localhost"  appBase="webapps"
            unpackWARs="false" autoDeploy="false"
            xmlValidation="false" xmlNamespaceAware="false">
```

## 5. 自定义错误页面

部署在Tomcat中的应用，在未定义404或者500等错误页面时，会抛出异常页面，异常页面会暴露出应用的路径及服务区版本等信息。所以通常需要在web.xml中配置异常页面。

```xml
<error-page>
	<error-code>404</error-code>
	<location>404.html</location>
</error-page>
<error-page>
	<error-code>500</error-code>
	<location>/500.html</location>
</error-page>
```

## 6. 关闭AJP端口

AJP是为 Tomcat 与 HTTP 服务器之间通信而定制的协议，能提供较高的通信速度和效率。如果tomcat前端放的是apache的时候，会使用到AJP这个连接器。前端如果是由nginx做的反向代理的话可以不使用此连接器，因此需要注销掉该连接器。

```xml
	<!-- Define an AJP 1.3 Connector on port 8009 -->
    <!-- <Connector port="8009" protocol="AJP/1.3" redirectPort="8443" /> -->
```

## 7. 服务权限控制

tomcat以非root权限启动，应用部署目录权限和tomcat服务启动用户分离，比如tomcat以tomcat用户启动，而部署应用的目录设置为nobody用户750。

## 8. cookie安全控制

**HttpOnly属性**：如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。

编辑**$CATALINA_HOME/conf/context.xml**文件，在**Context**节点中增加属性**useHttpOnly="true"**。

```xml
<Context useHttpOnly="true">

    <!-- Default set of monitored resources -->
    <WatchedResource>WEB-INF/web.xml</WatchedResource>

    <!-- Uncomment this to disable session persistence across Tomcat restarts -->
    <!--
    <Manager pathname="" />
    -->
```

**secure属性**：当设置为true时，表示创建的 Cookie 会被以安全的形式向服务器传输，也就是只能在 HTTPS 连接中被浏览器传递到服务器端进行会话验证，如果是 HTTP 连接则不会传递该信息，所以不会被窃取到Cookie 的具体内容。

配置cookie的secure属性，在web.xml中sesion-config节点配置cooker-config，此配置只允许cookie在加密方式下传输。

```xml
<session-config>
	<session-timeout>30</session-timeout>
	<cookie-config>
		<secure>true</secure>
	</cookie-config>
</session-config>
```

> **secure**属性是防止信息在传递的过程中被监听捕获后信息泄漏，**HttpOnly**属性的目的是防止程序获取cookie后进行攻击。







