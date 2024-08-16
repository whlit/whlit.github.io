---
title: 线程池的创建
layout: doc
outline: deep
---

# 线程池的创建

Java中创建线程池一般有两种方法，一是通过Executors创建几种预定义的线程池，二是通过ThreadPoolExecutor自定义创建。

## Executors

Executors提供了几种使用场景的线程池创建方法。也是一个线程池创建的工具类。

### FixedThreadPool

一个在`LinkedBlockingQueue`的无界队列上运行固定数量线程的线程池。当无线程可用时，任务会在队列中阻塞等待，线程池中的线程会一直存在，知道它被`shutdown`。

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(
        nThreads, nThreads, // 核心线程数和最大线程数相同，所以所有的线程都是核心线程，都会一直存在
        0L, TimeUnit.MILLISECONDS, // 非核心线程最大空闲时间为0，由于都是核心线程，所以设置没有用
        new LinkedBlockingQueue<Runnable>()); // 无界阻塞队列
}
```

### CachedThreadPool

一个使用`SynchronousQueue`的线程池，它会根据需要创建线程，当线程执行完任务后，会缓存60秒，如果60秒内没有任务执行，则该线程会被删除。所有的线程都不会一直存在。

```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(
        0, Integer.MAX_VALUE, // 核心线程数为0，所以都是非核心线程
        60L, TimeUnit.SECONDS, // 最大空闲等待时间为 60 秒
        new SynchronousQueue<Runnable>()); // 同步队列
}
```

### ScheduledThreadPool

一个可以定期执行的线程池，`ScheduledExecutorService`继承自`ThreadPoolExecutor`，它可以创建定时任务。

```java
public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
    return new ScheduledThreadPoolExecutor(corePoolSize);
}
public ScheduledThreadPoolExecutor(int corePoolSize) {
    super(
        corePoolSize, Integer.MAX_VALUE, // 核心线程数和最大线程数
        DEFAULT_KEEPALIVE_MILLIS, MILLISECONDS, // 最大空闲时间10毫秒
        new DelayedWorkQueue()); // 延时队列
}
```

### SingleThreadExecutor

一个运行在无界队列上的单线程的线程池，

```java
public static ExecutorService newSingleThreadExecutor(ThreadFactory threadFactory) {
    return new AutoShutdownDelegatedExecutorService
        (new ThreadPoolExecutor(
            1, 1, // 只有一个核心线程
            0L, TimeUnit.MILLISECONDS, //最大空闲时间为0
            new LinkedBlockingQueue<Runnable>(), // 无界阻塞队列
            threadFactory));
}
```

### SingleThreadScheduledExecutor

一个单线程的可以定期或者延期执行的线程池。就是核心线程数为1的`ScheduledThreadPool`

```java
public static ScheduledExecutorService newSingleThreadScheduledExecutor() {
    return new DelegatedScheduledExecutorService
        (new ScheduledThreadPoolExecutor(1));
}
```

### WorkStealingPool

一种基于工作窃取算法的线程池，它的每一个线程都维护了一个任务队列，当一个线程的任务队列为空时，它会尝试从其他线程的工作队列中窃取任务来执行。可以设置线程池的并行级别，线程的实际数会动态的增长还缩减。这个线程方法是从jdk1.8开始引入的。

```java
public static ExecutorService newWorkStealingPool(int parallelism) {
    return new ForkJoinPool
        (parallelism,
            ForkJoinPool.defaultForkJoinWorkerThreadFactory,
            null, true);
}
```

### ThreadPerTaskExecutor

一个为每一个任务都启动一个新的线程来执行，它创建的线程数没有限制。这个线程池是从jdk21开始引入的。

```java
public static ExecutorService newThreadPerTaskExecutor(ThreadFactory threadFactory) {
    return ThreadPerTaskExecutor.create(threadFactory);
}
```

### VirtualThreadPerTaskExecutor

一个为每一个任务都启动一个新的虚拟线程来执行，它创建的线程数没有限制。这个线程池是从jdk21开始引入的。

```java
public static ExecutorService newVirtualThreadPerTaskExecutor() {
        ThreadFactory factory = Thread.ofVirtual().factory();
    return newThreadPerTaskExecutor(factory);
}
```

## ThreadPoolExecutor

Executors是为我们提供了一些预定义的线程池的创建，但有时这些线程池并不能满足我们的要求，所以可以使用`ThreadPoolExecutor`来自定义创建我们的线程池。

使用`ThreadPoolExecutor`创建线程池有以下几个重要的参数：

### 核心线程数

- corePoolSize: 要保留在线程池中的线程数，即使他们处于空闲状态。除非设置了`allowCoreThreadTimeOut`，否则不会被回收。

### 最大线程数

- maximumPoolSize: 线程池中允许的最大线程数。

### 非核心线程最大空闲时间

- keepAliveTime: 当线程数大于核心线程数时，多余的空闲线程在被销毁前可以存活等待任务的最大时间。
- unit: 时间单位

### 任务队列

- workQueue: 用于在执行任务前存放任务的队列。

### 线程工厂

- threadFactory: 用于创建线程的工厂。

### 拒绝策略

- handler: 当任务无法被ThreadPoolExecutor执行时，会采取的拒绝策略。例如当任务队列满了，无法再添加任务时，线程池会执行该方法以处理该任务。

::: info 四种拒绝策略：

- AbortPolicy：抛出`RejectedExecutionException`异常，默认的拒绝策略
- CallerRunsPolicy：使用调用线程来直接执行任务，一般用于任务必须被执行的情况
- DiscardOldestPolicy：丢弃队列中最老的任务，也就是最早的未执行的任务
- DiscardPolicy：丢弃任务

:::
