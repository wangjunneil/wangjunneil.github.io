---
title: Http的Header中Content-disposition消息头下载文件的备注
name: http-content-disposition
date: 2015-12-07
tags: [http,content-disposition,下载,文件下载,消息头]
categories: [Other]
---

# Http的Header中Content-disposition消息头下载文件的备注

## 文件下载方式

后端下载文件在存在文件路径时可以使用连接下载的方式下载文件。

若以URL的方式存储文件流则需要进行读取写入流的操作，Http中涉及到文件流的下载必须使用Content-disposition的消息头，当浏览器接受到含有此消息头的响应时会打开自己的文件下载框，让用户选择文件的下载路径，具体的消息头定义如下：

```java
response.setHeader("Content-Disposition", "attachment;filename=filename.zip");
```

通常为了在用户重复下载时保证不覆盖原来下载的文件，应该定义文件的下载名称，如：

```java
String fileName = Randmo.getRandomStr(8);
response.setHeader("Content-Disposition", "attachment;filename=" + fileName + ".zip");
```

如果用户希望保留原始文件的中文名称，如"你好世界.doc"，则应该编码文件名后在下载：

```java
String fileName = new String(filename.getBytes("GBK"),"ISO8859-1"));
response.setHeader("Content-Disposition", "attachment;filename=" + fileName + ".doc");
```

这时用户又希望一些文件，如word、excel能在浏览器中直接打开，当然前提是用户浏览器安装了扩展，这时应该：

```java
response.setContentType("application/x-msdownload;charset=GBK");
String fileName = new String(filename.getBytes("GBK"),"ISO8859-1")); 
response.setHeader("Content-Disposition", "attachment;filename=" + fileName + ".doc");
```

## 完整示例代码

```java
response.setContentType("image/jpeg");

// 随机数文件名
long date = System.currentTimeMillis();
String fileName = date+".jpg";

response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");

// 这个URL地址是一张二维码图片
String showQrCodeUrl = request.getParameter("showQrCodeUrl");

InputStream is = null;
OutputStream os = null;
try {
    try {
        os = response.getOutputStream();
        URL url = new URL(showQrCodeUrl);
        is = url.openStream();
        byte[] buffer = new byte[1024];
        int length = 0;

        while((length = is.read(buffer)) != -1){
            os.write(buffer, 0, length);
        }
    } finally {
        if (is != null) is.close();
        if (os != null) os.close();
    }
} catch (IOException e) {
    e.printStackTrace();
}
```