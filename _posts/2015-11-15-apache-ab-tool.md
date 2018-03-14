---
title: Apache ab命令行性能测试工具使用
name: apache-ab-tool
date: 2015-11-15
tags: [ab,apache]
categories: [Linux]
---

* 目录
{:toc}

---

# Apache ab命令行性能测试工具使用

## 介绍

**ab**是apache自带的性能测试工具，全称ApacheBench。ab进行的一切测试本质上是基于HTTP的。

## 参数说明

```
Usage: ab [options] [http[s]://]hostname[:port]/path
Options are:
    -n requests     发送的请求数
    -c concurrency  并发的用户数
    -t timelimit    测试所进行的最大秒数，默认无限制
    -s timeout      响应超时时间，默认30秒
    -b windowsize   tcp发送和接收数据的缓冲区大小
    -p postfile     post服务器文件，需制定-T
    -u putfile      put服务器文件，需制定-T
    -T content-type 指定content-type，默认是"text/plain"
    -v verbosity    How much troubleshooting info to print
    -w              以html的格式输出
    -C attribute    增加cookie，如'Apache=1234'
    -H attribute    增加header，如'Accept-Encoding: gzip'
    -A attribute    增加基本的www的授权
    -P attribute    增加代理服务器的授权
    -X proxy:port   代理服务器地址和端口配置
    -V              打印当前ab版本好
    -k              启用http中KeepAlive特性
    -g filename     Output collected data to gnuplot format file.
    -e filename     输出csv文件格式的报告
    -r              在socket接收发生错误时不退出
    -m method       制定http请求方法
```

## 使用事例

```
# 10个并发用户请求100次页面
ab  -c 10 -n 100 http://www.vinny.cc/
```

## 完整输出

```
This is ApacheBench, Version 2.3 <$Revision: 1663405 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking www.wangjunneil.com (be patient).....done

Server Software:        nginx/1.9.3
Server Hostname:        www.wangjunneil.com
Server Port:            80

Document Path:          /
Document Length:        21392 bytes

Concurrency Level:      10
Time taken for tests:   20.312 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      2178300 bytes
HTML transferred:       2139200 bytes
Requests per second:    4.92 [#/sec] (mean)
Time per request:       2031.214 [ms] (mean)
Time per request:       203.121 [ms] (mean, across all concurrent requests)
Transfer rate:          104.73 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:      114  136 141.8    115    1133
Processing:   934 1808 330.1   1754    2875
Waiting:      809 1584 305.2   1588    2152
Total:       1049 1944 345.8   1897    2990

Percentage of the requests served within a certain time (ms)
  50%   1897
  66%   2106
  75%   2222
  80%   2235
  90%   2336
  95%   2488
  98%   2926
  99%   2990
 100%   2990 (longest request)
```

## 输出说明

```
Server Software:        web服务器软件及版本
Server Hostname:        表示请求的URL中的主机部分名称
Server Port:            被测试的Web服务器的监听端口

Document Path:          请求的页面路径
Document Length:        页面大小

Concurrency Level:      并发数
Time taken for tests:   测试总共花费的时间
Complete requests:      完成的请求数
Failed requests:        失败的请求数，这里的失败是指请求的连接服务器、发送数据、接收数据等环节发生异常，以及无响应后超时的情况。对于超时时间的设置可以用ab的-t参数。如果接受到的http响应数据的头信息中含有2xx以外的状态码，则会在测试结果显示另一个名为“Non-2xx responses”的统计项，用于统计这部分请求数，这些请求并不算是失败的请求。
Write errors:           写入错误
Total transferred:      总共传输字节数，包含http的头信息等。使用ab的-v参数即可查看详细的http头信息。
HTML transferred:       html字节数，实际的页面传递字节数。也就是减去了Total transferred中http响应数据中头信息的长度。
Requests per second:    每秒处理的请求数，服务器的吞吐量，等于：Complete requests / Time taken for tests
Time per request:       平均数，用户平均请求等待时间
Time per request:       服务器平均处理时间
Transfer rate:          平均传输速率（每秒收到的速率）。可以很好的说明服务器在处理能力达到限制时，其出口带宽的需求量。

Connection Times (ms) 压力测试时的连接处理时间。
              min  mean[+/-sd] median   max
Connect:        0   67 398.4      9    3009
Processing:    49 2904 2327.2   2755   12115
Waiting:       48 2539 2075.1   2418   12110
Total:         53 2972 2385.3   2789   12119
```