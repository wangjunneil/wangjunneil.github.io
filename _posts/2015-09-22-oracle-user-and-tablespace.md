---
title: Oracle中创建用户及分配表空间
name: oracle-user-and-tablespace
date: 2015-09-22
tags: [表空间,oracle]
categories: [Database]
---

* 目录
{:toc}

---

# Oracle中创建用户及分配表空间

## 创建临时表空间

```sql
CREATE SMALLFILE TEMPORARY TABLESPACE [临时表空间名称]
  TEMPFILE '/u01/app/oracle/oradata/XE/[临时表空间名称]'
  SIZE 2048M AUTOEXTEND ON NEXT 512M MAXSIZE UNLIMITED
  EXTENT MANAGEMENT LOCAL UNIFORM SIZE 1M;
```

## 创建数据表空间

```sql
CREATE SMALLFILE TABLESPACE [数据表空间文件名称]
   DATAFILE '/u01/app/oracle/oradata/XE/[数据表空间文件名称]'
   SIZE 2048M AUTOEXTEND ON NEXT 512M MAXSIZE UNLIMITED
   LOGGING EXTENT MANAGEMENT LOCAL SEGMENT SPACE MANAGEMENT AUTO;
```

## 创建用户Schema

```sql
CREATE USER [用户名称] PROFILE "DEFAULT" IDENTIFIED BY [用户密码]
   DEFAULT TABLESPACE [表空间名称] TEMPORARY TABLESPACE [临时表空间名称]
   ACCOUNT UNLOCK
```

## 授权用户权限

```sql
GRANT CONNECT TO [用户名称] WITH ADMIN OPTION;
GRANT DBA TO [用户名称];
GRANT RESOURCE TO [用户名称];
```

## 删除用户及表空间

```sql
-- 删除用户
drop user dev cascade;

-- 删除用户时若报错：ORA-01940: cannot drop a user that is currently connected，则先查会话id
-- SELECT SID,SERIAL# FROM V$SESSION WHERE USERNAME='DEV';
-- 再一个个kill掉该用户的会话再执行drop user
-- ALTER SYSTEM KILL SESSION '24,25341';

-- 删除数据表空间和文件
drop tablespace dev_data including contents and datafiles;

-- 删除临时表空间和文件
drop tablespace dev_temp including contents and datafiles;
```

## 查看数据表空间信息

```sql
SELECT tablespace_name, file_id, file_name, round(bytes / (1024 * 1024), 0)
	total_space FROM dba_data_files ORDER BY tablespace_name;
```