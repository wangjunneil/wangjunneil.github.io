---
title: 服务器上的iptables防火墙应该如何配置才能更安全
name: iptables-security-policy
date: 2016-9-12
tags: [iptables,iptables安全测策略,防火墙]
categories: [Whitehat]
---

新入网的服务器在不做任何配置的情况下将会出现很多安全问题。端口肆意暴露、来源请求不明，恶意的数据包源源不断的流入服务器中。

公有云或许会控制非常用端口的访问，只开通如22、80、8080或者8443这样的常用端口，尽管屏蔽了大多数端口，但有效的做好防火墙规则仍然很重要。

下面流程化说明防火墙配置步骤

# 1. 封口

将输入、输出、转向的数据包丢弃，对服务器进行彻底隔离，在封闭的环境中配置规则。这里值得提醒的是此操作需要在本机执行，因为 `telnet` 或者 `ssh` 的连接会当即断开。

```shell
 # 丢弃输入数据流向 
iptables -P INPUT DROP
 # 丢弃输出数据流向 
iptables -P OUTPUT DROP
 # 丢弃转向数据流向 
iptables -P FORWARD DROP
```

# 2. 开放SSH服务

首先确保 `ssh` 远程连接开放，添加对 ssh 服务的出入站规则，正常端口为22（端口应该更换成非22）

```shell
# 允许任务来源接入服务器的22端口
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
# 允许服务器通过22端口向任何来源发送数据包
iptables -A OUTPUT -p tcp --sport 22 -j ACCEPT
```

做好以上的 ssh 服务规则后，任何来源等可以连接，若要求更高级的安全则可以添加准入IP，可以添加多条，其他服务同理。

```shell
# 允许来源IP为221.4.12.28的地址访问服务器的22端口，即ssh服务
iptables -I INPUT -s 221.4.12.28 -p tcp --dport 22 -j ACCEPT
```

# 3. 启用Ping命令

当执行 `ping` 命令时，其实是向目标地址发送 **icmp** 的数据包并得到回显信息。在服务器内部 ping 外部地址时，属于 **OUTPUT**，由于服务器的输出已经被DROP掉，所以服务器目前 ping 不通任何外部 IP 地址，考虑到运维的需要，添加允许 ping 外部IP的规则。

```shell
# 允许服务器向外部发送icmp的数据包
iptables -A OUTPUT -p icmp --icmp-type echo-request -j ACCEPT
# 允许服务器接收来自外部服务器返回的icmp数据包
iptables -A INPUT -p icmp --icmp-type echo-reply -j ACCEPT
```

目前服务器可以 ping 外部IP地址了，但外部来源 ping 服务器是不通的。**选择不开放来自外部的 ping 请求或许是一个好想法**，这样可以迷惑扫描工具避免暴露主机的存活性(高级的扫描工具除外，如 nmap)。

下面是服务器接收和响应 ping 请求的出入站规则

```shell
# 允许任何来源向服务器发送icmp的数据包
iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT
# 允许服务器向任何来源回显icmp的数据包
iptables -A OUTPUT -p icmp --icmp-type echo-reply -j ACCEPT
```

# 4. 启用DNS服务

服务器 ping 外部IP地址正常了，但 ping 外部的域名时则会显示 **unknown host** 的错误，这是因为 DNS 服务的53端口没有配置出入站规则。

下面是 DNS 服务的规则:

```shell
iptables -A INPUT -p udp -i eth0 --sport 53 -j ACCEPT
iptables -A OUTPUT -p udp -o eth0 --dport 53 -j ACCEPT
```

# 5. 下载软件

现在服务器需要从外部下载某些软件，通常我们会使用 `wget` 或者 `curl` 这样的工具，执行时发现一直卡着不动。这是因为服务器访问外网的80端口出站和入站规则没有配置，需要添加，如下：

```shell
iptables -A OUTPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --sport 80 -j ACCEPT
```

**备注**：使用类似与nginx代理转发到内网主机上某个服务时，同样也需要添加如上规则。如转发到内网 **192.168.1.22** 上的 **48443**的服务，规则如下：

```shell
iptables -A OUTPUT -p tcp --dport 48843 -j ACCEPT
iptables -A INPUT -p tcp --sport 48843 -j ACCEPT
```

# 6. 启用本地回路loopback

本地回路即 **localhost**，运维时通常会使用本地回路判断某些服务是否正常，这个必要有。

```shell
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT
```

# 7. 应用端规则

应用端规则指的是如 nginx、apache 等应用，启动后，默认情况下外网是不能访问的。如需要开通 nginx 的 **80** 和 **443** 端口，其他应用类似。

```shell
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 443 -j ACCEPT
```
___

经过上面配置，基本能满足服务器端的安全需要，由于目前操作系统已经趋于成熟化，补丁打的及时基本可以杜绝服务器端被黑。大多数情况是部署在服务器上自身的应用存在问题，所以仅仅控制好服务器上的访问权还是不行，更多的是应用程序的安全稳定性才是关键。