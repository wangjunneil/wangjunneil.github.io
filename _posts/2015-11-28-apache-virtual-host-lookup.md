---
title: Apache虚拟主机的各种配置寻址方式
name: apache-virtual-host-lookup
date: 2015-11-28
tags: [apache,虚拟主机]
categories: [Linux]
---

* 目录
{:toc}

---

# Apache虚拟主机的各种配置寻址方式

## 1. 名称（域名）寻址

```
NameVirtualHost *

<VirtualHost *>
    DocumentRoot "E:/www/www.test.com"
    ServerName test.com
    ServerAlias www.test.com
    ErrorLog "logs/dummy-www.test.com-error.log"
    CustomLog "logs/dummy-www.test.com-access.log" common
</VirtualHost>

<VirtualHost *>
    DocumentRoot "E:/www/www.abc.com"
    ServerName abc.com
    ServerAlias www.abc.com
    ErrorLog "logs/dummy-www.abc.com-error.log"
    CustomLog "logs/dummy-www.abc.com-access.log" common
</VirtualHost>
```

应对IP紧张，一台apache服务器部署多个站点的解决方案。节点NameVirtualHost和VirtualHost指令参数相同，通过ServerName和ServerAlias进行寻址导向。

## 2. 默认名称（域名）寻址服务器

```
<VirtualHost *>
    DocumentRoot "E:/www/default"
    ServerName default
</VirtualHost
```

对于域名映射到服务器中，但服务器中没有配置或者配置错误了对应域名的虚拟主机，则跳转到默认虚拟机主机。

## 3. IP寻址

```
NameVirtualHost *

<VirtualHost 10.10.10.1>
    DocumentRoot "E:/www/www.test.com"
    ErrorLog "logs/dummy-www.test.com-error.log"
    CustomLog "logs/dummy-www.test.com-access.log" common
</VirtualHost>

<VirtualHost 192.168.3.7>
    DocumentRoot "E:/www/www.abc.com"
    ErrorLog "logs/dummy-www.abc.com-error.log"
    CustomLog "logs/dummy-www.abc.com-access.log" common
</VirtualHost
```

服务器上存在多个IP、网卡或者虚拟网卡，希望在每个IP地址上配置各自的虚拟主机。这里分别为192.168.3.7和10.10.10.1分配了虚拟主机。

## 4. 默认IP寻址服务器

```
<VirtualHost _default_>
    DocumentRoot "E:/www/default"
</VirtualHost
```

_default_关键字会建立虚拟主机，处理所有未设定虚拟主机的“地址:端口号”的请求。

## 5. 多个IP指定相同虚拟主机

```
<VirtualHost 10.10.10.1 192.168.3.7>
    DocumentRoot "E:/www/www.test.com"
    ErrorLog "logs/dummy-www.test.com-error.log"
    CustomLog "logs/dummy-www.test.com-access.log" common
</VirtualHost
```

希望在两个IP地址上显示相同的网页内容

## 6. 端口寻址

```
Listen 9999
<VirtualHost www.abc.com:9999>
    DocumentRoot "E:/www/port"
    ServerName abc.com
    ServerAlias www.abc.com
</VirtualHost
```

## 7. mod_vhost_alias创建大量虚拟主机

编辑httpd.conf文件

```
# 开启mod_vhost_alias模块（默认不开启）
LoadModule vhost_alias_module modules/mod_vhost_alias.so
# 增加一个虚拟主机的配置文件
Include conf/extra/much-vhosts.conf
```

编辑much-vhosts.conf文件

```
VirtualDocumentRoot "E:/www/%2+"
VirtualScriptAlias "E:/www/%2+"
```

这里配置了3个域名分别是www.aaa.com、www.bbb.com、www.ccc.com，对应的目录为E:/www/aaa.com、E:/www/bbb.com、E:/www/ccc.com，在much-vhosts.conf文件中配置的指向地址使用了mod_vhost_alias的变量%2+代替，意思是取请求域名最后两部分和虚拟主机目录对应。具体含义如下：

**mod_vhosts_alias变量值**

```
  0      整个名称
  1      名称的第一部分
 -1      名称的最后一部分
  2      名称的第二部分
 -2      名称的倒数第二部分
 2+      第二及之后的所有部分
-2+      倒数第二及之前的所有部分
```

**以www.abc.com域名举例**

```
%0			www.abc.com
%1			www
%2			abc
%3			com
%-1			com
%-2			abc
%-3			www
%-2.1		a
%-2.2+		bc
```