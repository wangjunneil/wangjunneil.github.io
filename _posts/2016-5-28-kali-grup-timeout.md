---
title: kali中设置grub的等待超时时间
name: kali-grup-timeout
date: 2016-5-28
tags: [kali,grub]
categories: [Blackhat]
---

# kali中设置grub的等待超时时间

每次启动kali在grub界面都需要等待5秒的时间才能正常进入系统（除非每次点击），如何删除kali默认的grub等待时间。

编辑`vi /etc/default/grub`文件，修改**GRUB_TIMEOUT**的值为**0**，且添加两个属性**GRUB_HIDDEN_TIMEOUT**和 GRUB_HIDDEN_TIMEOUT_QUIET，并值设为 0，具体如下：

```
GRUB_DEFAULT=0
GRUB_TIMEOUT=0
GRUB_HIDDEN_TIMEOUT=0
GRUB_HIDDEN_TIMEOUT_QUIET=0
GRUB_DISTRIBUTOR=`lsb_release -i -s 2> /dev/null || echo Debian`
GRUB_CMDLINE_LINUX_DEFAULT="quiet"
GRUB_CMDLINE_LINUX="initrd=/install/gtk/initrd.gz"
```

保持文件并且执行`update-grub`命令

```shell
update-grub
```

此时当再次启动kali时将没有grub引导菜单的出现很快的就能进入系统。
