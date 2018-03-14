---
title: Centos7中NFS的配置及使用方法
name: how-to-use-nfs-in-centos7
date: 2017-02-09
tags: [nfs]
categories: [Linux]
---

* 目录
{:toc}

---

# Centos7中NFS的配置及使用方法

## 安装NFS工具包

```shell
yum install -y nfs-utils
```

> 尽量使用`yum`方式安装，依赖文件的互相依赖，编译安装很麻烦。
> **nfs-utils**包含server和client端的工具，所以nfs的服务端和客户端都需要执行此安装。

## 编辑NFS配置文件

编辑`vi /etc/exports`文件，添加共享路径及访问规则，例如：

```
/data *(rw,sync,no_root_squash)
```

上面为最简单的共享方式，共享本机**/data**目录，允许所有来源进行挂载读写。

配置文件中的每一行分为三个部分：


1. 共享路径，如:/root/nfs
2. 访问来源，"*****"号表示任意，可以是一个IP地址，也可以是一个网段，如192.168.1.0/24
3. 行为控制，括号中使用英文逗号分隔，如rw表示读写，ro只读，等参数

> 注意：配置行中的**访问来源**和**行为控制**中间没有空格。

## 服务端启动NFS

```shell
# 设置开机启动
systemctl enable rpcbind.service
systemctl enable nfs-server.service

# 启动NFS服务
systemctl start rpcbind.service
systemctl start nfs-server.service
```

启动好后可以使用命令`rpcinfo -p`和`showmount -e`查看是否启动和挂载成功。

## 客户端执行挂载

```shell
# 设置开机运行
systemctl enable rpcbind.service

# 启动RPC服务
systemctl start rpcbind.service

# 检查NFS服务器共享路径
showmount -e 192.168.1.100

# 执行挂载到本地
mount -t nfs 192.168.1.100:/data /root/resources
```

> 客户端执行挂载时尽量不要在目标目录中，完成后，可以使用命令`df -hP`或者`mount`查看挂载路径。

## 挂载命令exportfs说明

当更改了NFS的配置文件，可以不重启服务，使用命令`exportfs -rv`重新读取，具体使用参数如下：

-a ： 全部挂载或者卸载
-r ： 重新挂载
-u ： 卸载某个目录
-v ： 现实共享目录