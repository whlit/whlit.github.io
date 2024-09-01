---
title: 二叉树
layout: doc
outline: deep
---

# 二叉树

在链表中我们通过存放下一个节点的指针的方式将多个数据串联成一条链，然后通过指针来遍历整个链表。现在我们将存放下一个节点的指针改为存放多个字节点的指针，这样的结构看起来很像一棵树不断的分叉，所以我们就称这种结构为**树**。

![binary-tree](images/binary-tree/tree.drawio.svg)

一般为了看起来方便，在展示时一般将树倒过来，根节点在最上方。对于普通的树来说，它的每个节点可以有任意数量的子节点，因为我们没有规定它字节的最大数量。现在我们规定每个节点最多只能有两个子节点，并且这两个节点分别用left和right表示，这样的树我们称为**二叉树**。

![binary-tree](images/binary-tree/binary-tree.drawio.svg)

::: code-group

```java [BinaryTree]
public class BinaryTree<T> {
    T val;
    BinaryTree<T> left;
    BinaryTree<T> right;
}
```

```java [Tree]
public class Tree<T> {
    T val;
    List<Tree<T>> children;
}
```

:::

## 满二叉树

在一颗二叉树中如果每个节点都有0个或者2个子节点，那么这个二叉树就是满二叉树。

![binary-tree](images/binary-tree/full-binary-tree.drawio.svg)

## 完美二叉树

一棵深度为 $k$ ，且有 $2^k-1$ 个节点的二叉树，称为完美二叉树。特点是所有的非叶子节点都有两个子节点，所有的叶子节点都在同一层。

![binary-tree](images/binary-tree/perfect-binary-tree.drawio.svg)

## 完全二叉树

在一颗二叉树中除了最后一层其余层全部是满的，而且最后一层要么是满的，要么是全部集中在左侧。

![binary-tree](images/binary-tree/completeness-binary-tree.drawio.svg)

## 二叉树遍历

二叉树的遍历一般分为四种：层次遍历、前序遍历、中序遍历和后序遍历。层次遍历也叫广度优先遍历，后三种也叫深度优先遍历，分别表示根节点在遍历中处于前、中、后的位置。

### 层次遍历

从根节点开始，一层一层地遍历，也叫广度优先遍历

![binary-tree](images/binary-tree/level-traversal.drawio.svg)

### 前序遍历

先访问根节点，再访问左子树，再访问右子树

![binary-tree](images/binary-tree/pre-traversal.drawio.svg)

### 中序遍历

先访问左子树，再访问根节点，再访问右子树

![binary-tree](images/binary-tree/in-traversal.drawio.svg)

### 后序遍历

先访问左子树，再访问右子树，再访问根节点

![binary-tree](images/binary-tree/post-traversal.drawio.svg)
