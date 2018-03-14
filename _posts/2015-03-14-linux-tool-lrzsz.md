---
title: Linux中替代scp执行上传下载的小工具lrzsz
name: linux-tool-lrzsz
date: 2015-03-14
tags: [lrzsz]
categories: [Linux]
---

* 目录
{:toc}

---

# Linux中替代scp执行上传下载的小工具lrzsz

## 1. 使用背景

常常需要在服务器中上传或者下载一些文件，而大部分服务区都是unix系统的，unix系统中常常使用ftp或者scp这样的命令进行文件的上传下载任务，比如：

```shell
# 将need-tools.tar.gz文件上传到192.168.1.170服务器中的/home/wwtsz目录
scp need-tools.tar.gz wwtsz@192.168.1.170:/home/wwtsz

# 将need-tools.tar.gz文件从服务器192.168.1.170的/home/wwtsz目录下载到当前目录中
scp wwtsz@192.168.1.170:/home/wwtsz/need-tools.tar.gz need-tools.tar.gz
```

这样反复的使用scp上传下载确实浪费了不少时间，这时候可以使用lrzsz的工具解决，由于lrzsz实现的是Zmodem协议协议，所以需要使用一个支持Zmodem协议的客户端，这里使用的是SecureCRT，具体安装和使用的步骤如下。

## 2. 下载SecureCRT客户端到本地电脑中

网上下载的地方有很多，win和mac版本的都有。SecureCRT是收费软件，如果你钱包简陋有破解版的下载，此处忽略。

## 3. 在SecureCRT中配制服务器地址和上传下载目录

配置上传和下载目录需要在会话选项（Session Options）中的X/Y/Zmodem里配置，全局选项中没有这个配置。

## 4. 在服务器中安装lrzsz工具

```shell
# yum 安装lrzsz工具
yum install -y lrzsz
```

```shell
# 下载lrzsz-0.12.20.tar.gz
wget http://www.ohse.de/uwe/releases/lrzsz-0.12.20.tar.gz
# 解压缩lrzsz-0.12.20.tar.gz
tar zxvf lrzsz-0.12.20.tar.gz && cd lrzsz-0.12.20
# 编译安装（默认把lsz和lrz安装到了/usr/local/bin/目录下）
./configure && make && make install

# 软连接
cd /usr/bin/
ln -s /usr/local/bin/lrz rz
ln -s /usr/local/bin/lsz sz
```

## 5. lrzsz工具里的上传rz和下载sz命令

**rz** 上传文件，在SecureCRT中输入命令rz会弹出文件选择框，选中文件即可上传到目标服务器中
**sz** 下载文件，在服务器中使用sz 文件名即可下载到上面配置的本地下载目录中

## 附：什么是Zmodem协议？

Zmodem是针对modem的一种错误校验协议。利用Zmodem协议，可以在modem上发送512字节的数据块。如果某个数据块发生错误，接受端会 发送"否认"应答，因此，数据块就会被重传。它是Xmodem文件传输协议的一种增强形式，不仅能传输更大的数据，而且错误率更小。包含一种名为检查点重 启的特性，如果通信链接在数据传输过程中中断，能从断点处而不是从开始处恢复传输。



