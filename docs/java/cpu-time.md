---
title: Cpu 时间片段
layout: doc
outline: deep
---

# Cpu 时间片段

在StackOverflow中看到的一个问题，想要测试多线程耗时的问题，代码如下

```java
public static void main(String args[]) throws Exception
   {
       long startTime = System.currentTimeMillis();
       Thread[] threads = new Thread[1000];
       for(int i = 0; i<1000; i++){
           threads[i] = new Thread(()->doSomething(10));
           threads[i].start();
       }
       for(Thread t : threads){
           t.join();
       }
       long endTime = System.currentTimeMillis();
       System.out.println("Time taken "+(endTime - startTime)/1000);
   }

   public static int doSomething(int seconds){
    long st = System.currentTimeMillis();
    long usageTimeInMillis = seconds*1000L;
    long startTime = System.currentTimeMillis();
    int i = 0;
    while ((System.currentTimeMillis() - startTime) < usageTimeInMillis) { i++; }
    long lt = System.currentTimeMillis();
    System.out.println("Done "+Thread.currentThread().getId()+" in "+(lt-st)/1000+" seconds ");
    return i;
   }
```

上面这个程序中在他的预期中是每个线程执行10秒，而他的机器是（i7 6核），所以认为执行时间是1000/6 秒，但实际上执行时间只有17秒

`while ((System.currentTimeMillis() - startTime) < usageTimeInMillis) { i++; } `
这段代码中是比较的当前毫秒值与起始毫秒值的差值，但由于cpu的线程调度是给予线程一个cup的时间片段用于执行线程的代码，当给予的时间片段到期时无论线程是否执行完成都会中断该线程的执行，所以线程不会在整个过程中都拥有cpu资源，多个线程的开始可以是相同时间开始的，整个方法可能是10秒的耗时，但并不是占用了10秒的cpu时间。

[Stackoverflow问题链接](https://stackoverflow.com/questions/77998833/unable-to-understand-the-time-consumption-by-java-threads)
