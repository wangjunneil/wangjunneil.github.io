---
title: 阿里云Linux服务器数据盘挂载
name: aliyun-data-disk-mount
date: 2015-11-29
tags: [阿里云,mount]
categories: [Linux]
---

# 阿里云Linux服务器数据盘挂载

## 背景

购买的阿里云centos服务器，配置是linux系统送20G系统盘，另外配置了200G数据盘。
本以为200G数据盘是已经挂载好，安装程序当超过20G会自动使用200G的数据盘，但往往不是，这点阿里云一点不人性化。
悲剧的是系统运行一段时间后，当数据库数据增多时才发现需要挂在数据盘，此时不得不重新安装数据库然后做数据迁移。

## 步骤

### 1. 检测磁盘状态

查看当前磁盘使用情况以确定云盘是否被挂载，这里看到整个系统只有20G的空间

```shell
[root@iZ256uevkn8Z ~]# df -hP
Filesystem            Size  Used Avail Use% Mounted on
/dev/hda1              20G  1.5G   17G   8% /
tmpfs                 4.0G     0  4.0G   0% /dev/shm
```

### 2. 查找云盘位置

查找云盘，这里找到的云盘是"**/dev/xvdb**"，容量是"**107.3GB**"，最后一行显示其没有在分区中

```shell
[root@xxxxxxxxxxx ~]# fdisk -l

Disk /dev/hda: 21.4 GB, 21474836480 bytes
224 heads, 56 sectors/track, 3343 cylinders
Units = cylinders of 12544 * 512 = 6422528 bytes

   Device Boot      Start         End      Blocks   Id  System
/dev/hda1   *           1        3343    20963801   83  Linux
Partition 1 does not end on cylinder boundary.

Disk /dev/xvdb: 107.3 GB, 107374182400 bytes
224 heads, 56 sectors/track, 16718 cylinders
Units = cylinders of 12544 * 512 = 6422528 bytes

Disk /dev/xvdb doesn't contain a valid partition table
```

### 3. 云盘分区操作

```shell
[root@iZ256uevkn8Z ~]# fdisk /dev/xvdb
Device contains neither a valid DOS partition table, nor Sun, SGI or OSF disklabel
Building a new DOS disklabel. Changes will remain in memory only,
until you decide to write them. After that, of course, the previous
content won't be recoverable.

The number of cylinders for this disk is set to 16718.
There is nothing wrong with that, but this is larger than 1024,
and could in certain setups cause problems with:
1) software that runs at boot time (e.g., old versions of LILO)
2) booting and partitioning software from other OSs
   (e.g., DOS FDISK, OS/2 FDISK)
Warning: invalid flag 0x0000 of partition table 4 will be corrected by w(rite)

Command (m for help): n
Command action
   e   extended
   p   primary partition (1-4)
p
Partition number (1-4): 1
First cylinder (1-16718, default 1):
Using default value 1
Last cylinder or +size or +sizeM or +sizeK (1-16718, default 16718):
Using default value 16718
```

### 4. 检测云盘状态

```shell
[root@iZ256uevkn8Z ~]# fdisk -l

Disk /dev/hda: 21.4 GB, 21474836480 bytes
224 heads, 56 sectors/track, 3343 cylinders
Units = cylinders of 12544 * 512 = 6422528 bytes

   Device Boot      Start         End      Blocks   Id  System
/dev/hda1   *           1        3343    20963801   83  Linux
Partition 1 does not end on cylinder boundary.

Disk /dev/xvdb: 107.3 GB, 107374182400 bytes
224 heads, 56 sectors/track, 16718 cylinders
Units = cylinders of 12544 * 512 = 6422528 bytes

    Device Boot      Start         End      Blocks   Id  System
/dev/xvdb1               1       16718   104855268   83  Linux
```

### 5. 新分区进行格式化

```shell
[root@iZ256uevkn8Z ~]# mkfs.ext3 /dev/xvdb1
mke2fs 1.39 (29-May-2006)
Filesystem label=
OS type: Linux
Block size=4096 (log=2)
Fragment size=4096 (log=2)
13107200 inodes, 26213817 blocks
1310690 blocks (5.00%) reserved for the super user
First data block=0
Maximum filesystem blocks=4294967296
800 block groups
32768 blocks per group, 32768 fragments per group
16384 inodes per group
Superblock backups stored on blocks:
    32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
    4096000, 7962624, 11239424, 20480000, 23887872

Writing inode tables: done
Creating journal (32768 blocks): done
Writing superblocks and filesystem accounting information:
done

This filesystem will be automatically checked every 28 mounts or
180 days, whichever comes first.  Use tune2fs -c or -i to override.
```

### 6. 挂载数据盘并检查状态

```shell
[root@iZ256uevkn8Z /]# cd /
[root@iZ256uevkn8Z /]# mkdir bosyun
[root@iZ256uevkn8Z /]# mount /dev/xvdb1 /bosyun/
[root@iZ256uevkn8Z /]# df -hP
Filesystem            Size  Used Avail Use% Mounted on
/dev/hda1              20G  1.5G   17G   8% /
tmpfs                 4.0G     0  4.0G   0% /dev/shm
/dev/xvdb1             99G  188M   94G   1% /bosyun
```

此时操作基本已经完成，一些程序或者数据库的安装位置应该指定你挂载的目录，这里的例子是"**/bosyun**"，非必要情况不要在系统盘进行操作。