---
title: Shell中的奇淫技巧汇总
name: shell-skill-general
date: 2017-04-12
tags: [shell,分辨率]
categories: [Linux]
---

* 目录
{:toc}

---

# Shell中的奇淫技巧汇总（不断更新）

## 1. 获取并根据分辨率执行相关方法

```shell
# 获取当前主机屏幕分辨率字符串
detectedresolution=$(xdpyinfo | grep -A 3 "screen #0" | grep dimensions | tr -s " " | cut -d" " -f 3)
##  A) 1024x600
##  B) 1024x768
##  C) 1280x768
##  D) 1280x1024
##  E) 1600x1200

case $detectedresolution in
	"1024x600" ) executeA ;;
	"1024x768" ) executeB ;;
	"1280x768" ) executeC ;;
	"1366x768" ) executeC ;;
	"1280x1024" ) executeD ;;
	"1600x1200" ) executeE ;;
	"1366x768"  ) executeF ;;
		  * ) executeA ;;
esac
}
```

## 2. 判断当前用户是否为root用户

```shell
# EUID为0表示具有root权限
echo $EUID # 0

# check root
if [[ $EUID -ne 0 ]]; then
	echo -e "You don't have admin privilegies, execute the script as root."
	exit
fi
```

## 3. 选择语句switch的使用

```shell
#!/bin/bash

# 定义一个选择语言的方法
function language {
	clear
	while true; do
		clear
		echo -e "[i] Select your language"
		echo "                                       "
		echo -e "      [1] English          "
		echo -e "      [2] German      "
		echo -e "      [3] Chinese   "
		echo "                                       "
		echo -n -e "[deltaxflux@fluxion]-[~] "
		read yn
		echo ""
		case $yn in
			1 ) english; invokeMethod; break ;;
			2 ) german; invokeMethod; break ;;
			3 ) chinese; invokeMethod; break;;
			skip ) english; skipme; break;;
			* ) echo "Unknown option. Please choose again"; clear ;;
		  esac
	done
}

language
```

## 4. 信号捕获并处理

```shell
#!/bin/bash

# 定义中断执行方法
function exitmode() {
	echo -e "clear temp file"
	exit 1
}

# 注册信号处理（使用命令`kill -l`查看所有支持的信号）
trap exitmode SIGINT SIGHUP

# 模拟一个10秒的任务
sleep 10
```

## 5. 加载loading的实现

```shell
# loading状态方法
function spinner {
	local pid=$1
	local delay=0.15
	local spinstr='|/-\'
		while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
			local temp=${spinstr#?}
			printf " [%c]  " "$spinstr"
			local spinstr=$temp${spinstr%"$temp"}
			sleep $delay
			printf "\b\b\b\b\b\b"
		done
	printf "    \b\b\b\b"
}

# 模拟耗时的任务
function execute() {
    sleep 5
}

echo -n "Loading..."

# 后台执行耗时的任务
execute &
# 启动loading效果
spinner "$!"

echo ""
```

## 6. 终端使用色彩字体

```shell
#!/bin/bash

# 标准颜色定义
Black='\e[0;30m'        # Black
Red='\e[0;31m'          # Red
Green='\e[0;32m'        # Green
Yellow='\e[0;33m'       # Yellow
Blue='\e[0;34m'         # Blue
Purple='\e[0;35m'       # Purple
Cyan='\e[0;36m'         # Cyan
White='\e[0;37m'        # White

# 粗体颜色定义
BBlack='\e[1;30m'       # Black
BRed='\e[1;31m'         # Red
BGreen='\e[1;32m'       # Green
BYellow='\e[1;33m'      # Yellow
BBlue='\e[1;34m'        # Blue
BPurple='\e[1;35m'      # Purple
BCyan='\e[1;36m'        # Cyan
BWhite='\e[1;37m'       # White

# 使用
echo -e "\033[40;37m 黑底白字 \033[0m"
echo -e "\033[41;37m 红底白字 \033[0m"
echo -e "\033[42;37m 绿底白字 \033[0m"
echo -e "\033[43;37m 黄底白字 \033[0m"
echo -e "\033[44;37m 蓝底白字 \033[0m"
echo -e "\033[45;37m 紫底白字 \033[0m"
echo -e "\033[46;37m 天蓝底白字 \033[0m"
echo -e "\033[47;30m 白底黑字 \033[0m"

echo -e "${BRed}Hello ${BYellow}World"
```
> 这里值得注意的是，执行`sh color.sh`和`./color.sh`的输出效果不一样，通过我们会使用`chmod u+x color.sh`进行授权，然后直接运行 `./color.sh`的方式进行使用，这样`echo -e`才能生效。s

![shell-color](http://ohdpyqlwy.bkt.clouddn.com/shell-color.png)

## 5. 使用cat对文件进行编辑
```shell
cat <<EOF > a.py
#!/bin/python
print 'Hello World'
EOF
```
> 命令行使用cat对文件进行创建与编辑，`cat > /home/hello.py`，CTRL + D 保存并关闭

## 6. 打开另一个窗口执行
```shell
gnome-terminal -e "sslstrip -l 10000" --tab
```

