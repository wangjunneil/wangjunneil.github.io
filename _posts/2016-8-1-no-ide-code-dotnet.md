---
title: 不使用visualstudio开发.netframework的windows应用
name: no-ide-code-dotnet
date: 2016-8-1 12:00
tags: [.net]
categories: [Other]
---

* 目录
{:toc}

---

# 不使用visualstudio开发.netframework的windows应用

对于**.net**开发人员来说，工具选择**visual studio**是不二的选择，毕竟**visual studio**是微软官方的IDE，里面的功能也非常全面，但也带来了很多负面的问题，工具庞大、占内存、屏蔽了很多底层实现等等。

## 1. 选择不使用visual studio的原因有

* 希望深入了解.net编译过程，不希望被图像界面蒙蔽双眼的
* 开发者或许出于某些原因，例如平台或工作环境的原因而无法安装VS
* 开发一个简单的应用，为了5kb大小去下载5G的IDE过于奢侈

## 2. 必备条件

* 一个简单的编辑工具，如记事板、notepad++或者vim
* .net framework库，winxp版本之后是默认安装到系统中的，一般位置在**C:\Windows\Microsoft.NET\Framework64**中

## 3. .Net framework介绍

在**.net framework**的目录中找到自己希望使用的版本，如我使用的是 **C:\Windows\Microsoft.NET\Framework64\v4.0.30319**，并将此路径放到系统的PATH变量中，需要使用此目录下的`csc.exe`和`msbuild.exe`两个程序。其中`csc.exe`就是C#编译器，而`msbuild.exe`则是负责读取项目文件（例如.csproj文件）并进行编译的工具。也就是说，当你拿到一个**visual studio**的项目源码，不需要安装visual studio也可以使用`msbuild.exe`对源代码进行编译处理。

## 4. .Net项目结构

通常来说，在新建Windows项目时，vs会自动创建一个**Program.cs**文件作为入口、一个包含了代码所依赖资源信息的.csproj文件、包含二进制名称、版本号等信息的AssemblyInfo.cs文件，以及包含了自定义配置信息的App.config文件。其中App.config这个文件主要的用途是配置一些相关的依赖信息，例如数据库连接字符串、Social Login的帐号等等。

## 5. 简单的控制台打印代码

创建hello.cs的文件，并编辑它，内容如下：

```c
using System;

namespace Hello
{
    public class Program
    {
    	static void Main()
    	{
        	Console.WriteLine("Console say Hello!");
    	}
    }
}
```

使用csc.exe进程编译并运行

```
E:\>csc /out:hello.exe hello.cs

Microsoft (R) Visual C# Compiler version 4.6.1038.0

Copyright (C) Microsoft Corporation. All rights reserved.

This compiler is provided as part of the Microsoft (R) .NET Framework, but only supports language versions up to C# 5, which is no longer the latest version. For compilers that support newer versions of the C# programming language, see http://go.microsoft.com/fwlink/?LinkID=533240


E:\>hello
Console say Hello!
```

## 6. 添加程序描述信息

右键属性程序时发现没有任何版权、版本等程序描述信息，此时可以通过assembly进行添加，修改后的代码如下：

```c
using System;
using System.Reflection;

[assembly: AssemblyTitle("Hello Application")]
[assembly: AssemblyCopyright("(C) 2016 Evan Wang")]
[assembly: AssemblyFileVersion("1.0.1")]

namespace Hello
{
    public class Program
    {
    	static void Main()
    	{
        	Console.WriteLine("Console say Hello!");
    	}
    }
}
```

## 7. 简单的图形界面应用

创建命令行程序简单，创建图片应用就需要引入Windows Forms的类库，片段代码如下：

```c
using System;
using System.Reflection;
using System.Windows.Forms;

[assembly: AssemblyTitle("Hello Application")]
[assembly: AssemblyCopyright("(C) 2016 Evan Wang")]
[assembly: AssemblyFileVersion("1.0.1")]

namespace Hello
{
    public class Program
    {
    	static void Main()
    	{
        	MessageBox.Show("Hello world!", "Console Terminal");
    	}
    }
}
```

## 8. 引入第三方库如何编译

下载好第三方sdk后，通常是dll文件，在编译时使用/r选项进行引入，如：

```
E:\>csc /out:hello.exe  /r:"C:\Program Files (x86)\AWS SDK for .NET\bin\Net35\AWSSDK.dll hello.cs

Microsoft (R) Visual C# Compiler version 4.6.1038.0

Copyright (C) Microsoft Corporation. All rights reserved.

This compiler is provided as part of the Microsoft (R) .NET Framework, but only supports language versions up to C# 5, which is no longer the latest version. For compilers that support newer versions of the C# programming language, see http://go.microsoft.com/fwlink/?LinkID=533240
```