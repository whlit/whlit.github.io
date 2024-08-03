---
title: VSCode Icons 插件自定义图标
layout: doc
---

# VSCode Icons 插件自定义图标

[vscode-icons-team.vscode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)是一个在VSCode中使用的图标插件，它可以对文件以及文件夹提供更为个性化的图标。

## 配置自定义图标文件夹

vscode-icons提供了大部分的文件类型及文件夹的图标，对于没有包含在内的文件类型或文件夹，可以通过自定义图标来实现。

首先打开插件设置，配置自定义图标文件夹路径：`"vsicons.customIconFolderPath": "icon_path"`，这个选项有默认的路径为:`C:\Users\用户名\AppData\Roaming\Code\User`。

在自定义图标文件夹下新建一个`vsicons-custom-icons`文件夹，这个文件夹是真正用来存放自定义图标的，**名称必须是这个**，`vscode-icons`插件会自动在上面配置的文件夹路径下寻找该文件夹。

## 自定义文件图标

在`vsicons-custom-icons`文件夹下存放一个我们自定义的图标文件，例如：`file_type_my-custom-icon.svg`。这个文件的名称是有特殊格式的 `file_type_<自定义名称>.svg`。支持的文件类型可以查看 [这里](https://github.com/vscode-icons/vscode-icons/blob/master/src/models/extensions/fileFormat.ts)，推荐使用 `svg`。

在`vsicons-icons`配置文件中添加如下内容：

```json
{
  "vsicons.associations.files": [{ "icon": "my-custom-icon", "extensions": ["mci"], "format": "svg" }]
}
```

- icon: 自定义图标名称，例如图片名称为`file_type_my-custom-icon.svg`，那么这里应该为`my-custom-icon`。
- extensions: 扩展名，例如文件名称为`test.mci`，那么这里应该为`["mci"]`，可以对多种扩展名进行配置。
- format: 图标文件格式

最后，按下F1并执行 `Apply Icons Customization` 来应用配置。

## 自定义文件夹图标

与文件图标类似，在`vsicons-custom-icons`文件夹下存放文件夹图标，例如：`folder_type_my-custom-icon.svg`以及`folder_type_my-custom-icon_opened.svg`。这里是两个图标文件对应文件夹的开启和关闭状态，文件名称的格式分别为`folder_type_<自定义名称>.svg`和`folder_type_<自定义名称>_opened.svg`。

**注意：文件夹必须是两个图标文件，否则你会看到一个空白的图标。**

在`vsicons-icons`配置文件中添加如下内容：

```json
{
  "vsicons.associations.folders": [{ "icon": "my-custom-icon", "extensions": ["mcf"], "format": "svg" }]
}
```

- icon: 自定义图标名称，例如图片名称为`folder_type_my-custom-icon.svg`，那么这里应该为`my-custom-icon`。
- extensions: 这里是文件夹，所以就是文件夹的名称，根据文件夹名称来应用图标。
- format: 图标文件格式

最后，按下F1并执行 `Apply Icons Customization` 来应用配置。

## 完整配置示例

```json
{
  "vsicons.customIconFolderPath": "C:\\Users\\用户名\\AppData\\Roaming\\Code\\User",
  "vsicons.associations.folders": [{ "icon": "my-custom-icon", "extensions": ["mci"], "format": "svg" }],
  "vsicons.associations.files": [{ "icon": "my-custom-icon", "extensions": ["mci"], "format": "svg" }]
}
```

## 参考

- [Custom Icons](https://github.com/vscode-icons/vscode-icons/wiki/Custom)
