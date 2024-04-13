---
layout: doc
title: Java 集合
outline: deep
---

# java 集合

java 中集合主要分为Collection和Map分类，Collection 主要又分为List和Set。

| 集合 | 说明                                                       |
| ---- | ---------------------------------------------------------- |
| List | 有序，可重复。                                             |
| Set  | 不可重复的集合。                                           |
| Map  | 键值对形式的数据集合。key是不可重复的，每个key对应一个值。 |

常用实现类

| 类名              | 有序性 | 重复性      | 线程安全   | 底层实现                      |
| ----------------- | ------ | ----------- | ---------- | ----------------------------- |
| ArrayList         | 有序   | 可重复      | 线程不安全 | 数组                          |
| LinkedList        | 有序   | 可重复      | 线程不安全 | 双向链表                      |
| Vector            | 有序   | 可重复      | 线程安全   | 数组                          |
| Stack             | 有序   | 可重复      | 线程安全   | 数组                          |
| HashSet           | 无序   | 不可重复    | 线程不安全 | 基于HashMap实现               |
| TreeSet           | 有序   | 不可重复    | 线程不安全 | 红黑树                        |
| LinkedHashSet     | 有序   | 不可重复    | 线程不安全 | 基于LinkedHashMap实现         |
| HashMap           | 无序   | key不可重复 | 线程不安全 | 数组 + 链表/红黑树            |
| LinkedHashMap     | 有序   | key不可重复 | 线程不安全 | 数组 + 链表/红黑树 + 双向链表 |
| ConcurrentHashMap | 无序   | key不可重复 | 线程安全   | 数组 + 链表/红黑树            |
| TreeMap           | 有序   | key不可重复 | 线程不安全 | 红黑树                        |
| HashTable         | 无序   | key不可重复 | 线程安全   | 数组 + 链表                   |

## List

### ArrayList

ArrayList是List的主要实现类，也是最常用的集合类。底层使用数组来实现，所以支持随机访问。

扩容机制：在向ArrayList中添加元素时，现有的数组已经存储满了，则自动触发扩容。初始的数组大小为10，扩容后的数组大小是原来的2倍。

ArrayList不是线程安全的，`java.util.concurrent`包中提供了`CopyOnWriteArrayList`类，可以保证线程安全。

### LinkedList

LinkedList是List的另一种实现类，底层使用双向链表来实现。由于是双向链表所以不支持随机访问，但是支持快速的插入和删除。存储占用的空间要比ArrayList要多，因为LinkedList中每个元素都包含了前一个元素和后一个元素的引用。

### Vector

Vector也是使用数组来实现的，但是它是线程安全的。在每一个可能又线程安全问题的方法上都添加了`synchronized`关键字，从而保证线程安全，但同时也会导致性能下降。

### Stack

LIFO （Last In First Out），Stack是Vactor的子类，所以它也是线程安全的。

## Set

### HashSet

HashSet是Set的主要实现类，也是最常用的集合类。底层使用HashMap来实现，所以支持不可重复的特性。同样不是线程安全的，`java.util.concurrent`包中提供了`CopyOnWriteArraySet`类，可以保证线程安全的同时保证不可重复，但这个Set是基于`CopyOnWriteArrayList`实现的。

### TreeSet

TreeSet是Set的另一种实现类，底层使用红黑树来实现。由于是红黑树所以不支持随机访问，但是支持快速的插入和删除。

### LinkedHashSet

LinkedHashSet是Set的另一种实现类，底层使用LinkedHashMap来实现。

## Map

### HashMap

HashMap是Map的主要实现类，是key-value形式的数据结构，key不可重复，但可以为null，value可以重复。

- 扩容机制：HashMap的初始容量为16，如果put新的key-value后数量超过了阈值(阈值=加载因子\*容量，加载因子默认为0.75)，则自动扩容，扩容后的容量是原来的2倍。HashMap的容量是有限的，必须小于`1<<30=1073741824`，如果超出了这个限制，则阈值被设定为Integer.MAX_VALUE。

- 底层数据结构：底层是数组+链表的结构，数组中的每个元素都是一个链表节点，当链表的长度超过阈值时，链表就会转换成红黑树，阈值默认为8，但是当数组长度过小时，不会触发转换，而是扩容，扩容后的数组长度是原来的2倍，这个大小为64.

### LinkedHashMap

继承于HashMap，扩展了`HashMap.Node`，定义了`before, after`实现双向链表，`before`指向前一个节点，`after`指向后一个节点。最终形成有序的Map。

### ConcurrentHashMap

ConcurrentHashMap是`HashMap`的线程安全版本，`java.util.concurrent`包中提供了`ConcurrentHashMap`类，可以保证线程安全。

- 线程安全：1.8之前是将数组进行了分段，每个分段进行了锁操作。 1.8之后是直接使用CAS和`synchronized`来保证线程安全。当数组索引位置为空时使用CAS操作进行设置，否则使用`synchronized`来保证线程安全。

### TreeMap

TreeMap是Map的另一种实现类，底层使用红黑树来实现。

TreeMap实现了`NavigableMap`接口所以有对元素的搜索能力，以及`SortedMap`接口中的排序的能力。

### HashTable

HashTable是Map的另一种实现类，底层使用数组+链表的结构。同时使用`synchronized`保证线程安全。
