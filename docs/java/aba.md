---
title: ABA 问题
layout: doc
outline: deep
---

# ABA 问题

## CAS

CAS即Compare and Swap，是JDK提供的非阻塞原子性操作，它通过硬件保证了"比较-更新"操作的原子性。
JDK里面的Unsafe类提供了一系列的compareAndSwap方法。
下面是compareAndSwapLong方法的介绍。

- boolean compareAndSwapLong(Object obj, long valueOffset, long expect, long update)

obj：对象内存位置
valeOffset：对象中变量的偏移量
expect：变量预期值
update：新的值
方法的含义是如果obj在内存中偏移量为valeOffset的变量值为expect则用新的值update替换旧的值expect

## ABA

假如线程一使用CAS操作修改初始值为A的变量X，那么线程一会首先去获取当前变量的值（为A），然后正常情况下会通过CAS修改为B，但实际情况下有可能在CAS过程中线程一CPU时间片段让出了，然后线程二获取了时间片段，此时线程二将变量X的值从A修改为B，又从B修改为A，最后线程一在修改时获取到X的值为A，认为没有修改过，故将A修改为B，但此时的A已经不是原来的A了，这就是ABA问题

例子：你正忙的时候，让朋友去你家桌上帮忙取五十元，并且告诉他桌上有100，如果只有五十就说明你自己回家取过了，就不用取了，结果在朋友去你家前你正好有时间了，自己回家拿了五十，恰好你老婆在你出门后又在桌子上放了五十，然后你朋友去到你家看到桌上正好是100，就帮你拿了五十，结果就是你拿了五十，你朋友也帮你拿了五十，就出现了问题。
