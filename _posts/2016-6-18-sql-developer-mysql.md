---
title: SQLDeveloper启用对mysql管理模式
name: sql-developer-mysql
date: 2016-6-18
tags: [sqldeveloper,mysql]
categories: [Database]
---


* 目录
{:toc}

---

# SQLDeveloper启用对mysql管理模式

实际项目中使用oracle做为数据库是大多数企业应用的选择，针对于oracle的管理操作我们有多种选择，主流的有navicat、plsql或者sqldeveloper，多年的操作每个人对数据库客户端有各自的偏好。我的偏好是使用oracle官方的sqldeveloper，但是常常再测试或者做些demo时会使用mysql数据库，又不想浪费电脑资源去安装一个mysql管理的客户端，这样不能集中操作，往往电脑窗口过多，影响工作效率。

## 下载驱动

下载mysql驱动包，地址：[http://dev.mysql.com/downloads/connector/j/](http://dev.mysql.com/downloads/connector/j/)

## 驱动位置

将驱动包拷贝到sqldeveloper安装目录的，路径如下：

![s1](http://ohdpyqlwy.bkt.clouddn.com/sqldeveloper-mysql-1.png)

![s2](http://ohdpyqlwy.bkt.clouddn.com/sqldeveloper-mysql-2.png)

## 配置SQLDeveloper

**工具**–**首选项**–**数据库**–**第三方JDBC驱动程序**，点击添加条目只想`jlib/mysql-connector-java-5.1.39-bin.jar`的驱动包。

![s3](http://ohdpyqlwy.bkt.clouddn.com/sqldeveloper-mysql-3.png)

## 验证配置

新建数据库进行验证，此时点击新建时，mysql的配置选项将会出现，如下：

![s4](http://ohdpyqlwy.bkt.clouddn.com/sqldeveloper-mysql-4.png)

