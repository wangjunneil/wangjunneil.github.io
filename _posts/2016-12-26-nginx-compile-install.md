---
title: 在Centos7下的nginx编译安装
name: nginx-compile-install
date: 2016-12-26
tags: [nginx, nginx安装, nginx编译]
categories: [Linux]
---


* 目录
{:toc}

# 在Centos7下的nginx编译安装

## 1. 安装依赖

```shell
yum -y install gcc gcc-c++ autoconf automake
yum -y install zlib zlib-devel openssl openssl-devel pcre-devel
```

## 2. 创建用户和组

```shell
groupadd -r nginx
useradd -s /sbin/nologin -g nginx -r nginx
```

## 3. 下载安装包

```shell
wget http://nginx.org/download/nginx-1.10.2.tar.gz
```

## 4. 编译配置与安装

```shell
# 解压缩
tar -zxvf nginx-1.10.2.tar.gz

# 进入压缩目录
cd nginx-1.10.2

# 进行模块配置
./configure \
  --prefix=/usr \
  --sbin-path=/usr/sbin/nginx \
  --conf-path=/etc/nginx/nginx.conf \
  --error-log-path=/var/log/nginx/error.log \
  --http-log-path=/var/log/nginx/access.log \
  --pid-path=/var/run/nginx/nginx.pid  \
  --lock-path=/var/lock/nginx.lock \
  --user=nginx \
  --group=nginx \
  --with-http_ssl_module \
  --with-http_flv_module \
  --with-http_stub_status_module \
  --with-http_gzip_static_module \
  --http-client-body-temp-path=/var/tmp/nginx/client/ \
  --http-proxy-temp-path=/var/tmp/nginx/proxy/ \
  --http-fastcgi-temp-path=/var/tmp/nginx/fcgi/ \
  --http-uwsgi-temp-path=/var/tmp/nginx/uwsgi \
  --http-scgi-temp-path=/var/tmp/nginx/scgi \
  --with-pcre

# 编译安装
make && make install
```

## 5. 安装路径

|名称|路径|
|---|---|
|日志目录|/var/log/nginx|
|配置目录|/etc/nginx|
|PID文件|/var/run/nginx/nginx.pid|
|启动文件|/usr/sbin/nginx|

## 6. centos6服务脚本

**创建文件**
```shell
touch /etc/rc.d/init.d/nginx
chmod +x /etc/rc.d/init.d/nginx
```

**启动脚本**
```shell
#!/bin/sh  
#  
# nginx - this script starts and stops the nginx daemon  
#  
# chkconfig:   - 85 15  
# description:  Nginx is an HTTP(S) server, HTTP(S) reverse \  
#               proxy and IMAP/POP3 proxy server  
# processname: nginx  
  
# Source function library.  
. /etc/rc.d/init.d/functions  
  
# Source networking configuration.  
. /etc/sysconfig/network  
  
# Check that networking is up.  
[ "$NETWORKING" = "no" ] && exit 0  
  
nginx="/usr/sbin/nginx"  
prog=$(basename $nginx)  
  
sysconfig="/etc/sysconfig/$prog"  
lockfile="/var/lock/nginx.lock"  
pidfile="/var/run/nginx/${prog}.pid"  
  
NGINX_CONF_FILE="/etc/nginx/nginx.conf"  
  
[ -f $sysconfig ] && . $sysconfig  
  
start() {  
    [ -x $nginx ] || exit 5  
    [ -f $NGINX_CONF_FILE ] || exit 6  
    echo -n $"Starting $prog: "  
    daemon $nginx -c $NGINX_CONF_FILE  
    retval=$?  
    echo  
    [ $retval -eq 0 ] && touch $lockfile  
    return $retval  
}  
  
stop() {  
    echo -n $"Stopping $prog: "  
    killproc -p $pidfile $prog  
    retval=$?  
    echo  
    [ $retval -eq 0 ] && rm -f $lockfile  
    return $retval  
}  
  
restart() {  
    configtest_q || return 6  
    stop  
    start  
}  
  
reload() {  
    configtest_q || return 6  
    echo -n $"Reloading $prog: "  
    killproc -p $pidfile $prog -HUP  
    echo  
}  
  
configtest() {  
    $nginx -t -c $NGINX_CONF_FILE  
}  
  
configtest_q() {  
    $nginx -t -q -c $NGINX_CONF_FILE  
}  
  
rh_status() {  
    status $prog  
}  
  
rh_status_q() {  
    rh_status >/dev/null 2>&1  
}  
  
# Upgrade the binary with no downtime.  
upgrade() {  
    local oldbin_pidfile="${pidfile}.oldbin"  
  
    configtest_q || return 6  
    echo -n $"Upgrading $prog: "  
    killproc -p $pidfile $prog -USR2  
    retval=$?  
    sleep 1  
    if [[ -f ${oldbin_pidfile} && -f ${pidfile} ]];  then  
        killproc -p $oldbin_pidfile $prog -QUIT  
        success $"$prog online upgrade"  
        echo   
        return 0  
    else  
        failure $"$prog online upgrade"  
        echo  
        return 1  
    fi  
}  
  
# Tell nginx to reopen logs  
reopen_logs() {  
    configtest_q || return 6  
    echo -n $"Reopening $prog logs: "  
    killproc -p $pidfile $prog -USR1  
    retval=$?  
    echo  
    return $retval  
}

case "$1" in
    start)
        rh_status_q && exit 0
        $1
        ;;
    stop)
        rh_status_q || exit 0
        $1
        ;;
    restart|configtest|reopen_logs)
        $1
        ;;
    force-reload|upgrade)
        rh_status_q || exit 7
        upgrade
        ;;
    reload)
        rh_status_q || exit 7
        $1
        ;;
    status|status_q)
        rh_$1
        ;;
    condrestart|try-restart)
        rh_status_q || exit 7
        restart
        ;;
    *)
        echo $"Usage: $0 {start|stop|reload|configtest|status|force-reload|upgrade|restart|reopen_logs}"
        exit 2
esac
```

**开机启动方式**
```shell
# 开机启动
chkconfig --add nginx
chkconfig --level 345 nginx on
chkconfig --list nginx

# 开机不启动
chkconfig nginx off
chkconfig --list nginx
```

## 7. centos7服务脚本

**创建文件**
```shell
touch /usr/lib/systemd/system/nginx.service
```

**启动脚本**
```shell
[Unit]
Description=nginx
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
ExecStart=/usr/sbin/nginx
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s stop
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

**开机启动方式**
```shell
# 开机启动
systemctl enable nginx.service

# 开机不启动
systemctl disable nginx.service

# 其他操作
systemcl ( status | start | stop | reload | restart ) nginx.service
```