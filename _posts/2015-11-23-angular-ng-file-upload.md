---
title: Angular使用ng-file-upload组件ajax上传文件
name: angular-ng-file-upload
date: 2015-11-23
tags: [angular,ng-file-upload,文件上传]
categories: [Web]
---

* 目录
{:toc}

---

# Angular使用ng-file-upload组件ajax上传文件

## 介绍

**angular**的[ng-file-upload](https://github.com/danialfarid/ng-file-upload)组件是一个轻量级的ajax上传工具，主要有以下几种特性：
* 实时更新上传文件进度，可以在上传过程中，取消或者终止
* 在html5环境下支持文件拖拽上传
* 在html5环境下支持从剪切版粘贴图像和葱浏览器页面拖拽图像
* 在html5环境下使用ngImgCrop改变图片大小
* 在html5环境下支持暂停/继续上传图片
* 本地验证文件大小、类型、宽度高度
* 显示预览你选择的缩略图图片
* 使用FileAPI支持老的浏览器上传

## 使用步骤

## 1. 编写html页面代码，按顺序依次引入相应类库

```html
<!DOCTYPE html>
<html ng-app="UploadApp">
<head lang="en">
    <meta charset="UTF-8">
    <title>Angular上传测试</title>
    <!-- 引入angular基本类库 -->
    <script type="text/javascript" src="js/angular.min.js"></script>
    <!-- 引入ng-file-upload类库 -->
    <script type="text/javascript" src="js/ng-file-upload-all.min.js"></script>
    <script type="text/javascript" src="js/AppController.js"></script>
</head>
<body ng-controller="AppController">
</body>
</html>
```

## 2. 编写AppController.js文件控制层脚本

```js
// 初始化module并注入上传模块"ngFileUpload"
var uploadApp = angular.module("UploadApp", ["ngFileUpload"]);
// 定义controller并注入Upload对象
uploadApp.controller("AppController", ['$scope', '$http', 'Upload', function ($scope, $http, Upload) {
    console.log(Upload);
}]);
```

## 3. html页面加入上传按钮并加入ng-file-upload上传指令

```html
<!DOCTYPE html>
<html ng-app="UploadApp">
<head lang="en">
    <meta charset="UTF-8">
    <title>Angular上传测试</title>
    <script type="text/javascript" src="js/angular.min.js"></script>
    <script type="text/javascript" src="js/ng-file-upload-all.min.js"></script>
    <script type="text/javascript" src="js/AppController.js"></script>
</head>
<body ng-controller="AppController">
    <!-- 增加上传按钮并加上文件选择事件 -->
    <button ngf-select="uploadFiles($files)">上传</button>
</body>
</html>
```

## 4. 在AppController.js中编写文件选择事件代码并输出选中的文件对象，看文件对象是否被输出了

```js
// 初始化module并注入上传模块"ngFileUpload"
var uploadApp = angular.module("UploadApp", ["ngFileUpload"]);
// 定义controller并注入Upload对象
uploadApp.controller("AppController", ['$scope', '$http', 'Upload', function ($scope, $http, Upload) {
    // 选择文件上传事件
    $scope.uploadFiles = function(files) {
        console.log(files)
    }
}]);
```

## 5. 在AppController.js中完善请求上传代码

```js
var uploadApp = angular.module("UploadApp", ["ngFileUpload"]);
// 定义controller并注入Upload对象
uploadApp.controller("AppController", ['$scope', '$http', 'Upload', function ($scope, $http, Upload) {
    // 选择文件上传事件
    $scope.uploadFiles = function(files) {
        if (files && files.length) {
            Upload.upload({
                url: '/upload',
                data: { file: files }
            }).then(function (resp) {
                console.log(resp);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            });
        }
    }
}]);
```

## 6. 编写后端UploadServlet.java代码执行文件上传操作

编辑web.xml添加上传处理的servlet配置段

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
    <servlet>
        <servlet-name>UploadServlet</servlet-name>
        <servlet-class>com.bosyun.servlet.UploadServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>UploadServlet</servlet-name>
        <url-pattern>/upload</url-pattern>
    </servlet-mapping>
    <welcome-file-list>
        <welcome-file>index.html</welcome-file>
    </welcome-file-list>
</web-app>
```

实现上传处理的servlet代码

```java
package com.bosyun.servlet;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.*;
import java.util.List;

public class UploadServlet extends HttpServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String savePath = this.getServletContext().getRealPath("/WEB-INF/upload");  // 定义山川路径
        File file = new File(savePath);
        if (!file.exists() && !file.isDirectory()) file.mkdir(); // bu存在则创建

        // 这里使用的是common-file-upload.jar
        DiskFileItemFactory factory = new DiskFileItemFactory();
        ServletFileUpload upload = new ServletFileUpload(factory);
        upload.setHeaderEncoding("UTF-8");
        if(!ServletFileUpload.isMultipartContent(request)) {
            // 按照传统方式获取数据
            // ...
            return;
        }

        try {
            List<FileItem> list = upload.parseRequest(request);
            for(FileItem item : list) {
                if(item.isFormField()){ //如果fileitem中封装的是普通输入项的数据
                    String name = item.getFieldName();
                    String value = item.getString("UTF-8");
                    System.out.println(name + "=" + value);
                }else { //如果fileitem中封装的是上传文件
                    String filename = item.getName();
                    if(filename == null || filename.trim().equals(""))
                        continue;
                    filename = filename.substring(filename.lastIndexOf("\\")+1);
                    InputStream in = item.getInputStream();
                    FileOutputStream out = new FileOutputStream(savePath + "/" + filename);
                    byte buffer[] = new byte[1024];
                    int len = 0;
                    while((len=in.read(buffer)) > 0) {
                        out.write(buffer, 0, len);
                    }
                    in.close();
                    out.close();
                    item.delete();  // 删除临时文件
                }
            }
        } catch (FileUploadException e) {
            e.printStackTrace();
        }
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }
}
```