---
title: 关于Oracle字符集的问题
name: bower-tool-use
date: 2016-01-10
tags: [字符集,oracle字符集]
categories: [Database]
---

# 关于Oracle字符集的问题

## 背景

在docker中安装了oracleXE，创建并导入数据，发现很多子段过长并且存在乱码现象，经发现源于字符集，数据库中的字符集是默认的"**AL32UTF8**"，此字符集会让中国占3个字节，导致类型长度不够和乱码的出现。需要讲数据库字符集改成"**ZHS16GBK**"可以解决。

## 解决

```sql
-- sqlplus进入系统
sqlplus /nolog

-- 以dba连接oracle数据库
conn / as sysdba

-- 改变数据库字符集
ALTER SYSTEM ENABLE RESTRICTED SESSION;
ALTER SYSTEM SET JOB_QUEUE_PROCESSES=0;
ALTER SYSTEM SET AQ_TM_PROCESSES=0;
ALTER DATABASE OPEN;
ALTER DATABASE CHARACTER SET INTERNAL_USE ZHS16GBK;
ALTER DATABASE national CHARACTER SET INTERNAL ZHS16GBK;
SHUTDOWN IMMEDIATE;
```