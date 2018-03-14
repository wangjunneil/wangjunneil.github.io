---
title: 使用Lets Encrypt为站点快速部署SSL证书
name: lets-encrypt-ssl
date: 2017-10-27
tags: [ssl,https]
categories: [Linux]
---

* 目录
{:toc}

---

# 使用Lets Encrypt为站点快速部署SSL证书

## 使用背景

时常搜索"免费ssl证书"，申请和验证步骤很麻烦，审核时间也不定，"**[Lets Encrypt](https://letsencrypt.org/)**"是一个倡导互联网上所有网站都该使用https的组织，提供免费的ssl证书服务。

## 下载安装脚本

下载Github上贡献者做好的安装脚本，如下：

```shell
wget https://raw.githubusercontent.com/xdtianyu/scripts/master/lets-encrypt/letsencrypt.conf
wget https://raw.githubusercontent.com/xdtianyu/scripts/master/lets-encrypt/letsencrypt.sh

# 赋予执行权限
chmod +x letsencrypt.sh
```

## 配置相关信息

使用`vi letsencrypt.conf`打开配置文件，将里面的 **example.com** 换成自己的域名，如下：

```
# only modify the values, key files will be generated automaticly.
ACCOUNT_KEY="letsencrypt-account.key"
DOMAIN_KEY="tiger.com.key"
DOMAIN_DIR="/usr/local/openresty/nginx/html"
DOMAINS="DNS:test.tiger.com"
#ECC=TRUE
#LIGHTTPD=TRUE
```

按以往免费申请ssl的经历，通常都需要验证域名的所属权，不是通过配置二级域名验证就是需要在网站根目录上传验证文件，经过试用 **Lets Encrypt**，发现它使用的是第二种方式。

所以在使用nginx做动态代理时，需要先注释掉，使用基本的静态文件方式配置nginx的虚拟主机以便 **Lets Encrypt** 去做验证，等ssl安装好之后在配置成动态代理即可。

**所以上述配置文件中的 DOMAIN_DIR 很重要，否则会执行失败**

## 执行证书生成

```shell
./letsencrypt.sh ./letsencrypt.conf
```

没有什么错误就会生成如下的几个文件，其中**tiger.chained.crt**和**tiger.com.key**就是需要的文件。

```
letsencrypt-account.key
tiger.crt
tiger.csr
tiger.chained.crt
tiger.com.key
```

## 配置证书安装

这里使用nginx进行证书安装的服务器

```
server {
	listen       443;
	server_name  test.tiger.com;

    ssl on;
    ssl_certificate tiger.chained.crt;
    ssl_certificate_key tiger.com.key;
    ssl_session_timeout 5m;

    location / {
        root html;
        index  index.html index.htm;
    }
}
```

