---
title: Linux双向认证配置
name: unix-double-auth
date: 2015-08-23
tags: [双向认证,ssh]
categories: [Linux]
---

* 目录
{:toc}

---

# Linux双向认证配置

## 介绍

使用"公私钥"认证的方式进行ssh登录。

## 步骤

### 1. 客户机生成秘钥

客户机生成"公私钥"，公钥文件".ssh/id_rsa.pub"，私钥文件".ssh/id_rsa"

```shell
> ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/wangjun/.ssh/id_rsa):
/Users/wangjun/.ssh/id_rsa already exists.
Overwrite (y/n)?
```

### 2. 上传公钥至服务器

上传公钥文件".ssh/id_rsa.pub"到目标服务器，保留私钥文件".ssh/id_rsa/id_rsa"

```shell
scp ~/.ssh/id_rsa.pub root@10.3.31.18:/root/
```

### 3. 追加公钥到授权文件

将上传的公钥文件".ssh/id_rsa.pub"内容追加服务器".ssh/authorized_keys"文件中

```shell
cat id_rsa.pub >> ~/.ssh/authorized_keys
```

### 4. 不输入密码验证其有效性

```shell
ssh root@10.3.31.18
```

> 以上时客户机到服务器的操作，服务器到客户机的操作一样，这样两台server互相登录操作则不需要认证授权即实现双向认证。

