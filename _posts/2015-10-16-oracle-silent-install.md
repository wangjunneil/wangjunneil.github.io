---
title: Centos7下的oracle静默安装
name: oracle-silent-install
date: 2015-10-16 12:00
tags: [oracle,静默安装]
categories: [Database]
---

* 目录
{:toc}

---

# Centos7下的oracle静默安装

## 1. 背景

静默安装oracle是在非GUI界面的操作系统中迫不得已的做法，通常的Unix服务器因为性能要求并不会安装图形化界面，这种情况下，若需要安装oracle数据库则需要使用它的静默安装方法。

## 2. 参考

本篇文章使用的oracle版本为**11gR2**，操作系统为**centos6.5**，相关参考的文件可以点击**[下载](http://ohdpyqlwy.bkt.clouddn.com/response.tar.gz)**。


## 3. 安装

### 3.1 上传安装包

```
linux.x64_11gR2_database_1of2.zip
linux.x64_11gR2_database_2of2.zip
```

### 3.2 检查依赖库

```shell
rpm -q binutils | grep "not installed"
rpm -q compat-libstdc++-33 | grep "not installed"
rpm -q elfutils-libelf | grep "not installed"
rpm -q elfutils-libelf-devel | grep "not installed"
rpm -q expat | grep "not installed"
rpm -q gcc | grep "not installed"
rpm -q gcc-c++ | grep "not installed"
rpm -q binutils | grep "not installed"
rpm -q glibc | grep "not installed"
rpm -q glibc-common | grep "not installed"
rpm -q glibc-devel | grep "not installed"
rpm -q glibc-headers | grep "not installed"
rpm -q libaio | grep "not installed"
rpm -q libaio-devel | grep "not installed"
rpm -q libgcc | grep "not installed"
rpm -q libstdc++ | grep "not installed"
rpm -q libstdc++-devel | grep "not installed"
rpm -q make | grep "not installed"
rpm -q pdksh | grep "not installed"
rpm -q sysstat | grep "not installed"
rpm -q binutils | grep "not installed"
rpm -q unixODBC | grep "not installed"
rpm -q unixODBC-devel | grep "not installed"
```

> 若出现哪些依赖库没有安装，使用"**yum install [依赖库]**"进行安装。尽量使用`yum`的安装方式，可以解决循环依赖的问题。

### 3.3 创建用户和组

```shell
groupadd oinstall
groupadd dba
groupadd asmadmin
groupadd asmdba
useradd -g oinstall -G dba,asmdba oracle -d /home/oracle
passwd oracle
```

### 3.4 设置内核参数

编辑`vi /etc/sysctl.conf`文件，在文件内容最后追加如下内容：

```
# 在底部追加以下内容
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.conf.all.rp_filter = 1
fs.file-max = 6815744
fs.aio-max-nr = 1048576
kernel.shmall = 2097152
kernel.shmmax = 2147483648
kernel.shmmni = 4096
kernel.sem = 250 32000 100 128
net.ipv4.ip_local_port_range = 9000 65500
net.core.rmem_default = 262144
net.core.rmem_max = 4194304
net.core.wmem_default = 262144
net.core.wmem_max = 1048576
```

执行下面命令使立即生效

```shell
sysctl -p
```

编辑`vi /etc/security/limits.conf`文件，在文件内容最后追加如下内容：

```
# 在底部追加以下内容
oracle soft nproc 2047
oracle hard nproc 16384
oracle soft nofile 1024
oracle hard nofile 65536
```

### 3.5 创建安装目录

```shell
mkdir -p /u01/app/oracle/
chown -R oracle:oinstall /home/oracle
chown -R oracle:oinstall /u01
```

### 3.6 调整swap空间大小

```shell
# 查看swap大小
free -m

# 增加交换分区文件及大小，如果要增加2G大小的交换分区，则命令写法如下，其中的 count 等于想要的块大小。
dd if=/dev/zero of=/home/swap bs=1024 count=2048000

# 设置交换文件
mkswap /home/swap

# 立即启用交换分区文件
swapon /home/swap

# 如果要在引导时自动启用，则编辑 /etc/fstab 文件，添加行
/home/swap swap swap defaults 0 0
```

### 3.7 设置环境变量

编辑oracle用户目录下`vi /home/oracle/.bashrc`文件，增加安装的环境变量

```
export PATHTH=$PATH:HOME/bin
export ORACLE_BASE=/u01
export ORACLE_HOME=$ORACLE_BASE/oracle
export ORACLE_SID=BOSYUN
export PATH=$PATH:$ORACLE_HOME/bin:$ORACLE_HOME/Apache/Apache/bin
# export TNS_ADMIN=$ORACLE_HOME/network/admin
# export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:ORACLE_HOME/lib
export NLS_LANG=AMERICAN_AMERICA.AL32UTF8
# export ORA_NLS10=$ORACLE_HOME/nls/data
unset USERNAME
umask 022
```

### 3.8 解压缩安装文件

```shell
# 切换到root用户
su - root

# 将安装文件移动到oracle用户目录中
mv linux.x64_11gR2_database_1of2.zip /home/oracle/linux.x64_11gR2_database_1of2.zip
mv linux.x64_11gR2_database_2of2.zip /home/oracle/linux.x64_11gR2_database_2of2.zip

# 进入oracle用户目录
cd /home/oracle

# 给压缩文件赋予权限
chmod 777 *.zip

# 切换到oracle用户
su - oracle

# 解压缩安装文件
unzip linux.x64_11gR2_database_1of2.zip -d /u01
unzip linux.x64_11gR2_database_2of2.zip -d /u01

# 进入解压缩目录
cd /u01/database

# 设置DISTRIB变量
export DISTRIB=`pwd`
```

### 3.9 修改数据库响应文件

编辑响应文件`vi /u01/database/response/db_install.rsp`，配置节点数据

```
# 需要更改的参数，其他尽量不要更改，若非要更改请了解参数含义
oracle.install.option=INSTALL_DB_SWONLY
ORACLE_HOSTNAME=izbp193ei7wcdyog9mba9ez
UNIX_GROUP_NAME=oinstall
INVENTORY_LOCATION=/u01/oraInventory
SELECTED_LANGUAGES=en,zh_CN,zh_TW
ORACLE_HOME=/u01/oracle
ORACLE_BASE=/u01
oracle.install.db.InstallEdition=EE
oracle.install.db.isCustomInstall=true
oracle.install.db.DBA_GROUP=dba
oracle.install.db.OPER_GROUP=oinstall
DECLINE_SECURITY_UPDATES=true
```

### 3.10 执行安装

```shell
# 切换到oracle用户
su - oracle

# 进入安装目录
cd /u01/database

# 指定响应文件并安装
./runInstaller -silent -force -ignorePrereq -responseFile /u01/database/response/db_install.rsp
```

成功的情况下会出现以下信息

```
[oracle@iZ94dzd0zvxZ database]$ The following configuration scripts need to be executed as the "root" user.
#!/bin/sh
#Root scripts to run
/u01/oraInventory/orainstRoot.sh
/u01/oracle/root.sh
To execute the configuration scripts:
         1. Open a terminal window
         2. Log in as "root"
         3. Run the scripts
         4. Return to this window and hit "Enter" key to continue
Successfully Setup Software.
```

这一步操作最容易出错，在执行安装脚本时就会报错，经反复测试，只要保证以下规律就能出现"**Successfully Setup Software**"，在执行此步操作时，最好再次执行下以下命令:

```
cd /u01/database
export DISTRIB=`pwd`
```

### 3.11 运行root脚本

```shell
cd /u01/oraInventory/
./orainstRoot.sh

cd /u01/oracle/
./root.sh
```

### 3.12 配置监听文件

```shell
# 切换到oracle用户
su - oracle

# 执行监听的响应文件安装
$ORACLE_HOME/bin/netca /silent /responsefile /u01/database/response/netca.rsp

# 查看是否已经生成listener.ora和sqlnet.ora监听文件
ll $ORACLE_HOME/network/admin/*.ora

# 检查监听启动状态
lsnrctl status
```

> 错误：Connect failed because target host or object does not exist，应检查/etc/hosts文件中，`hostname`是否配置在里面

### 3.13 静默创建数据库

编辑`vi /u01/database/response/dbca.rsp`文件

```
GDBNAME = "BOSYUN.COM"
SID = "BOSYUN"
CHARACTERSET = "utf8"
TOTALMEMORY = "1024"
```

执行静默安装

```shell
$ORACLE_HOME/bin/dbca -silent -responseFile /u01/database/response/dbca.rsp
Enter SYS user password:
Enter SYSTEM user password:
```

由于没有更改**dbca.rsp**文件中的SYS和SYSTEM的密码，所以oracle缺省密码分别为**chang_on_install**和**manager**。

### 3.14 检查建库实例

```shell
ps -ef | grep ora_ | grep -v grep | wc -l
ps -ef | grep ora_ | grep -v grep
```