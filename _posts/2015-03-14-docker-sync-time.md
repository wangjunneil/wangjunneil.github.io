---
title: Docker中启动同步宿主时区的问题
name: docker-sync-time
date: 2015-03-14
tags: [docker]
categories: [Linux]
---

* 目录
{:toc}

---

# Docker中启动同步宿主时区的问题

## 背景

在docker容器中我们的一些服务常常需要依赖于时间的统一，如果以默认的方式安装配置启动docker容器，则时区不同步，时间少了8个小时，在调用一些服务接口时由于时间的不正确，导致服务接口调用出错。这样必须在启动容器时就规定好此容器使用的时区是哪一种。

## 操作

### 与宿主主机保持相同时间

```shell
sudo docker run -dt -v /etc/localtime:/etc/localtime:ro centos /bin/bash
```

### 为不同docker容器指定不同时区

```shell
# 亚洲上海
sudo docker run -dt -v /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime:ro centos /bin/bash
# 美国纽约
sudo docker run -dt -v /usr/share/zoneinfo/America/New_York:/etc/localtime:ro centos /bin/bash
```

### 为已经启动的容器设置时区

```shell
# 进入容器
sudo docker exec -it 00d /bin/bash
# 安装ntp
yum install -y ntp
# 拷贝Asia/Shanghai
cp -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

> 不同系统的时区目录有所不同，此处的时区目录是针对于centos。若是其它系统请自行查找相应目录。