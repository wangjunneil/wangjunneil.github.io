---
title: 关于在linux中新建用户需要配置的一些参数备注
name: linux-create-user-add
date: 2016-4-11
tags: [useradd]
categories: [Linux]
---

# 关于在linux中新建用户需要配置的一些参数备注

一直以来在linux系统中新建用户，不得不查找一些网络文章进行新建，不是新建用户很复杂，而是新建用户时需要指定home目录、使用哪种shell和归属于哪些用户组。虽然可以用`man useradd`进行查询，但有时也懒得去查，索性今天备注下，以后就直接复制粘贴了。

## 新建abc的用户

```shell
# -m 意味着创建通常是/home/abc的主目录
useradd -m abc
```

## 设置用户密码

```shell
# 将会提示用户输入两次确认密码
passwd abc
```

## 将用户添加到用户组

```shell
# 添加用户到sudo群组（允许用户进行安装软件、允许打印、使用特权模式等操作）
# -a 意味着附加或添加
# -G 意味着指定一个群组/多个群组
usermod -a -G sudo  abc
```

## 修改用户的shell类型

```shell
# 修改用户缺省的shell为bash shell类型
chsh -s /bin/bash abc
```

以上四个步骤可以用一句命令完成，如：`useradd -d /home/abc -G sudo -s /bin/bash abc`。