---
title: Python中对mysql数据库的增删改查的基本数据库操作
name: python-mysql-db
date: 2016-3-20
tags: [python,mysql]
categories: [Python]
---

# Python中对mysql数据库的增删改查的基本数据库操作

## 下载驱动

测试数据库使用的是mysql，所以需要先安装MySQL-python驱动。下载地址：[https://pypi.python.org/pypi/MySQL-python/](https://pypi.python.org/pypi/MySQL-python/)

## 安装驱动

下载后直接解压缩，然后进入驱动目录执行`python setup.py install`命令进行驱动安装

## 检查是否安装成功

验证是否安装成功，打开python终端执行导入驱动，如果没有报错则驱动安装成功

```python
import MySQLdb
```

## 操作数据库

```python
#!/usr/bin/python
# coding:utf-8

import MySQLdb

try:
    # 获取数据库连接
    conn = MySQLdb.connect(host='221.6.35.18',user='root',passwd='root',db='testdb',port=53306)
    # 可以在运行时指定db
    # conn.select_db('mydb')
    # 获取游标
    cur = conn.cursor()

    # --------- 查询 ---------
    posts = cur.execute('select * from account')
    # 这里只是输出总条目数
    print posts
    # 打印输出游标第一行数据
    print cur.fetchone()
    # 遍历游标所有结果集
    # postList = cur.fetchall()
    # postlist = cur.fetchmany(5)
    postList = cur.fetchmany(posts)
    for post in postList:
        print post

    # -------- 新增 ---------
    cur.execute('insert into account values (4, "ddd", "ddd@gmail.com")')
    # -------- 批量新增 ---------
    sql = 'insert into account values (%s, %s, %s)'
    cur.executemany(sql,[
        (5, 'eee', 'eee@gmail.com'),
        (6, 'fff', 'fff@gmail.com'),
        (7, 'ggg', 'ggg@gmail.com')
    ])

    # -------- 更新 ---------
    cur.execute('update account set name = "ooo" where id = 7')
    # -------- 删除 ---------
    cur.execute('delete from account where id = 6')

    # 关闭游标
    cur.close()
    # 提交更新
    conn.commit()
    # 关闭数据库
    conn.close()
except MySQLdb.Error, e:
    print "Mysql Error %d: %s" % (e.args[0], e.args[1])
```

## 游标cursor的重要函数

```
callproc(self, procname, args)	执行存储过程，返回值为受影响的行数
execute(self, query, args)		执行单条sql语句，返回值为受影响的行数
executemany(self, query, args)	执行单条sql语句，参数列表为数组，返回值为受影响的行数
nextset(self)					移动到下一个结果集
fetchall(self)					接收全部的返回结果行
fetchmany(self, size=None)		接收size条返回结果行
fetchone(self)					返回一条结果行
scroll(self, value, mode='')	移动指针到某一行，若mode='relative',则从当前所在行移动value条，若mode='absolute'，则表示从结果集的第一 行移动value条
```