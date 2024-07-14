---
title: Checked Exception 和 Unchecked Exception 的区别
layout: doc
outline: deep
---

# Checked Exception 和 Unchecked Exception 的区别

- Checked Exception 是受检查的异常，也就是说在编译时就会检查的异常，比如IOException，当我们读取文件的时候，就必须显示的处理或向上抛出IOException，否则编译就不会通过

- Unchecked Exception 是不受检查的异常，比如NullPointerException，我们在编写代码的时候可能会遇到这种异常，如果我们确定我们编写的代码不会出现这种异常，那么我们就可以不去处理它，编译器也不会在编译的时候检查它。

## 为什么要有这种区别呢

Checked Exception 一般是因为这个异常对程序的运行影响比较大，可能会导致程序崩溃无法运行，所以要在编译的时候检查它，并强制开发者对异常进行处理。

UnChecked Exception 一般是因为这个异常对程序的运行影响比较小，可能是逻辑上的错误，或者其他无法预料的错误，一是开发者无法预料到这个异常的存在，就没法在编译的时候检查它，二是没必要，也不合适，因为如果对所有的异常都进行处理，那么我们的代码就大部分都是异常处理的逻辑了，这样阅读以及维护的成本就会大大增加，并且会导致代码的冗余。
