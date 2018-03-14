---
title: Centos7安装zabbix-agent监控客户端
name: zabbix-agent-install
date: 2017-02-15
tags: [zabbix]
categories: [Linux]
---

* 目录
{:toc}

---

# Centos7安装zabbix-agent监控客户端

## 1. 下载zabbix仓库并安装

```shell
rpm -ivh http://repo.zabbix.com/zabbix/2.4/rhel/6/x86_64/zabbix-release-2.4-1.el6.noarch.rpm
```

## 2. yum安装zabbix-agent客户端

```shell
yum install -y zabbix-agent
```

## 3. 编辑zabbix-agent配置文件

使用`vi /etc/zabbix/zabbixd.conf`编辑打开文件，修改的内容如下：

```
Hostname		= 客户端主机名称
SourceIP		= 客户端主机IP
Server			= Zabbix Server的IP地址
ServerActive		= Zabbix Server的IP地址
```

## 4. 检查服务端口的有效性

编辑`vi /etc/services`文件，检查是否存在并添加zabbix客户端端口，如下：

```
zabbix-agent    10050/tcp  Zabbix Agent
zabbix-agent    10050/udp  Zabbix Agent
zabbix-trapper  10051/tcp  Zabbix Trapper
zabbix-trapper  10051/udp  Zabbix Trapper
```

> 若服务器有配置防火墙规则，则添加zabbix-agent端口的出入站规则：

```shell
iptables -A INPUT -s 139.196.14.112 -p tcp --dport 10050 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 10050 -j ACCEPT
```

## 5. 启动zabbix-agent客户端服务

```shell
zabbix_agentd start
```
> 启动后应该使用`netstat -an | grep 10050`查看**10050**端口是否正常，若不正常，应该在查看 **/var/log/zabbix/zabbix_agentd.log** 日志文件查看异常原因。

出现 **zabbix_agentd [6954]: cannot create PID file [/var/run/zabbix/zabbix_agentd.pid]: [2] No such file or directory** 错误。

```shell
mkdir  -p /var/run/zabbix/
chown zabbix.zabbix /var/run/zabbix/
```

## 6. 检查服务是否正常启动

```shell
# 检查是否存在zabbix-agent进程
ps -ef | grep zabbix

# 检查10050端口是否处于监听状态
netstat -an | grep 10050
```
