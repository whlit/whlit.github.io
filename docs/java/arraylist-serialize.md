---
title: ArrayList序列化
layout: doc
outline: deep
---

# ArrayList序列化

ArrayList的`elementData`是以`transient`修饰的，所以`elementData`是不可以被序列化的

**为什么elementData不可以直接被序列化**

由于elementData的大小并不是集合中数据的大小，有一部分是作为缓冲区来避免频繁的扩容，而这部分缓冲区其实是不用序列化的，也可以节省空间。

**ArrayList序列化的方式**

ArrayList是通过readObject和writeObject两个方法进行序列化和反序列化的。

```java
/**
* Save the state of the <tt>ArrayList</tt> instance to a stream (that
* is, serialize it).
*
* @serialData The length of the array backing the <tt>ArrayList</tt>
*             instance is emitted (int), followed by all of its elements
*             (each an <tt>Object</tt>) in the proper order.
*/
private void writeObject(java.io.ObjectOutputStream s)
    throws java.io.IOException{
    // Write out element count, and any hidden stuff
    int expectedModCount = modCount;
    s.defaultWriteObject();

    // Write out size as capacity for behavioural compatibility with clone()
    s.writeInt(size);

    // Write out all elements in the proper order.
    for (int i=0; i<size; i++) {
        s.writeObject(elementData[i]);
    }

    if (modCount != expectedModCount) {
        throw new ConcurrentModificationException();
    }
}

/**
* Reconstitute the <tt>ArrayList</tt> instance from a stream (that is,
* deserialize it).
*/
private void readObject(java.io.ObjectInputStream s)
    throws java.io.IOException, ClassNotFoundException {
    elementData = EMPTY_ELEMENTDATA;

    // Read in size, and any hidden stuff
    s.defaultReadObject();

    // Read in capacity
    s.readInt(); // ignored

    if (size > 0) {
        // be like clone(), allocate array based upon size not capacity
        int capacity = calculateCapacity(elementData, size);
        SharedSecrets.getJavaOISAccess().checkArray(s, Object[].class, capacity);
        ensureCapacityInternal(size);

        Object[] a = elementData;
        // Read in all elements in the proper order.
        for (int i=0; i<size; i++) {
            a[i] = s.readObject();
        }
    }
}

```
