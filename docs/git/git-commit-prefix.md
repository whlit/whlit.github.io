---
title: Git提交信息常用前缀
---

# Git提交信息常用前缀

- `fix` 修复Bug
- `feat` 新功能
- `docs` 文档更新
- `style` 不影响代码含义的更改
- `refactor` 既不修复bug也不新增功能
- `perf` 性能优化
- `test` 添加或者修改测试
- `revert` 回滚
- `build` 编译
- `ci` 对CI的更改

## 设置Git用户信息

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

## 设置GitHub提交邮箱地址

在任何GitHub页面的右上角，点击头像，选择Settings，然后选择Emails，在右侧的Emails列表中，点击Add Email，输入你的邮箱地址，然后点击Add。然后再设置本地git的提交的邮箱地址。
