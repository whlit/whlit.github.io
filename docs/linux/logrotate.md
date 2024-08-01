---
title: 使用 logrotate 自动切割日志
layout: doc
outline: deep
---

# 使用 logrotate 自动切割日志

Logrotate 旨在简化对生成大量日志文件的系统的管理。它允许自动旋转、压缩、删除和邮寄日志文件。每个日志文件可以每天、每周、每月处理一次，或者当它变得太大时进行处理。

logrotate 是作为cron定时任务来执行的。默认情况下它是每日执行一次，定时任务内容是在`/etc/cron.daily/logrotate`文件中。如果需要在日志文件的大小达到一定程度就进行切割，默认是不支持的，它不能通过监听文件的变化来执行，我们可以通过修改定时任务进行多次的执行logrotate来近似的实现。

## 选项

logrotate也可以手动触发执行。

```sh
logrotate -f /etc/logrotate.d/nginx
```

它有一下几个选项：

- `-d` | `--debug`: 打开调试模式，在调试模式下不会对日志进行任何更改。
- `-f` | `--force`: 强制执行。
- `-s` | `--state`: 使用指定的状态文件。如果 logrotate 以不同用户的身份运行各种日志文件集，这将非常有用。
- `-m` | `--mail`: 告诉 logrotate 在邮寄日志时使用哪个命令。此命令应接受两个参数：1） 消息的主题，以及 2） 收件人。然后，该命令必须读取标准输入的消息，并将其邮寄给收件人。默认的 mail 命令是 /bin/mail -s。

## 配置文件

logrotate 是根据配置文件来决定对指定日志文件的操作。

logrotate 常用的配置如下：

- daily ：指定转储周期为每天
- weekly ：指定转储周期为每周
- monthly ：指定转储周期为每月
- rotate count ：保留的日志文件数，0 指没有备份，5 指保留 5 个备份
- missingok：如果缺少日志文件，继续执行下一个文件，而不发出错误消息。
- size size：当日志文件到达指定的大小时才转储，例如：size 100，size 100K，size 100M，size 100G
- compress： 通过 gzip 压缩转储以后的日志
- create mode owner group ： 转储文件时使用指定的文件模式创建新的日志文件，默认是与原始文件模式相同
- notifempty ：如果是空文件的话，不转储
- olddir directory：储后的日志文件放入指定的目录，必须和当前日志文件在同一个文件系统
- dateext：使用日期作为后缀

nginx 日志文件的配置示例，创建`/etc/logrotate.d/nginx`文件，内容如下：

```
# 全局配置，旧的日志文件进行压缩
compress

# nginx 访问日志
/var/log/nginx/access.log {
    daily           # 每天切割
    rotate 10       # 最多存10个备份
    size 500M       # 当日志文件大于500M时，进行切割
    create          # 创建新的文件用于转储
    missingok       # 如果找不到日志文件，不报错
    dateext         # 使用日期作为后缀
}

# nginx 错误日志
/var/log/nginx/error.log {
    daily
    rotate 20
    size 50M
    create
    missingok
    dateext
}
```

## 添加定时任务

logrotate 的定时任务是在`/etc/cron.daily/logrotate`文件中。我们添加新的定时任务以对logrotate的调用频次进行控制。

使用crontab命令添加定时任务，例如每20分钟调用一次logrotate：

```sh
$ crontab -e
*/20 * * * * /etc/cron.daily/logrotate
```

## 参考

- [logrotate](https://linux.die.net/man/8/logrotate)
