## Nmap常用选项
**-sS** 隐秘执行TCP扫描，确定某个特定TCP端口是否开放
**-Pn** 不使用ping命令预先判断主机存活，而是默认所有主机是存活状态，避免主机不允许ping而漏掉实际存货主机
```shell
nmap -sS -Pn 221.6.35.18
```
**-A** 尝试进行深入的服务枚举和旗标获取，提供目标系统更详细的细节信息
```shell
nmap -sS -Pn -A 221.6.35.18
```
**-oX** 生成基本的XML报告文件
```shell
nmap -sS -Pn -A -oX hosts.xml 192.168.1.0/24
```
高级Nmap扫描技巧：TCP空闲扫描 ?


## 在Metasploit中使用数据库
```shell
# 查看数据库连接状态
db_status
# 连接远程数据库
db_connect postgres:toor@127.0.0.1/msfbook
# 导入nmap生成的xml报告文件到metasploit中
db_import hosts.xml
# metsaploit中使用nmap
db_nmap -sS -A 221.6.35.18
```
## 在Metasploit中的第三方扫描
```shell
# 搜索端口扫描的辅助模块
search portscan
auxiliary/scanner/portscan/syn
```

## Web应用防护系统识别
**Web应用防护系统** （也称：网站应用级入侵防御系统。英文：Web Application Firewall，简称： WAF）。利用国际上公认的一种说法：Web应用防火墙是通过执行一系列针对HTTP/HTTPS的安全策略来专门为Web应用提供保护的一款产品。
```shell
wafw00f http://baidu.com
```

## Google Hacker


---
## 名词解释
**Penetration Testing** 渗透测试
**IDS** 入侵检测系统
**IPS** 入侵防御系统

## 相关链接
**[渗透测试执行标准](http://www.pentest-standard.org)**