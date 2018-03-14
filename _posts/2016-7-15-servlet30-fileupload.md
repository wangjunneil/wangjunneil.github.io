---
title: servlet3.0最简单的文件上传处理
name: servlet30-fileupload
date: 2016-7-15 12:00
tags: [servlet3.0,fileupload]
categories: [Java]
---


# servlet3.0最简单的文件上传处理

曾几何时java中上传文件是多么的繁琐，需要依赖第三方库文件。如今servlet3.0中新的Part类完美解决了这个问题，不需要多少代码就可以完成最简单的文件上传操作，具体代码如下：

**html前端上传代码**

```html
<form action="ServletFileUpload" method="post" enctype="multipart/form-data">
    <input type="file" id="file" name="file" />
    <input type="submit" value="upload" />
</form>
```

**servlet后端处理代码**

```java
package com.wangjunneil.servlet;

import javax.servlet.*;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "ServletFileUpload", urlPatterns = {"/ServletFileUpload"})
@MultipartConfig(location = "/tmp", fileSizeThreshold = 1024 * 1024, maxFileSize=1024 * 1024 * 5, maxRequestSize = 1024 * 1024 * 5 * 5)
public class ServletFileUpload extends HttpServlet {
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Part part = request.getPart("file");
        part.write(getServletContext().getRealPath("/uploads") + "/" + part.getSubmittedFileName());

        PrintWriter out = response.getWriter();
        out.println("file upload success");
        out.close();
    }
}
```

