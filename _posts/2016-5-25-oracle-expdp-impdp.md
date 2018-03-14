---
title: oracle的数据dump工具expdp与impdp的使用说明
name: oracle-expdp-impdp
date: 2016-5-25
tags: [oracle,impdp,expdp]
categories: [Database]
---

# oracle的数据dump工具expdp与impdp的使用说明

Oracle在11的版本后推出了新的导入和导出工具**expdp**与**impdp**，与老版本的导入和导出工具使用方法类似，本篇文章将从常用的角度出发说明此工具的使用方法。

## 新旧版本的不同之处

* 兼容性，新旧版本导出的dump文件不兼容
* 工作方式，老版本适用于客户端和服务端，新版本只适用于服务端使用
* 性能，工作方式的不同决定了新版本的速度更快

## 数据库导出

```shell
# 指定schema导出
expdp DEV/DEV schemas=DEV dumpfile=dev.dmp;

# 指定表名导出
expdp DEV/DEV TABLES=account,deptment dumpfile=dev.dmp;

# 指定单表带查询的导出
expdp DEV/DEV TABLES=deptment query='WHERE deptno=20' dumpfile=dev.dmp;

# 指定表空间导出
expdp DEV/DEV TABLESPACES=DEV,CTHW dumpfile=dev.dmp;

# 导整个数据库
expdp DEV/DEV FULL=y dumpfile=dev.dmp;

# 并行导出数据库（数据量大的情况下使用，parallel的值应为cpu核数的两倍）
expdp DEV/DEV FULL=y dumpfile=dev.dmp parallel=4;

# ----------------------------------------------------

# 查看默认导出目录
SQL> select * from dba_directories;

# 修改默认导出目录（/u01/app/oracle/admin/XE/dpdump）
mkdir /opt/oracle/dump
chmod 755 /opt/oracle/dump
SQL> create directory dumpdir as '/opt/oracle/dump';
SQL> grant read,write on directory dumpdir to DEV;

# 导出到指定目录中
expdp DEV/DEV FULL=y dumpfile=dev.dmp directory=dumpdir;
```

## 数据库导入

```shell
# 导入到指定schema
impdp TQBAY/TQBAY dumpfile=dev.dmp SCHEMAS=TQBAY;

# 导入变更schema
# remap_schema=原schema:新schema
impdp TQBAY/TQBAY dumpfile=dev.dmp remap_schema=DEV:TQBAY;

# 导入变更表空间
# remap_tablespace=原表空间:新表空间
impdp TQBAY/TQBAY dumpfile=dev.dmp remap_tablespace=DEV_DATA:TQBAY_DATA;

# 导入整个数据库
impdp TQBAY/TQBAY dumpfile=dev.dmp FULL=y;
```