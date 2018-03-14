---
title: docker关于存储位置变更的问题
name: docker-store-location
date: 2016-3-25
tags: [docker,docker存储位置]
categories: [Linux]
---

# Docker关于存储位置变更的问题

**[Docker](https://www.docker.com/)**安装并启动后默认会将镜像或容器数据文件存储在**/var/lib/docker(centos7)**，若在安装系统时没有考虑存储容量则会有很大问题，慢慢的根目录的硬盘空间会被占满，导致整个系统越来越卡。

网上有很多方式，但都觉得十分麻烦且经常会有错误，个人觉得最简单的方法就是做软连接，如下：

```shell
# 查看分区使用情况
df -hP

# 将docker默认存储地址软连接到根的bosyun目录中
ln -s /var/lib/docker/ /bosyun/

# 查看软连接
ls -al /var/lib/docker

# 启动docker查看/bosyun是否生成docker数据文件
systemctl start docker.service
```
