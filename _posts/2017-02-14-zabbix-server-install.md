---
title: Centos7安装zabbix-server监控服务端
name: zabbix-server-install
date: 2017-02-14
tags: [zabbix]
categories: [Linux]
---

* 目录
{:toc}

---

# Centos7安装zabbix-server监控服务端

## 1. 安装zabbix仓库源

```shell
rpm -ivh http://repo.zabbix.com/zabbix/3.2/rhel/7/x86_64/zabbix-release-3.2-1.el7.noarch.rpm
```

## 2. 使用yum安装zabbix组件

```shell
yum install -y zabbix-server-mysql zabbix-web-mysql
```

## 3. 安装mysql数据库服务器

### 3.1 检查本机是否已经安装mysql
```shell
rpm -qa | grep mysql
```

### 3.2 安装mysql官方源
```shell
rpm -ivh http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm
```

### 3.3 使用yum安装mysql
```shell
yum install -y mysql mysql-server
```

### 3.4 启动mysql服务器
```shell
systemctl start mysqld.service
```

### 3.5 修改root默认密码
```sql
mysql -u root
use mysql;
update user set password=password('root') where user='root';
exit;
```

## 4. 创建zabbix数据库及用户
```sql
create database zabbix character set utf8 collate utf8_bin;
grant all privileges on zabbix.* to zabbix@localhost identified by 'zabbix';
flush privileges;
quit;
```

## 5. 初始化zabbix表及相关数据
```shell
zcat /usr/share/doc/zabbix-server-mysql-3.2.*/create.sql.gz | mysql -uzabbix -p zabbix
```

## 6. 配置zabbix服务的配置文件
```
# vi /etc/zabbix/zabbix_server.conf
DBHost=localhost
DBName=zabbix
DBUser=zabbix
DBPassword=zabbix
```

## 7. 编辑zabbix的php配置文件
```
# vi /etc/httpd/conf.d/zabbix.conf
php_value max_execution_time 300
php_value memory_limit 128M
php_value post_max_size 16M
php_value upload_max_filesize 2M
php_value max_input_time 300
php_value always_populate_raw_post_data -1
# 时区配置
php_value date.timezone Asia/Shanghai
```

## 8. 启动zabbix服务
```shell
systemctl start zabbix-server.service
```
> 若出现 **zabbix-server.service never wrote its PID file. Failing.** 的错误，在终端执行`setenforce 0`命令即可。

## 9. 启动http服务
```shell
systemctl start httpd
```

## 10. 开放相应的防火墙规则

防火墙规则不是必须的，若服务器配置了防火墙规则则应加上如下的规则。

```shell
# 运行localhost访问任意端口服务
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT
# 调用agent客户端端口
iptables -A OUTPUT -p tcp --dport 10050 -j ACCEPT
iptables -A INPUT -p tcp --sport 10050 -j ACCEPT
# 邮件报警端口
iptables -A OUTPUT -p tcp --dport 25 -j ACCEPT
iptables -A INPUT -p tcp --sport 25 -j ACCEPT
# web监控时http和https端口
iptables -A OUTPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --sport 80 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -p tcp --sport 443 -j ACCEPT
```

## 11. 浏览器打开web控制台

输入连接 **http://xxx.xxx.xxx.xxx/zabbix** 进行界面配置即可完成。默认的用户名密码是 **Admin**/**zabbix**。

## 附录A：邮件脚步报警

对于自定义的媒介脚本，应该放在"**/usr/local/zabbix/share/zabbix/alertscripts**"目录中，这样在配置自定义媒介时，zabbix-server才会识别到。

下面是python语言编写的自动发送邮件的脚本**mail.py**。

```python
#coding:utf-8

import smtplib
from email.mime.text import MIMEText
import sys

mail_host = 'smtp.163.com'
mail_user = 'vinny@163.com'
mail_pass = 'vinny123'
mail_postfix = '163.com'

def send_mail(to_list,subject,content):
    me = "Zabbix监控告警平台"+"<"+mail_user+"@"+mail_postfix+">"
    msg = MIMEText(content, 'plain', 'utf-8')
    msg['Subject'] = subject
    msg['From'] = me
    msg['to'] = to_list
    try:
        s = smtplib.SMTP()
        s.connect(mail_host)
        s.login(mail_user,mail_pass)
        s.sendmail(me,to_list,msg.as_string())
        s.close()
        return True
    except Exception,e:
        print str(e)
        return False
if __name__ == "__main__":
    send_mail(sys.argv[1], sys.argv[2], sys.argv[3])
```