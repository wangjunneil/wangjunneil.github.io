---
title: Crunch密码字典生成器
name: crunch-password-dic
date: 2015-12-02
tags: [crunch]
categories: [Blackhat]
---

* 目录
{:toc}

---

# Crunch密码字典生成器

## 介绍

[Crunch](https://sourceforge.net/projects/crunch-wordlist/)能按照你配置的规则生成密码字典，生成的字典字符序列可以输出到屏幕、文件或重定向到另一个程序中。

## 使用示例

```shell
# 以字符"abcdefg"生成最小3位最大6位的字符列表并输出屏幕
crunch 3 6 abcdefg

# 特殊字符需要转义，如下面斜杠后跟空格，对空格转义
crunch 3 6 abcdefg\

# 以字符"abcdefg1234567890"生成最小6位最大位的字符串序列并输出屏幕
crunch 6 8 abcdefg1234567890

# 使用字符集列表charset.lst中mixalpha-numeric-all-space为key的字符集生成6到位密码序列
# 并输出到wordlist.txt文件中
# 查看字符集列表文件 cat  /usr/share/crunch/charset.lst
crunch 1 8 -f charset.lst mixalpha-numeric-all-space -o wordlist.txt

# 调用密码库charset.lst，生成8位密码；
# 其中元素为密码库charset.lst中mixalpha-numeric-all-space的项；
# 格式为“两个小写字母+dog+三个小写字母”，并以cbdogaaa开始枚举（@代表小写字母）
crunch 8 8 -f charset.lst mixalpha-numeric-all-space -o wordlist.txt -t @@dog@@@ -s cbdogaaa

# 调用密码库charset.lst，生成2位和3位密码；其中元素为密码库charset.lst中ualpha的项；并且以BB开头
crunch 2 3 -f charset.lst ualpha -s BB

# crunch将会生成abc, acb, bac, bca, cab, cba，虽然数字4和5这里没用，但必须有
crunch 4 5 -p abc

# crunch将生成以“dog”“cat”“bird”为元素的所有密码组合：
# birdcatdog，birddogcat，catbirddog,  catdogbird, dogbirdcat, dogcatbird
crunch 4 5 -p dog cat bird

# 生成8位密码，每个密码至少出现两种字母
crunch 8 8 -d 2@

# 生成10位密码，格式为三个小写字母+一个符号+四个数字+两个符号，限制每个密码至少2种字母和至少3种数字
crunch 10 10 -t @@@^%%%%^^ -d 2@ -d 3% -b 20mb -o START

# 生成5位密码，格式为三个字母+两个数字，并限制每个密码最少出现2种字母
crunch 5 5 -d 2@ -t @@@%%

#生成5位密码，格式为小写字母+数字+符号+大写字母+数字，并以@4#S2开始，分割为10k大小
crunch 5 5 -s @4#S2 -t @%^,% -e @8 Q2 -l @dddd -b 10KB -o START
```

## 参数说明

|关键字|含义|
|----|----|
|-b|体积大小，比如后跟20mib|
|-c|密码个数（行数），比如8000|
|-d|限制出现相同元素的个数（至少出现元素个数），-d 3就不会出现zzfffffgggg之类的|
|-e|定义停止生成密码 ，比如-e 222222：到222222停止生成密码|
|-f|调用密码库文件，比如/usr/share/crunch/charset.lst|
|-i|改变输出格式|
|-l|与-t搭配使用|
|-m|与-p搭配使用|
|-o|保存为|
|-p|定义密码元素|
|-q|读取字典|
|-r|定义从某一个地方重新开始|
|-s|第一个密码，从xxx开始|
|-z|打包压缩，格式支持 gzip, bzip2, lzma, 7z|
|-t|定义输出格式（@代表小写字母，,代表大写字母，%代表数字，^代表符号）|

## 综合应用

```shell
# 在unix中使用命令管道将生成的字典重定向到破解程序中，如下：
crunch 2 4 abcdefghijklmnopqrstuvwxyz | aircrack-ng /root/Mycapfile.cap -e MyESSID -w-
crunch 10 10 12345 --stdout | airolib-ng testdb -import passwd -
```

> 除了crunch，类似的还有[Random Wordlist Generator](http://sourceforge.net/projects/random-wordlist-generator/)和[WordList Generator](http://sourceforge.net/projects/wlistgenerator/)等这样的密码生成工具，Crunch的优势在于可以结合其他破解工具直接进行重定向，而不必生成庞大的密码字典文件。