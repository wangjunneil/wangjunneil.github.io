---
title: 怎样使用Derby数据库
name: how-to-use-derby
date: 2017-1-2
tags: [java,derby]
categories: [Database]
---


* 目录
{:toc}

# 怎样使用Derby数据库

## 1. 简介

Java6版本中新增了一个db的目录，这是java6的新成员**javadb**。它是一个纯 Java 实现、开源的数据库管理系统（DBMS），源于 Apache 软件基金会（ASF）名下的项目 Derby。它只有 2MB 大小，对比动辄上 G 的数据库来说可谓袖珍。但这并不妨碍 Derby 功能齐备，支持几乎大部分的数据库应用所需要的特性。作为内嵌的数据库，Java 程序员不再需要耗费大量精力安装和配置数据库，就能进行安全、易用、标准、并且免费的数据库编程。

## 2. 网络模式启动

```shell
# 启动网络服务器模式
startNetworkServer

# 关闭网络服务器模式
stopNetworkServer
```

## 3. ij工具连接使用

```sql
> ./ij
ij> connect 'jdbc:derby:mydb;create=true';
ij> create table t1(name varchar(10));
ij> insert into t1 values('aaaa');
ij> insert into t1 values('bbbb');
ij> insert into t1 values('cccc');
ij> select * from t1;
NAME
----------
aaaa
bbbb
cccc
```

## 4. Java内嵌模式使用

```java
public class HelloJavaDB {
    public static void main(String[] args) {
        try {
        	// 加载驱动
            Class.forName("org.apache.derby.jdbc.EmbeddedDriver").newInstance();
            System.out.println("Load the embedded driver");
            Connection conn = null;
            Properties props = new Properties();
            // 用户名密码授权
            props.put("user", "user1");
            props.put("password", "user1");
            // 创建并获取数据库连接
            conn = DriverManager.getConnection("jdbc:derby:helloDB;create=true", props);
            System.out.println("create and connect to helloDB");
            conn.setAutoCommit(false);

            // 创建一张表和两条记录
            Statement s = conn.createStatement();
            s.execute("create table hellotable(name varchar(40), score int)");
            System.out.println("Created table hellotable");
            s.execute("insert into hellotable values('Ruth Cao', 86)");
            s.execute("insert into hellotable values ('Flora Shi', 92)");
            // 列出记录
            ResultSet rs = s.executeQuery("SELECT name, score FROM hellotable ORDER BY score");
            System.out.println("name\t\tscore");
            while(rs.next()) {
                StringBuilder builder = new StringBuilder(rs.getString(1));
                builder.append("\t");
                builder.append(rs.getInt(2));
                System.out.println(builder.toString());
            }
            // 删除创建的表
            s.execute("drop table hellotable");
            System.out.println("Dropped table hellotable");

            rs.close();
            s.close();
            System.out.println("Closed result set and statement");
            conn.commit();
            conn.close();
            System.out.println("Committed transaction and closed connection");

            try {
            	// 关闭并清理数据库
                DriverManager.getConnection("jdbc:derby:;shutdown=true");
            } catch (SQLException se) {
                System.out.println("Database shut down normally");
            }
        } catch (Throwable e) {
            // 异常捕获
        }
        System.out.println("SimpleApp finished");
    }
}
```

## 5. 编译运行

```shell
java –cp .;%JAVA_HOME%\db\lib\derby.jar HelloJavaDB
```