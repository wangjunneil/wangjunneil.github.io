---
title: Linux中文本文件去除回车换行
name: text-ctrl-enter
date: 2015-08-06
tags: [回车换行]
categories: [Linux]
---

* 目录
{:toc}

---

# Linux中文本文件去除回车换行

## 背景

在windows中修改的文件上传至unix/linux中时，常常出现**^M**的字符，这种字符在windows中叫"**LFCR**"，asciis十进制字符分别为**10**和**13**，十六进制为**0x0A**和**0x0D**。这种字符在unix环境中常常导致如shell、xml等文件解析或者运行错误。

## 如何辨别

如何查看文件是否存在”^M“字符？

```shell
vi -b example.sh
```

## 如何修正

下面是4种方式删除"**^M**"字符

### dos2unix工具

``` shell
dos2unix example.sh
```

### vi编辑器替换命令

```shell
:%s/^M//g
```

> 这里的"**^M**"字符并不是**shift+6**和字母**M**组成，是**CTRL v** + **CTRL m**组成

### cat和tr命令

```shell
sed 's/^M//example.sh > example.sh.bak
mv example.sh.bak example.sh
```

> 这里的"**^M**"字符并不是**shift+6**和字母**M**组成，是**CTRL v** + **CTRL m**组成

### 使用ant工具

```xml
<target name="dos2unix" description="dos2unix">
    <replaceregexp  match="&#13;&#10;" replace="&#10;" flags="g" byline="false">
        <fileset dir="${basedir}">
            <include name="tools/*.sh" />
        </fileset>
    </replaceregexp>
</target>
```