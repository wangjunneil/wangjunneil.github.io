---
title: mysqldump的简单和复杂使用备注
name: how-to-use-mysqldump
date: 2016-4-22
tags: [mysql,mysqldump]
categories: [Database]
---

* 目录
{:toc}

---

# mysqldump的简单和复杂使用备注

mysqldump本身有很多参数选项，本文列出常用的一些参数说明，更多的请点击参看[mysql官方文档](http://dev.mysql.com/doc/refman/5.7/en/mysqldump.html#idm140518991203200)。

## 导出一个数据库

```shell
# 简单的使用
mysqldump some_database > some_database.sql

# 或者加上用户授权
mysqldump -u some_user -p some_database > some_database.sql

# 或者导出成压缩格式
mysqldump some_database | gzip > some_database.sql.gz
```

## 导出一个或者多个数据库

```shell
# 导出多个数据库
mysqldump --single-transaction --skip-lock-tables --databases db1 db2 db3 \
    > db1_db2_and_db3.sql

# 导出指定表的数据库
mysqldump --single-transaction --skip-lock-tables some_database table_one table_two table_three \
    > some_database_only_three_tables.sql

mysqldump --single-transaction --skip-lock-tables --flush-privileges --all-databases > entire_database_server.sql
```