---
title: ophcrack一个使用彩虹表破解windows下hash密码值的工具
name: ophcrack-window-hash
date: 2016-5-7
tags: [kali,ophcrack]
categories: [Blackhat]
---

* 目录
{:toc}

---

# ophcrack一个使用彩虹表破解windows下hash密码值的工具

## 1. 介绍

**[Ophcrack](http://ophcrack.sourceforge.net/)**是使用彩虹表快速破解windows系统中登录用户密码的hash值，如何获取目标windows系统中的密码hash值？可以使用很多工具办到，gethash就是一种小工具，只需要在目标主机上运行这么一些小工具即可得到账户的hash值。

## 2. windows密码hash格式

Windows系统下的hash密码格式为：**用户名称:RID:LM-HASH值:NT-HASH值**，例如：

```
Administrator:500:C8825DB10F2590EAAAD3B435B51404EE:683020925C5D8569C23AA724774CE6CC
```

**用户名称为**：Administrator
**RID为**：500
**LM-HASH值为**：C8825DB10F2590EAAAD3B435B51404EE
**NT-HASH值为**：683020925C5D8569C23AA724774CE6CC

若得到了此hash值，那你其实已经得到了用户的密码，可以使用多种工具进行hash值的暴力计算。

## 3. 彩虹表破解

### 3.1 下载彩虹表字典

在ophcrack官网有多种不同彩虹表可供下载，每种彩虹表包含的Charset决定破解的速度，基本上14位或14位以下的密码能很快计算出来。

下载地址：[http://ophcrack.sourceforge.net/tables.php](http://ophcrack.sourceforge.net/tables.php)

### 3.2 基于命令行使用方式

```shell
# -g 禁用GUI形式
# -d 彩虹表所在目录
# -t 彩虹表，可以指定多个以冒号分割
# -f hash文件位置
ophcrack -g -d /path/to/tables -t xp_free_fast,0,3:vista_free -f in.txt
```

### 3.3 基于GUI的使用方式

基于界面方式就很简单了，首先需要安装下载的彩虹表，如下:

![ophcrack-1](http://ohdpyqlwy.bkt.clouddn.com/ophcrack-1.png)

其次加载hash值，可以是单条记录、多条文件记录，然后点击crack按钮即可进行破解操作。

![ophcrack-2](http://ohdpyqlwy.bkt.clouddn.com/ophcrack-2.png)

目前最新的ophcrack只能支持XP和Vista的系统，最新一次更新在2014年6月份，貌似已经不更新了，特此说明。