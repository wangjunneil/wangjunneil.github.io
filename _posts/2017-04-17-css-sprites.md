---
title: 使用css的sprites技术
name: css-sprites
date: 2017-04-17
tags: [css,sprites]
categories: [Web]
---

* 目录
{:toc}

---

# 使用css的sprites技术

## 什么是css的sprites

将众多资源图片文件统一整合到一张图片中，通过坐标位置使用资源图片，降低页面多资源图片的请求次数，提高页面加载速度。

## sprites的主要css属性

|属性名|属性含义|示例|
|----|----|----|
|**background-image**|为元素设置背景图像。默认地，背景图像位于元素的左上角，并在水平和垂直方向上重复。|`background-image:url(sprite0613v3.png)`|
|**background-repeat**|设置是否及如何重复背景图像。默认地，背景图像在水平和垂直方向上重复。|`background-repeat:no`|
|**background-position**|设置背景图像的起始位置。|`background-position:-102px -109px`|

## sprites怎么使用

下图为一个示例的sprites图片，可以看出多个图标资源聚集在一张图片中。

![sprites图片](http://ohdpyqlwy.bkt.clouddn.com/nav-b_z.png)

下面的代码是通过坐标定位到logo和红点的代码

```html
<html>
    <head>
    <meta charset="utf-8">
    <title>CSS sprites</title>
    <style type="text/css">
        div {
            background-image:url(nav-b_z.png);
            background-repeat:no
        }
        .logo{
            width: 120px;
            height: 30px;
            background-position:0px 0px
        }
        .play{
            width: 8px;
            height: 8px;
            background-position:-112px -150px
        }
    </style>
    </head>
<body>
<div class="logo"></div>
<br/>
<div class="play"></div>
</body>
</html>
```

最终展现如下：

![结果](http://ohdpyqlwy.bkt.clouddn.com/09-35-04.png)

## 通过photoshop如何找到坐标点

通过上面的代码可以知道，sprites的关键在于如何定位资源的x、y轴坐标以及它的长宽。将资源图片通过photoshop打开，点击菜单栏"**窗口**"调出"**信息窗口**"，通过"**矩形选择工具**"选择需要定位的资源，在信息窗口中得出需要的sprites值。

![photoshop使用sprites](http://ohdpyqlwy.bkt.clouddn.com/09-41-34.png)

> x、y坐标需要使用负数，0坐标除外。





