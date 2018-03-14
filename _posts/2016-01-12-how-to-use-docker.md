---
title: Docker的基础使用备记
name: how-to-use-docker
date: 2016-01-12
tags: [docker]
categories: [Linux]
---

# Docker的基础使用备记

## 镜像

```shell
# 镜像下载
docker pull centos
# 下载指定版本的镜像
docker pull centos:latest
# 下载指定仓库的镜像
docker pull dl.dockerpool.com:5000/centos
 
# 运行镜像
docker run -t -i centos /bin/bash
 
# 查看本机已经下载的镜像
docker images
# 给镜像打标签
docker tag centos mycentos
# 查看镜像详细信息
docker inspect centos
# 查看镜像指定属性信息
docker inspect -f {{".VirtualSize"}} centos
 
# 搜索镜像
docker search mysql
# 仅显示自己创建的镜像
docker search --automated=false mysql
# 按评价星级进行搜索
docker search -s mysql
 
# 按标签删除镜像
docker rmi mycentos
# 按id删除镜像
docker rmi ce20c473cd8a
# 强制删除镜像
docker mi -f mycentos
 
# 基于一个已有的容器创建镜像
# 1. 运行一个镜像
docker run -it centos
# 2. 在里面创建一个文件
touch test
# 3. 退出exit并查看容器id，833a0377b417
docker ps -a
# 4. 提交镜像得到新的镜像id
docker commit -m "add a new file" -a "wangjunneil@gmail.com" 833a0377b417 test
# 5. 查看已经创建的镜像
docker images
 
# 基于本地模板导入
# 1. 从openvz下载操作系统模板，如：ubuntu-14.04-x86_64-minimal.tar.gz
# 2. cat ubuntu-14.04-x86_64-minimal.tar.gz | docker import - ubuntu:14.04
# 3. docker images 查看已经创建的镜像
 
# 基于dockerfile创建（略）
 
# 存出镜像
docker save -o centos_14.04.tar centos:14.04
# 载入镜像
docker load —input centos_14.04.tar
docker load < centos_14.04.tar
# 上传镜像
docker push centos:14.04
```

## 容器

```shell
# 新建的容器处于停止状态
docker create -it cents
# 启动容器
docker start 833a0377b417
# 新建并启动容器，-t分配伪终端，-i标准输入打开，-d以守护状态运行
docker run -t -i centos /bin/bash
# 停止容器
docker stop 833a0377b417
# 重启容器
docker restart 833a0377b417
# 进入容器，attach与exec区别是attach会多终端同步信息，exec相反
docker attach 833a0377b417
docker exec -ti 833a0377b417 /bin/bash
 
# 导出容器
docker export 833a0377b417 > test_for_run.tar
# 导入容器
cat test_for_run.tar | docker import - test/centos:v1.0
 
# 挂载主机目录作为数据卷
docker run -it --privileged -v /home/bosyun/datahubcenter:/root/datahubcenter centos:latest /bin/bash
# 挂载本地文件作为数据卷
docker run -it —privileged -v ~/README.md:/root/README.md centos:latest /bin/bash
 
# 创建数据券容器dbdata
docker run -i -t -v /dbdata --name dbdata centos:latest
# 创建db1、db2两个容器挂载dbdata数据券
docker run -it --volumes-from dbdata --name db1 centos:latest
docker run -it --volumes-from dbdata --name db2 centos:latest
 
# 容器传文件到宿主
docker cp 833a0377b417:/file/path/within/container /host/path/target
# 宿主传文件到容器
docker cp /host/path/target 833a0377b417:/file/path/within/container
```