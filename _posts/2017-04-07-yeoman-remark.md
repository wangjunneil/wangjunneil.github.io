---
title: 使用Yeoman构建站点说明备注
name: yeoman-remark
date: 2017-04-07
tags: [yo,yeoman]
categories: [Web]
---

* 目录
{:toc}

---

# 使用Yeoman构建站点说明备注

## 1. 关于安装

安装参看官网 [http://yeoman.io/learning/index.html](http://yeoman.io/learning/index.html)

> 安装需要`nodejs`的支持

## 2. 创建工程

```shell
# 生成标准的angular工程
yo angular
```

> 也可以使用`yo`命令交互式的创建工程，更多的生成器请参看 [http://yeoman.io/generators/](http://yeoman.io/generators/)

## 3. 发布版本

开发完毕后，需要进行发布为纯静态文件，编辑 **Gruntfile.js** 里的 cssmin 注视去掉

```shell
# 生成dist目录的静态文件
grunt build --force
```

> 开发中需要导入的js库需要使用`bower`进行安装，如`bower install jquery --save`

## 4. 导入工程

```shell
# 1. 克隆工程
git clone xxxxxxxxxxxxxx

# 2. 安装 npm 依赖
npm install

# 3. 安装 bower 依赖
bower install
```

## 附录A Angular跳转%2F的错误

**%2F**的跳转错误，angular1.6版本路由改变，前面需要增加感叹号，`href="#/index"` 改为 `href="#!/index"`。