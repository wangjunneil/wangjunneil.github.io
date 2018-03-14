---
title: Python使用smtplib库测试发送邮件
name: python-smtplib-mail
date: 2016-02-19
tags: [smtplib]
categories: [Python]
---

# Python使用smtplib库测试发送邮件

如果你想编写一个简单的邮件测试客户端，python是个好工具，越发觉得python真是简单高效。下面是一个简单的python邮件客户端代码的实现。

```python
from smtplib import SMTP_SSL
from email.header import Header
from email.mime.text import MIMEText

mail_info = {
	"from" : "wangjunneil@163.com",
	"to" : "297489@qq.com",
	"hostname" : "smtp.163.com",
	"username" : "wangjunneil@163.com",
	"password" : "xxxxxxxxx",
	"mail_subject" : "python mail test",
	"mail_text" : "Hello World",
	"mail_encoding" : "utf-8"
}

if __name__ == '__main__':
	smtp = SMTP_SSL(mail_info["hostname"])
	smtp.set_debuglevel(1)

	smtp.ehlo(mail_info["hostname"])
	smtp.login(mail_info["username"], mail_info["password"])

	msg = MIMEText(mail_info["mail_text"], "plain", mail_info["mail_encoding"])
	msg["Subject"] = Header(mail_info["mail_subject"], mail_info["mail_encoding"])
	msg["from"] = mail_info["from"]
	msg["to"] = mail_info["to"]

	smtp.sendmail(mail_info["from"], mail_info["to"], msg.as_string())

	smtp.quit()
```