---
title: Linux增加swap分区
name: linux-add-swap-space
date: 2017-02-10
tags: [swap,fstab]
categories: [Linux]
---

* 目录
{:toc}

---

# Linux增加swap分区

## 1. 何为swap分区

**swap**分区在系统的物理内存不够用的时候，把硬盘空间中的一部分空间释放出来，以供当前运行的程序使用。那些被释放的空间可能来自一些很长时间没有什么操作的程序，这些被释放的空间被临时保存到swap分区中，等到那些程序要运行时，再从swap分区中恢复保存的数据到内存中。

## 2. 创建分区

```shell
# 创建一个512M的/home/swap分区，文件大小为51200个block,1个block为1k
dd if=/dev/zero of=/home/swap bs=1024 count=512000
```

> 上述命令需要以**root**账号执行

## 3. 转换为swap分区

```shell
mkswap /home/swap
```

## 4. 使swap分区有效

```shell
swapon /home/swap
```

## 5. 检查swap分区

```shell
free -m
```

## 6. 配置启动自动挂载

编辑`vi /etc/fstab`文件，添加swap分区配置，如下：

```
/home/swap	swap	swap	defaults	0 0
```

## 附录：fstab挂载文件配置说明

![fstab内容](http://ohdpyqlwy.bkt.clouddn.com/14-38-19.png)

|列|含义|说明|
|--|--|--|
|1|磁盘设备文件或该设备的Label或者UUID|该列可以是设备名、设备的Label或者设备的UUID。可以使用命令`blkid`或者`blkid /home/swap`查看设备名和UUID。<br/>**设备名、Label和UUID区别？**<br/>设备名，如/dev/sda是固定的，硬盘的插槽改变，设备名会变更。使用Label挂在则不需要担心此类问题，但需要注意Label的格式化时的名称变化。对于UUID，唯一性，磁盘在格式化后会分配唯一的标识号，**挂在建议使用UUID的方式**。|
|2|设备挂在点|表示将该设备挂在在系统的哪个文件目录下|
|3|文件系统格式|磁盘文件系统的格式，通常是包括ext2、ext3、reiserfs、nfs、vfat等。|
|4|文件系统参数|**Async/sync** 设置是否为同步方式运行，默认为async<br/>**auto/noauto** 当下载mount -a 的命令时，此文件系统是否被主动挂载，默认为auto<br/>**rw/ro** 是否以以只读或者读写模式挂载<br/>**exec/noexec** 限制此文件系统内是否能够进行"执行"的操作<br/>**user/nouser** 是否允许用户使用mount命令挂载<br/>**suid/nosuid** 是否允许SUID的存在<br/>**Usrquota** 启动文件系统支持磁盘配额模式<br/>**Grpquota** 启动文件系统对群组磁盘配额模式的支持<br/>**Defaults** 同时具有rw,suid,dev,exec,auto,nouser,async等默认参数的设置|
|5|是否被dump备份命令作用|dump是一个用来作为备份的命令，通常这个参数的值为0或者1。<br/>**0** 不要做dump备份<br/>**1** 每天进行dump的操作<br/>**2** 不定日期的进行dump操作|
|6|是否检验扇区|类似于windows开机时检查磁盘坏点，开启后系统会以fsck检查磁盘文件的完整性。<br/>**0** 不要检查<br/>**1** 最早检验<br/>**2** 1级别检验完成之后进行检验|
