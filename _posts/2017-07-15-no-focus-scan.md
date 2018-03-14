---
title: C#无焦点扫码实现方案
name: no-focus-scan
date: 2017-07-15
tags: [扫码,无焦点扫码,c#,c]
categories: [Other]
---

* 目录
{:toc}

---

# C#无焦点扫码实现方案

## 1. 背景说明

**无焦点扫码** 的意思是在没有选择输出源载体的情况下捕获扫枪的扫码事件，即没有聚焦输出源（记事本、文本框等）获取条码／二维码中的内容。

## 2. 程序说明

* `BarCodeHook`类是用于全局注册键盘钩子的核心类，一般不需要更改，直接放到工程中。
* `ScanCodeForm`类是具体调用BarCodeHook类的窗体，为了便于测试此窗体中输出使用无焦点的Label控件。

## 3. 调用方法

下面`ScanCodeForm`源码是具体怎么调用`BarCodeHook`类的窗体代码，此窗体含有两个Label，一个用于最终输出条码/二维码内容的**codeLabel**，一个是临时的**tempLabel**，这个临时的**tempLabel**不需要显示，设置为不可见即可，只是用于临时保存扫枪的字符数据，使用时你的窗体必须包含此控件，通过它的*textChange*事件最终拿到扫枪的输入值。

```c#
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace NoFocusScan
{
    public partial class ScanCodeForm : Form
    {
	// 定义BarCodeHook对象及其委托方法
        private BarCodeHook barCodeHook = new BarCodeHook();
        private delegate void ShowInfoDelegate(BarCodeHook.BarCodes barCode);

        public ScanCodeForm()
        {
            InitializeComponent();
        }

        private void ScanCodeForm_Load(object sender, EventArgs e)
        {
            // 注册扫枪委托事件
            barCodeHook.BarCodeEvent += new BarCodeHook.BarCodeDeletegate(BarCodeEvent);

            // 启动扫码钩子
            bool status = barCodeHook.Start();
            if (status)
            {
                this.codeLabel.Text = "等待扫码...";
            }
            else
            {
                this.codeLabel.Text = "启动失败";
            }
        }

        private void BarCodeEvent(BarCodeHook.BarCodes barCode)
        {
            ShowInfo(barCode);
        }

        private void ShowInfo(BarCodeHook.BarCodes barCode)
        {
            if (this.InvokeRequired)
            {
                this.BeginInvoke(new ShowInfoDelegate(ShowInfo), new object[] { barCode });
            }
            else
            {
                // 使用隐藏的tempLabel来储存扫码字符，扫码读取会改变隐藏label的字符，
		// 同时触发自身的tempLabel_TextChanged事件
                tempLabel.Text += barCode.IsValid ? barCode.BarCode : "";
            }
        }

        /// <summary>
        /// Form窗体关闭事件
        /// </summary>
        private void ScanCodeForm_FormClosed(object sender, FormClosedEventArgs e)
        {
            // 卸载注册的钩子
            barCodeHook.Stop();
        }

        /// <summary>
        /// 扫码读取的字符事件
        /// </summary>
        private void tempLabel_TextChanged(object sender, EventArgs e)
        {
            // 这里code就是最终得到的条码/二维码字符
            string code = tempLabel.Text;

            codeLabel.Text = tempLabel.Text;

            // 扫完得到二维码就清空临时tempLabel，避免再次进入textchange事件
            this.tempLabel.TextChanged -= new EventHandler(tempLabel_TextChanged);
            this.tempLabel.Text = "";
            this.tempLabel.TextChanged += new EventHandler(tempLabel_TextChanged);
        }
    }
}
```

## 3. 中文问题

条形码的输出是字母或者数字，不会有问题。二维码可能含有中文或Unicode等字符时，一般不能正常读取到。首先确认的是二维码扫枪是否支持中文解码，支持中文的二维码扫枪因为需要内置解码器所以成本较高，市面上目前现在大部分的二维码扫枪都不可以支持中文。

> `BarCodeHook`类未测试支持中文的二维码扫枪

## 4. 源码下载

链接: [http://pan.baidu.com/s/1o8oLe7w](http://pan.baidu.com/s/1o8oLe7w)  密码: **tdei**

> **NoFocusScan.zip**源码保存在个人百度网盘的**博客保存的源码**目录中（给自己看的）



