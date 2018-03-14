---
title: linux使用expect不阻塞式静默的输入与执行
name: linux-expect
date: 2016-7-16 12:00
tags: [linux,expect]
categories: [Linux]
---


# linux使用expect不阻塞式静默的输入与执行

## 1. 背景

有时候需要写**shell**脚本进行自动化的一些操作，但难免会遇到输入拒止的状态，此时不得不先按提示进行输入后，进程才可以继续向下执行。expect可以以提示为条件，自动判断填充内容，让自动化进程完美无中断的执行完。

## 2. 安装

**[expect](http://expect.nist.gov/)**安装可以有多种方式，根据不同平台安装方式不同，但最通用的安装方式就是源码编译安装。由于expect的安装需要依赖Tcl，所以需要先安装Tcl，具体步骤如下：

```shell
# 下载Tcl源码包
wget http://nchc.dl.sourceforge.net/sourceforge/tcl/tcl8.4.11-src.tar.gz

# 解压tcl8.4.11-src.tar.gz
tar -zxvf tcl8.4.11-src.tar.gz

# 进入源码目录
cd tcl8.4.11/unix

# 编译安装
./configure --prefix=/usr/tcl --enable-shared
make
make install

# 拷贝tcl8.4.11/unix目录下的tclUnixPort.h到generic目录中
cp tclUnixPort.h ../generic/

# 下载expect源码包
wget http://sourceforge.net/projects/expect/files/Expect/5.45/expect5.45.tar.gz/download\

# 解压expect5.45.tar.gz
tar -zxvf expect5.45.tar.gz

# 进入源码目录
cd expect5.45

# 编译安装
./configure --prefix=/usr/expect --with-tcl=/usr/tcl/lib --with-tclinclude=/root/tcl8.4.11/generic
make
make install

# 建立软连接
ln -s /usr/tcl/bin/expect /usr/bin/expect
```

## 3. 使用

|名称|含义|
|--|--|
|spawn|激活unix程序来进行交互式的运行|
|expect|支持正规表达式并能同时等待多个字符串，并对每一个字符串执行不同的操作|
|send|等待进程的某些字符串|
|interact|执行完成后保持交互状态，把控制权交给控制台，若没有则进程直接退出|

## 4. 案例

```shell
#!/usr/bin/expect

# 激活ssh远程连接进程
spawn /usr/bin/ssh root@192.168.1.199
expect {
    # 此password是ssh进程回显提示的信息
    "password:" {
        # 若是"password"字符串的提示信息，发送密码
        send "123456789\r"
    }
}
interact {
    # 保持ssh不断开，每60秒发送一个空串
    timeout 60 { send " " }
}
```