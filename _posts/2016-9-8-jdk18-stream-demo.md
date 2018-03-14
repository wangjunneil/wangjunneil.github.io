---
title: jdk1.8 高效stream流的遍历、聚合示例代码
name: jdk18-stream-demo
date: 2016-9-8 12:00
tags: [jdk1.8,java流,stream,lambda]
categories: [Java]
---

**jdk1.8** 对于集合流的处理使用起来很方便，集合 **Lambda** 表达式可以节省很多对于集合处理的代码，下面是一些常用流处理的示例代码。

## 从集合或数组中获取流对象

```java
// 从数组创建流，两种方法
User[] users = {
    new User(1, "张三", 23, "male"),
    new User(2, "李四", 21, "female"),
    new User(3, "王五", 29, "male"),
    new User(4, "马六", 27, "male")
};
Stream<User> stream = Stream.of(users);
Stream<User> stream = Arrays.stream(User);

// 从集合创建流，调用集合类的stream()方法
List<User> users = Arrays.asList(
    new User(1, "张三", 23, "male"),
    new User(2, "李四", 21, "female"),
    new User(3, "王五", 29, "male"),
    new User(4, "马六", 27, "male")
);
Stream<User> stream = users.stream();
```

## 串行与并行流

```java
/*
 * 并行流在对大数据集合的聚合操作时会非常高效，并行流利用多核多处理器的硬件并行对数据进行计算汇总。
 * 数据小的情况下不建议使用并行流。
 */
Stream<User> stream = users.stream();
Stream<User> stream = users.parallelStream();
Stream<User> stream = users.stream().parallel();
```

## 对流的遍历操作

```java
// 遍历大于25岁的用户并输出其姓名
users.parallelStream().forEach(p -> {
    if (p.getAge() > 25)
        System.out.println(p.getName());
});

// 获取年龄大于25岁的用户集合
List<User> list = users.parallelStream().filter(p -> p.getAge() > 25).collect(Collectors.toList());
System.out.println(list);

// 使用Predicate对象作为条件获取年龄大于25的用户并输出其姓名
// Predicate对象可以追加更多的条件，如and、or等等
Predicate<User> pred = (p) -> p.getAge() > 25;
users.parallelStream().forEach(p -> {
    if (pred.test(p))
        System.out.println(p.getName());
});
users.parallelStream().filter(pred).forEach(p -> System.out.println(p.getName()));
```

## 对流的聚合操作

```java
// 汇总所有用户的年龄总和
int sum = users.stream().mapToInt(p -> p.getAge()).sum();
int sum = users.stream().mapToInt(User::getAge).sum();
double sum = users.stream().mapToInt(User::getAge).reduce(0,  (x, y) -> x + y);

// 汇总所有用户的年龄平均值
double avg = users.stream().mapToInt(p -> p.getAge()).average().getAsDouble();
double avg = users.stream().mapToInt(User::getAge).average().getAsDouble();

// 按性别统计用户数，输出"{female=1, male=3}"
Map<String, Integer> map = users.parallelStream().collect(Collectors.groupingBy(User::getSex, Collectors.summingInt(p -> 1)));

// 按性别获取用户名称，输出"{female=[李四], male=[张三, 王五, 马六]}"
Map<String, List<String>> map = users.parallelStream().collect(Collectors.groupingBy(User::getSex, Collectors.mapping(User::getName, Collectors.toList())));

// 按性别求年龄总和，输出"{female=21.0, male=26.333333333333332}"
Map<String, Double> map = users.stream().collect(Collectors.groupingBy(User::getSex, Collectors.averagingInt(User::getAge)));
```