---
title: ArrayList扩容
layout: doc
outline: deep
---

# ArrayList扩容

- 当调用add方法新增元素时，数组elementData容量满了时会触发扩容，即`size == elementData.length`，ArrayList的大小和数组的长度是一样的说明数组中都存放了数据

```java
/**
 * This helper method split out from add(E) to keep method
 * bytecode size under 35 (the -XX:MaxInlineSize default value),
 * which helps when add(E) is called in a C1-compiled loop.
 */
private void add(E e, Object[] elementData, int s) {
    if (s == elementData.length)
        elementData = grow();
    elementData[s] = e;
    size = s + 1;
}
```

- 初次扩容，在创建一个空的ArrayList时，`elementData`默认为`DEFAULTCAPACITY_EMPTY_ELEMENTDATA`即一个空的数组，`size`默认为0，再第一次调用add方法时，进行扩容，此时会将数组扩容为`DEFAULT_CAPACITY`即大小为10的数组

```java
/**
 * Increases the capacity to ensure that it can hold at least the
 * number of elements specified by the minimum capacity argument.
 *
 * @param minCapacity the desired minimum capacity
 * @throws OutOfMemoryError if minCapacity is less than zero
 */
private Object[] grow(int minCapacity) {
    int oldCapacity = elementData.length;
    if (oldCapacity > 0 || elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        int newCapacity = ArraysSupport.newLength(oldCapacity,
                minCapacity - oldCapacity, /* minimum growth */
                oldCapacity >> 1           /* preferred growth */);
        return elementData = Arrays.copyOf(elementData, newCapacity);
    } else {
        return elementData = new Object[Math.max(DEFAULT_CAPACITY, minCapacity)];
    }
}
```

- 扩容大小为原来的1.5倍，`oldCapacity >> 1`

- addAll 扩容，扩容后大小为原来的1.5倍与新增元素后数据个数中的最大值

```java
public static int newLength(int oldLength, int minGrowth, int prefGrowth) {
    // preconditions not checked because of inlining
    // assert oldLength >= 0
    // assert minGrowth > 0

    int prefLength = oldLength + Math.max(minGrowth, prefGrowth); // might overflow
    if (0 < prefLength && prefLength <= SOFT_MAX_ARRAY_LENGTH) {
        return prefLength;
    } else {
        // put code cold in a separate method
        return hugeLength(oldLength, minGrowth);
    }
}
```
