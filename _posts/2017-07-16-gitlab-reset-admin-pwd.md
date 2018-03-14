---
title: Gitlab重置管理员密码
name: gitlab-reset-admin-pwd
date: 2017-07-16
tags: [gitlab,重置密码]
categories: [Linux]
---

* 目录
{:toc}

---

# Gitlab重置管理员密码

```shell
shell> su - git
shell> cd /opt/gitlab-8.12.6-0/apps/gitlab/htdocs
shell> bundle exec rails console production
# email为需要更改密码的用户账户
irb(main):001:0> user = User.where(email: 'jun.wang@vinny.cn').first
# 密码必须至少8个字符
irb(main):002:0> user.password = '123456'
# 返回true表示修改成功
irb(main):003:0> user.save!
```



