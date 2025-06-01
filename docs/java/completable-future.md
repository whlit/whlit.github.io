---
title: CompletableFuture使用
---

在Java中要想获取异步线程的执行结果，一般使用ExecutorService的submit方法，submit方法返回一个Future对象，通过Future对象可以获取异步线程的执行结果。但通过Feature获取执行结果时，如果任务没有完成，则主线程会被阻塞，很多情况下主线程并不需要等待结果才能继续运行，

## Feature

Feature是用来表示一个异步操作的结果，它提供了一些方法来获取异步操作的结果。

```java
public interface Future<V> {
    // 尝试取消任务，如果任务已完成、已经被取消，或者不能被取消，则返回false
    boolean cancel(boolean mayInterruptIfRunning);
    // 判断任务是否被取消
    boolean isCancelled();
    // 判断任务是否已完成
    boolean isDone();
    // 获取任务执行结果，如果任务没有完成，则阻塞等待
    V get() throws InterruptedException, ExecutionException;
    // 获取任务执行结果，如果任务没有完成，则阻塞等待，最长等待timeout时间
    V get(long timeout, TimeUnit unit)
        throws InterruptedException, ExecutionException, TimeoutException;
}
```

## CompletableFuture

CompletableFuture是Java 8中提供的一个用于处理异步操作的类，它提供了许多方法来处理异步操作的结果，包括获取结果、处理异常、组合多个异步操作等。

```java [CompletableFuture]
public class CompletableFuture<T> implements Future<T>, CompletionStage<T> {}
```

CompletableFuture实现了Future接口，所以它也可以通过`get()`方法获取异步操作的结果，但这显然不是使用它的目的。同时CompletableFuture也实现了CompletionStage接口，它提供了许多方法来处理异步操作的结果，包括获取结果、处理异常、组合多个异步操作等。
