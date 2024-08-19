---
title: 完全二叉树的节点个数
layout: doc
---

# 完全二叉树的节点个数

[完全二叉树](https://zh.wikipedia.org/wiki/%E4%BA%8C%E5%8F%89%E6%A0%91#%E5%AE%8C%E5%85%A8%E4%BA%8C%E5%8F%89%E6%A0%91): 在一颗二叉树中除了最后一层其余层全部是满的，而且最后一层要么是满的，要么是全部集中在左侧。

[leetcode 原题链接](https://leetcode.cn/problems/count-complete-tree-nodes/)

## 普通二叉树

对于普通二叉树，直接递归遍历即可。

```java
public int countNodes(TreeNode root) {
    if (root == null) {
        return 0;
    }
    return countNodes(root.left) + countNodes(root.right) + 1;
}
```

## 满二叉树

满二叉树是所有层级都是满的，所以它的总节点数计算为：$2^n - 1$

## 完全二叉树

对于完全二叉树，我们分别计算左子树和右子树的高度：

- `left == right`：左子树与右子树一样高，说明左子树是满的，也就是左子树是一颗满二叉树，所以可以直接计算出左子树的节点数：$2^left - 1$
- `left != right`: 左子树与右子树不一样高，说明右子树的第n层是空的，但其余层是满的，也是一颗二叉树，所以右子树的节点数为: $2^right - 1$

对于不满的另外一颗子树我们可以看到它也是一个完全二叉树，所以递归计算即可得出整个完全二叉树的节点数。

```java
public int countNodes(TreeNode root) {
    if (root == null) {
        return 0;
    }
    int left = countHeight(root.left);
    int right = countHeight(root.right);
    if (left == right) {
        // 2^left - 1 可以用位移操作 (1 << left) - 1
        // 此处计算为 递归计算右子树节点数 + 左子树节点数 + 1
        return countNodes(root.right) + (1 << left);
    } else {
        return countNodes(root.left) + (1 << right);
    }
}
public int countHeight(TreeNode root) {
    int height = 0;
    while (root != null) {
        height++;
        root = root.left;
    }
    return height;
}
```

## 总结

这道题主要是对完全二叉树的特点的理解，如果使用普通的解法计算结果是完全没问题的，但是这是一个完全二叉树，我们就要把完全二叉树的特点利用起来，得到一个更快速的计算方式。
