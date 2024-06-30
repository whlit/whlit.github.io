---
title: Vite+Ts+Vue+Electron+Mysql 应用
layout: doc
outline: deep
---

# Vite+Ts+Vue+Electron+Mysql应用

## Vite+Ts+Vue项目

```shell
npm create vite@latest
```

根据提示创建项目即可

## Electron整合

### 添加依赖

添加`electron``electron-builder``concurrently`依赖
electron-builder是electron的打包的依赖
concurrent是将electron与vue项目的启动并行执行及管理

```shell
npm i -D electron electron-builder cuncurrently
```

### 修改tsconfig

```json
{
  "compilerOptions": {
    "target": "esnext",
    "useDefineForClassFields": true,
    "module": "commonjs", //commonjs规范
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "isolatedModules": false,
    "esModuleInterop": true,
    "lib": ["esnext", "dom"],
    "skipLibCheck": true,
    "outDir": "dist/electron" //文件输出的地址
  },
  "include": ["src/electron/**/*"], //electron文件的路径
  "references": [
    {
      "path": "./tsconfig.node.json"
    }
  ]
}
```

### 修改package.json

```json
{
  "name": "项目名称",
  "private": true,
  "version": "0.0.0",
  "main": "dist/electron/main/main.js", //改为electron的main的位置
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "ts": "tsc",
    "watch": "tsc -w",
    "lint": "eslint -c .eslintrc .ts ./src",
    "app:dev": "tsc && concurrently vite \" electron .\" \"tsc -w\"",
    "app:build": "npm run vite:build && tsc && electron-builder",
    "app:preview": "npm run vite:build && tsc && electron ."
  },
  "build": {
    "appId": "your id",
    "asar": true,
    "directories": {
      "buildResources": "assets",
      "output": "release/${version}"
    },
    "files": ["dist"],
    "mac": {
      "artifactName": "${productName}_${version}.${ext}",
      "target": ["dmg"]
    },
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        }
      ],
      "artifactName": "${productName}_${version}.${ext}"
    },
    "nsis": {
      "oneClick": false,
      "perMachine": false,
      "allowToChangeInstallationDirectory": true,
      "deleteAppDataOnUninstall": false
    }
  },
  "dependencies": {
    "vue": "^3.3.4"
  },
  "devDependencies": {
    "@types/mysql": "^2.15.21",
    "@vitejs/plugin-vue": "^4.2.3",
    "concurrently": "^8.2.0",
    "electron": "^25.4.0",
    "electron-builder": "^24.6.3",
    "mysql": "^2.18.1",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "vue-tsc": "^1.8.5"
  }
}
```

### electron入口文件

创建`src/electron/main/mian.ts`以及`src/electron/preload/preload.ts`

**main.ts**

```typescript
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'

const isDev = process.env.npm_lifecycle_event === 'app:dev'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      //preload文件地址
      preload: path.join(__dirname, '../preload/preload.js'),
    },
  })

  mainWindow.loadURL(isDev ? 'http://localhost:5173' : path.join(__dirname, '../../../index.html'))

  if (isDev) {
    //开启控制台
    mainWindow.webContents.openDevTools()
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit()
  }
})
```

**preload.ts**

```typescript
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: any, text: any) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }
  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
```

## 整合Mysql

### 添加依赖

```shell
npm i -D mysql
```

可以创建一个工具类用于创建数据库连接

```shell
import mysql, { FieldInfo, MysqlError, queryCallback } from 'mysql'

const pool = mysql.createPool({
    host: 'xxx',
    port: 3306,
    user: 'xxx',
    password: 'xxx',
    database: 'xxx'
})

export const query = function(sql: string, callback: queryCallback){
    pool.getConnection(function(err, con){
        if(err){
            callback(err, null, [])
        }else{
            con.query( sql, function(err: MysqlError | null, results?: any, fields?: FieldInfo[]){
                //事件驱动回调
                callback(err,results,fields);
            })
        }
    })
}

module.exports = {
    query
}
```

## Electron进程间通信

Electron主进程与渲染进程的通信方式有多种，此处只列出本项目使用的一种方式，是主进程与渲染进程双向通信的一种。

### 向preload.ts中添加要暴露的api

```typescript
import { contextBridge, ipcRenderer } from 'electron'
//electronAPI是暴露在window上的属性
contextBridge.exposeInMainWorld('electronAPI', {
  //getAll是暴露出去的方法，可以通过window.electronAPI.getAll()进行调用
  getAll: () => {
    //使用invoke方法
    return ipcRenderer.invoke('executeSql' /*这个参数是ipcRenderer与ipcMain通信的标识*/, 'select id, title, path, src, img from tab' /*传递的参数*/)
  },
})
```

### main.ts中接收渲染进程的信息

```typescript
import { app, BrowserWindow, ipcMain } from 'electron'
import { query } from '../utils/db'
//使用handle与渲染线程进行通信
ipcMain.handle('executeSql', (event, sql) => {
  //此处是将callback转换成了Promise，也可以自行处理
  return new Promise((resolve) => {
    query(sql, (err, results, files) => {
      resolve(results)
    })
  })
})
```

### 在vue中调用

```vue
<template>
  <button type="button" @click="onClick"></button>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const onClick = () => {
  //直接通过window.electronAPI.getAtlas()进行通信
  window.electronAPI.getAtlas().then((data: any) => {
    console.log('res', data)
  })
}
</script>
```

### 类型“Window & typeof globalThis”上不存在属性“electronAPI“

这个是ts的类型声明没有定义

```typescript
export interface IElectronAPI {
  getAtlas: () => Promise<any> //在preload中定义的其他方法也需要在这里添加上
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
```
