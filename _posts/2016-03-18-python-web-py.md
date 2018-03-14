---
title: Python中的web.py一个简单且功能强大的Python web框架
name: python-web-py
date: 2016-03-18
tags: [web.py]
categories: [Python]
---

# Python中的web.py功能强大的Python web框架

## 介绍

**[web.py](http://webpy.org/)**是python的一个前段web框架，它比java简单小巧，功能毫不逊色于java上的web开发，不需要外置的容器，简单小巧实用强大是web.py的优点所在。

## 安装

安装web.py有三种方式

* 下载[http://webpy.org/static/web.py-0.37.tar.gz](http://webpy.org/static/web.py-0.37.tar.gz)，拷贝到应用目录即可。若要所有应用都可以使用，则需要执行`python setup.py install`
* 使用**easy_install**的方式安装，`easy_install web.py`
* 使用pip方式安装，`pip install web.py`

## 简单的RESTFUl风格应用

```python
import web

urls = (
    '/(.*)', 'hello'
)

app = web.application(urls, globals())

class hello:
    def GET(self, name):
        if not name:
            name = 'World'
        return 'Hello, ' + name + '!'

if __name__ == "__main__":
    app.run()
```

## 测试上面简单的应用

```shell
# 模拟请求
curl http://localhost:8080/wangjun
```

## 静态html模板

上面的小例子请求返回的只是一串字符串，在python中写html代码不是一个很好的选择，正常的web应用少不了html文件。使用python的模板功能可以让你在html文件中像写python脚本一样，具体请看下节动态html模板，这节只讨论静态html模板。
首先在应用目录创建一个template的文件夹用于存放html文件，这里我们编写一个名叫abc.html的文件，内容如下：

```html
<h3>Hello</h3>, world!
```

可以看见这个html文件很简单，只是输出一串文字，但”Hello“的字符串使用了html的标记H3，下面的我们改造下第2节的python应用代码，如下：

```python
#!/usr/bin/python

import web

# 告诉python去哪里找html模板
render = web.template.render('templates/')

urls = (
    '/(.*)','hello',
)

app = web.application(urls, globals())

class hello:
    def GET(self, name):
        if not name:
            name = 'World'
        elif name == "abc":
            # 使用"render.模板名称"定位模板，例如上面创建的abc.html
            return render.abc()
        return "Hello, " + name + "!"

if __name__ == "__main__":
    app.run()
```

## 动态html模板

动态html模板的含义是我们可以在html模板中使用变量、循环、判断等逻辑表达式操作模板的具体显示内容，类似于java中的freemarker或者velocity。为了更好的说明，我们将abc.html文件改造如下：

```html
$def with (name)

$if name:
    <b>Hello</b>, $name
$else:
    <b>Hello</b>, World!
```

```python
#!/usr/bin/python

import web

render = web.template.render('templates/')

urls = (
    '/(.*)','hello',
)

app = web.application(urls, globals())

class hello:
    def GET(self, name):
        if not name:
            name = 'World'
        elif name == "abc":
            # 这里定义一个变量name，用于模板中的使用
            name = 'WangJun'
            # 将name变量传入abc模板中，注意变量的名称需要和模板的def名称匹配
            return render.abc(name)
        return "Hello, " + name + "!"

if __name__ == "__main__":
    app.run()
```

更多模板的高级语法请[点击](http://webpy.org/docs/0.3/templetor)参看。

## 获取用户输入

```python
#!/usr/bin/python
#coding:utf-8
 
import web
 
render = web.template.render('templates/')
 
urls = (
    '/(.*)','hello',
)
 
app = web.application(urls, globals())
 
class hello:
    def GET(self, name):
        if not name:
            name = 'World'
        elif name == "abc":
            # 请求地址 http://localhost:8080/abc?email=kowww@gmail.com
            # 获取用户输入
            i = web.input()
            return render.abc(i.email)
        return "Hello, " + name + "!"
 
if __name__ == "__main__":
    app.run()
```

## 数据库操作

```python
#!/usr/bin/python
#coding:utf-8
 
import web
 
render = web.template.render('templates/')
# 获取数据库对象
db = web.database(dbn="mysql",user="root",pw="root",db="wangjunneil",host="192.168.1.180",port=3306)
 
urls = (
    '/(.*)','hello',
)
 
app = web.application(urls, globals())
 
class hello:
    def GET(self, name):
        if not name:
            name = 'World'
        elif name == "abc":
            # 查询wordpress的所有文章并传入模板中
            posts = db.select('wp_posts')
            return render.abc(posts)
        return "Hello, " + name + "!"
 
if __name__ == "__main__":
    app.run()
```

```html
$def with (posts)
 
<ul>
    $for post in posts:
        <li id="$post.ID">$post.post_title</li>
</ul>
```

## 使用基本布局

基本布局的含义是所有页面头尾使用同一模板，中间内容自定义，父页面引用子页面定义的变量。

**[AppServ.py] 主应用文件 **
```python
# 指定基本布局名称，与其对应的是layout.html
render = web.template.render('www/', base='layout')
```

**[layout.html] 布局文件**
```html
[layout.html]
$def with (content)
<html>
<head>
    <meta charset="UTF-8">
    <title>$content.title</title>
    $if content.cssfiles:
        $for f in content.cssfiles.split():
            <link rel="stylesheet" href="$f" type="text/css" media="screen" charset="utf-8"/>
</head>
<body>
$:content
</body>
</html>
```

**[index.html] 子页面**
```html
$var title: This index title
$var cssfiles: css/style.css css/main.css
<h5>The Server is Running...</h5>
```

在子页面可以看出定义的变量`title`和`cssfiles`在 **layout.html** 中的到的引用，而子页面只需要编写`<body>` 标签中的内容即可。

## 模板串联

```python
render = web.template.render('templates')

def GET():
    article = render.article() # article.html
    comments = render.comments() # comments.html
    return render.index(unicode(article), unicode(comments))
```

> 使用模板串联就不能使用基本布局

## 重定向使用

```python
class Sms:
    def GET(self):
        # raise web.seeother('/')
        raise web.redirect('/')
```

## 响应xml内容

**[AppServ.py] 主应用文件 **
```python
class index:
    def GET(self, code):
        web.header('Content-Type', 'text/xml')
        return render.response(code)
```

**[response.xml]**
```xml
$def with (code)
<?xml version="1.0"?>
<RequestNotification-Response>
	<Status>$code</Status>
</RequestNotification-Response>
```

## 处理二进制请求

```python
lass RequestHandler():
    def POST():
        data = web.data()
```

## 拦截器和钩子

```python
# 请求拦截器
def request_process(handler):
    print 'before handling'
    result = handler()
    print 'alter handler'
    return result

app.add_processor(request_process)

# 请求钩子
def my_loadhook():
    web.header('Content-type', "text/html; charset=utf-8")

app.add_processor(web.loadhook(my_loadhook))
```

## 自定义NotFound信息

```python
def not_found():
    # return web.notfound("Sorry, the page you were looking for was not found.")
    return web.notfound(render.notfound()) # notfound.html
app.notfound = not_found

# 类似的，内部错误internalerror也可以被自定义
def internalerror():
    return web.internalerror("Bad, bad server. No donut for you.")
app.internalerror = internalerror
```

# 使用ssl安全证书

```python
from web.wsgiserver import CherryPyWSGIServer

CherryPyWSGIServer.ssl_certificate = "/root/Downloads/server.crt"
CherryPyWSGIServer.ssl_private_key = "/root/Downloads/server.key"
```

> 证书的生成请参看[Nginx常用配置汇总](http://vinny.cc/2017/03/nginx-general-config/)里的**HTTPS证书生成**章节。

## Session会话的使用

```python
session = web.session.Session(app, web.session.DiskStore('session'))
```

> 这里使用的是磁盘存储，也可以使用数据库存储session的方式

## 模板中使用Session

```python
render = web.template.render('templates', globals={'context': session})
```

```html
<span>You are logged in as <b>$context.username</b></span>
```

## 使用基本Http授权

```python
import web
import re
import base64

urls = (
    '/','Index',
    '/login','Login'
)

app = web.application(urls,globals())

allowed = (
    ('jon','pass1'),
    ('tom','pass2')
)


class Index:
    def GET(self):
        if web.ctx.env.get('HTTP_AUTHORIZATION') is not None:
            return 'This is the index page'
        else:
            raise web.seeother('/login')

class Login:
    def GET(self):
        auth = web.ctx.env.get('HTTP_AUTHORIZATION')
        authreq = False
        if auth is None:
            authreq = True
        else:
            auth = re.sub('^Basic ','',auth)
            username,password = base64.decodestring(auth).split(':')
            if (username,password) in allowed:
                raise web.seeother('/')
            else:
                authreq = True
        if authreq:
            web.header('WWW-Authenticate','Basic realm="Auth example"')
            web.ctx.status = '401 Unauthorized'
            return

if __name__=='__main__':
    app.run()
```

更多的高级使用方法请自行参考[在线中文版cookbook](http://webpy.org/cookbook/index.zh-cn)。