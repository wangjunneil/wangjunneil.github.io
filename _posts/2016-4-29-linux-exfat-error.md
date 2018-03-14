---
title: linux系统上挂载exFAT文件设备，解决unknown filesystem type 'exfat'错误
name: linux-exfat-error
date: 2016-4-29
tags: [exfat]
categories: [Linux]
---


# linux系统上挂载exFAT文件设备，解决unknown filesystem type 'exfat'错误

![exfat-err](http://ohdpyqlwy.bkt.clouddn.com/exfat-err.png)

U盘或者硬盘使用exFAT文件系统是最佳的选择，像FAT32，没有4GB大小的限制，也是跨平台的文件系统格式。无论你在osx、windows或者linux上都可以正常的使用。如果需要在linux系统上进行文件读写的操作，则你需要安装一些组件才可以正常读写U盘或硬盘中的数据。

若没有安装所需的组件而尝试去连接一个exFAT的格式化的驱动器，则会出现**unknown filesystem type 'exfat'**的错误。

## 安装exFAT文件格式支持

这里以Ubuntu系统为例，其他系统请使用各自安装方式，如Centos，执行`yum install exfat-fuse exfat-utils`等等。首先在系统菜单中打开一个终端，执行以下安装命令。

```shell
# 安装exfat-fuse和exfat-utils
sudo apt-get install exfat-fuse exfat-utils
```

## 自动挂载exFAT

一般情况下，安装好exFAT支持的组件，再次连接exFAT格式的U盘或者硬盘会自动挂载上，若没有自动挂载可以手动使用终端命令进行挂载。

```shell
# 创建一个目录用于挂在U盘或硬盘内容，可以是/mnt
sudo mkdir /media/exfat

# 查看U盘或硬盘设备，一般是最后一行，如/dev/sdb1
fdisk -l

# 使用mount命令进行挂载操作
sudo mount -t exfat /dev/sdb1 /media/exfat

# 退出挂载操作
sudo umount /dev/sdb1
```

## 格式化exFAT文件驱动器

```shell
# 格式化驱动器
sudo mkfs.exfat /dev/sdb0
```