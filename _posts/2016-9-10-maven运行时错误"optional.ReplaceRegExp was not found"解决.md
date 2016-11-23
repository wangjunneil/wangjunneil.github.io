使用 `maven` 构建时有时并不能满足工程的需要，因为maven的约束性，较细节的构建处理还需要和 `ant` 搭配才能完成。当执行 **ant** 中的核心任务时，如 **copy**、**delete** 等等，并不会出现任何问题，当执行一些高级任务时，如 **ftp**、**ssh** 或者 **replaceregexp** 等任务时就会出现问题。

比如在构建项目时，我们需要将文本文件（启动脚本、配置文件）进行回车换行处理，解决在 **unix** 上执行出现 **\^M** 的问题，这里需要使用 **replaceregexp** 的任务进行字符的替换。

# 下面是报错时的 pom 配置

```xml
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
</plugin>
```

执行构建任务时出错的信息如下：

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

# 出现此问题的原因是什么

若在终端上直接执行 `ant` 时并不会有错，使用 `maven` 执行时就会出现错误，这是因为使用ant执行时，所有核心和可选的任务都在ant的安装包里，当执行maven时，maven将会使用自身的ant库，而maven里的ant库只有核心任务，并没有可选的任务库文件。知道问题所在，解决就有针对性了，要么告诉maven在执行时需要使用本地的ant环境，要么在添加ant的可选依赖，下面时修改后的maven配置。

```xml
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
```