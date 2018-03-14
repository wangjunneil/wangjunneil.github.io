---
title: C#串口获取称重设备的实现方案
name: serial-port-weight
date: 2017-07-14
tags: [串口,电子秤,c#,c]
categories: [Other]
---

* 目录
{:toc}

---

# C#串口获取称重设备的实现方案

## 1. 串口概念

串口即是com口，笔记本电脑没有串口，现在的台式机有串口的也很少，需要另配串口卡，一般位于机箱后面的9针公口（非VGA口）。实现串口通信的协议有多种，常用的是**RS232**协议，只要输入设备存在串口就可以通过标准协议读取此设备的数据。

串口通信是双向的，既可以获取数据，也可以向设备发送指令数据，这个要看设备具体是否支持指令的发送。通常发送指令的目的是变更设置、获取数据（非连续输出）、开关设备等。

> 本文中的串口设备使用的称重设备，电子秤、地磅，只负责读取，不写入。

## 2. 一些提示

* **串口线** 购买串口线时需要看清楚设备的串口是9针的还是25针的、公口还是母口。串口线是否支持热插拨，**不支持热插拨的串口线，需要关闭电源再进行插入和拔出，否则串口线会损坏**。

* **参数调整** 需要接入的串口设备通常情况下都是出厂设置，需要手动配置或查看此设备的波特率、校验位、数据位、传输方式等信息，说明书或仪表盘上可以得到。

> 波特率使用设备缺省的即可，若将设备的校验位设置为空，则数据位随意。传输方式需要设置为连续输出，连续输出的意思是当COM口打开时设备不停的向串口发送数据，除了连续输出还有指令输出，即只有发送指令设备才向COM口发送数据。

## 3. 实现代码

使用**C#**操作串口使用`SerialPort`类，实现的步骤为设置串口参数、打开串口监听、获取数据事件、关闭串口，主要代码如下：

```c#
// -------------------- 定义串口对象及委托事件 --------------------
private SerialPort Com_SerialPort = new SerialPort();
private delegate void UpdateTextEventHandler(string data);
private UpdateTextEventHandler updateText;

private void SerialForm_Load(object sender, EventArgs e)
{
	// 注册委托事件，核心
	updateText = new UpdateTextEventHandler(UpdateTextBox);
}

private void button1_Click(object sender, EventArgs e)
{
	Com_SerialPort.PortName = "COM1";	// 使用哪个串口
	Com_SerialPort.BaudRate = 9600;	// 波特率
	Com_SerialPort.DataBits = 7;		// 数据位
	Com_SerialPort.Parity = Parity.None;	// 校验位
	Com_SerialPort.StopBits = StopBits.None;// 停止位
	Com_SerialPort.Open();
	Com_SerialPort.ReceivedBytesThreshold = 1;
	Com_SerialPort.DataReceived += new SerialDataReceivedEventHandler(Com_SerialPort_DataReceive);
}

void Com_SerialPort_DataReceive(object sender, SerialDataReceivedEventArgs e)
{
	Thread.Sleep(20); // 时间短可能导致数据读取不完整
	string data = Com_SerialPort.ReadExisting();
	this.Invoke(updateText, new string[] { data });
}

// 核心方法，当打开串口时，串口设备会不停调用此方法
private void UpdateTextBox(string text)
{
	// 这里的text就是设备输入的数据
	label1.text = text;
}
```

> 每个设备输入的协议会有所不同，即UpdateTextBox方法中的text变量不同，如"30 726 00"，30代表称重设备的稳定状态，38代表不稳定，726代表称重重量，即72.6kg，所以text需要根据设备具体的输出区别对待。

## 4. 测试程序

下面的程序是当时为了便于调测串口称重设备时做的，包含基本的称重数据读取及原始数据的输出，不支持发送指令。

![称重程序截图](http://ohdpyqlwy.bkt.clouddn.com/12-15-54.png)

链接: [http://pan.baidu.com/s/1o8oLe7w](http://pan.baidu.com/s/1o8oLe7w)  密码: **tdei**

> **SerialDemo.zip**源码保存在个人百度网盘的**博客保存的源码**目录中（给自己看的）

