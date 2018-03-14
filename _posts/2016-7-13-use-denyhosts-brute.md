---
title: 使用denyhosts阻止服务被暴力破解
name: use-denyhosts-brute
date: 2016-7-13
tags: [暴力破解,ssh暴力破解,denyhosts]
categories: [Linux]
---

* 目录
{:toc}

---

# 使用denyhosts阻止服务被暴力破解

## 通常服务器遇到暴力破解时解决的步骤

### 1. 查询攻击者IP

查询到相关服务登录授权日志，如ssh登录日志在**/var/log/secure**，找到相关IP尝试的登录次数，如使用命令

```shell
cat /var/log/secure | awk ‘/Failed/{print $(NF-3)}’ | sort | uniq -c | awk ‘{print $2″ = “$1;}’
```

### 2. 加入到拒绝文件

将异常的IP地址增加到**/etc/hosts.deny**文件中。

> 以上的这一切是基于手动配置的，使用`denyhosts`可以实现自动化的异常IP屏蔽

## 使用Denyhosts阻止暴力破解

### 1. 下载解压并安装

```shell
# 下载DenyHost
wget http://soft.vpser.net/security/denyhosts/DenyHosts-2.6.tar.gz# tar zxvf DenyHosts-2.6.tar.gz
# 解压缩DenyHosts-2.6.tar.gz
tar -zxvf DenyHosts-2.6.tar.gz
# 进入DenyHosts-2.6
cd DenyHosts-2.6
# 执行安装（默认安装后的目录是/usr/share/denyhosts/）
python setup.py install
```

### 2. 修配置文件名称

```shell
# 进入DenyHost安装目录
cd /usr/share/denyhosts/
# 更改启动和配置文件名称
cp denyhosts.cfg-dist denyhosts.cfg
cp daemon-control-dist daemon-control
```

### 3. 常用的配置项说明

```
# denyhosts.cfg的配置内容看似很多，如果仔细阅读其实配置十分简单，具体如下：

# ssh登录日志路径
SECURE_LOG = /var/log/secure

# 拒绝主机的文件路径
HOSTS_DENY = /etc/hosts.deny

# 清除拒绝主机的时效，为空表示永久不清除
PURGE_DENY =

# 定义主机最多清除几次，超过指定次数将永不清除
PURGE_THRESHOLD = 0

# 禁止的服务名称
BLOCK_SERVICE  = sshd

# 允许无效用户失败的次数
DENY_THRESHOLD_INVALID = 5

# 允许有效用户失败的次数
DENY_THRESHOLD_VALID = 10

# 允许root登陆失败的次数
DENY_THRESHOLD_ROOT = 1

# 设置DenyHost写入资料文件
DENY_THRESHOLD_RESTRICTED = 1

# 拒绝的主机或IP记录的路径
WORK_DIR = /usr/share/denyhosts/data
```

### 4. 启动DenyHost

```shell
# 启动脚本赋予执行权限
chmod u+x daemon-control
# 启动DenyHost
./daemon-control start
```