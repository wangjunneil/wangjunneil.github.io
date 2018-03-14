---
title: 关于java网络传输中Big Endian字节序
name: java-big-endian
date: 2015-11-15
tags: [big-endian]
categories: [Java]
---

* 目录
{:toc}

---

# 关于java网络传输中Big Endian字节序

## 说明

java里socket传输中OutputStream中直接写入一个int类型，会截取其低8位，丢弃其高24位，因此，需要将基本类型转换为字节流。java采用的是Big Endian字节序。基本上所有的网络协议都是采用Big Endian字节序进行传输。
所以我们在传输时，需要先将其转换成Big Endian字节序；同理，在数据接收时，也需要进行相应的转换。

## 事例代码

```java
public static int bytes2Int(byte[] bytes) {
    int num = bytes[3] & 0xFF;
    num |= ((bytes[2] << 8) & 0xF00);
    num |= ((bytes[1] << 16) & 0xF0000);
    num |= ((bytes[0] << 24) & 0xF000000);
    return num;
}

public static byte[] int2Bytes(int i) {
    byte[] result = new byte[4];
    result[0] = (byte) ((i >> 24) & 0xFF);
    result[1] = (byte) ((i >> 16) & 0xFF);
    result[2] = (byte) ((i >> 8) & 0xFF);
    result[3] = (byte) (i & 0xFF);
    return result;
}
```