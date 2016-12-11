---
title: maven集成ant错误optional.ReplaceRegExp was not found
name: maven-err-replaceregexp
date: 2016-9-10 12:00
tags: [maven,ReplaceRegExp]
categories: [Java]
---

当在 `Maven` 构建的项目中集成 `Ant` 时，在执行非 **Ant** 核心任务时，会出现 **可选任务不存在** 的错误，如本文中执行文本 **回车换行** 的替换操作，需要使用 **ReplaceRegexp** 的任务去替换文本中的 **^M** 符号。

## 异常输出

```
[ERROR] Cause: the class org.apache.tools.ant.taskdefs.optional.ReplaceRegExp was not found.
[ERROR] This looks like one of Ant's optional components.
[ERROR] Action: Check that the appropriate optional JAR exists in
[ERROR] -ANT_HOME/lib
[ERROR] -the IDE Ant configuration dialogs
[ERROR] 
[ERROR] Do not panic, this is a common problem.
[ERROR] The commonest cause is a missing JAR.
```

## 出错原因

在终端中手动执行 **Ant** 任务不会出错，使用 **maven** 执行时会出现此类问题。原因是执行 **Ant** 命令时，所有核心任务的库已经包含在 **Ant** 的安装包里。而在用 **Maven** 调用 **Ant** 执行时会使用自身的 **Ant** 环境，而 **Maven** 自身只集成了基本的 **Ant**，所以需要告诉 **Maven** 下载并使用对应的可选任务库。

**修改后的部分配置如下**

```xml
......
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-antrun-plugin</artifactId>
    <executions>
        <execution>
            <phase>package</phase>
            <goals><goal>run</goal></goals>
            <configuration>
                <tasks>
                    <replaceregexp  match="&#13;&#10;" replace="&#10;" flags="g" byline="false">
                        <fileset dir="${project.basedir}/target/${project.build.finalName}">
                            <include name="bin/*.sh" />
                            <include name="conf/*.properties" />
                            <include name="server/WEB-INF/class/*.xml" />
                        </fileset>
                   </replaceregexp>
               </tasks>
           </configuration>
       </execution>
    </executions>
    <!-- 添加ant可选任务的依赖文件 -->
    <dependencies>
        <dependency>
            <groupId>ant</groupId>
            <artifactId>ant-nodeps</artifactId>
            <version>1.6.5</version>
        </dependency>
        <dependency>
            <groupId>ant</groupId>
            <artifactId>ant-apache-regexp</artifactId>
            <version>1.6.5</version>
        </dependency>
        <dependency>
            <artifactId>jakarta-regexp</artifactId>
            <groupId>jakarta-regexp</groupId>
            <version>1.4</version>
        </dependency>
    </dependencies>
</plugin>
......
```

上面是 **Maven** 的 `pom.xml` 文件的部分配置，通过给 `maven-antrun-plugin` 插件添加相关的 **Ant** 依赖就可以解决此类问题。
> 第二种方法，就是在 **Maven** 的配置文件中手动指定需要使用本地的 **Ant** 环境。

