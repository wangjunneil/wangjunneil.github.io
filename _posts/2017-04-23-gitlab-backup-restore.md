---
title: Gitlab私有仓库的备份和还原
name: gitlab-backup-restore
date: 2017-04-23
tags: [git,git版本管理,git备份]
categories: [Linux]
---

* 目录
{:toc}

---

# Gitlab私有仓库的备份和还原

## 1. Gitlab的搭建

单纯的搭建Gitlab需要安装和配置很多东西，过于麻烦，这里使用**[bitnami](https://bitnami.com)**的一键安装方式进行安装，傻瓜式的安装按步骤执行即可。Bitnami的Gitlab下载地址为 **[https://bitnami.com/stack/gitlab](https://bitnami.com/stack/gitlab)**。

**默认的Gitlab安装路径为**：/opt/gitlab-x.xx.x-x

## 2. 配置备份路径

编辑 **/opt/gitlab-8.12.6-0/apps/gitlab/htdocs/config/gitlab.yml** 文件，找到如下**Backup**节点。

```
## Backup settings
backup:
	# path: "tmp/backups" 默认的备份路径
	path: "/home/git/backup"
```

配置好后需要重新启动Gitlab使其生效

```shell
./ctlscript.sh restart
```

## 3. 备份Gitlab

```shell
# 切换到git用户
su - git
# 进入备份脚本目录
cd /opt/gitlab-8.12.6-0/apps/gitlab/htdocs
# 执行备份命令
bundle exec bin/rake gitlab:backup:create RAILS_ENV=production
```

## 4. 还原Gitlab
```shell
# 切换到git用户
su - git
# 进入备份脚本目录
cd /opt/gitlab-8.12.6-0/apps/gitlab/htdocs
# 执行还原命令
bundle exec bin/rake gitlab:backup:restore RAILS_ENV=production BACKUP=1405247282
```

> 更多的备份还原参数请参看 [https://docs.gitlab.com/ce/raketasks/backup_restore.html](https://docs.gitlab.com/ce/raketasks/backup_restore.html)