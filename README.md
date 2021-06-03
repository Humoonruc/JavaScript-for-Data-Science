[TOC]

# JavaScript for Data Science

## 数据处理的标准流程

## 工程化工具

### nodemon

自动检测脚本文件的变化并 reload

```shell
npm install --save-dev nodemon
nodemon app.js
```

如果没有在应用中指定端口，可以在命令中指定：

```shell
nodemon ./server.js localhost 8080
```

```shell
nodemon --config nondemon.json # 指定配置文件
```

配置文件例：

```json
{
  "restartable": "rs",
  "ignore": [
    ".git",
    "node_modules/**/node_modules"
  ],
  "verbose": true,
  "execMap": {
    "js": "node --harmony"
  },
  "events": {
    "restart": "osascript -e 'display notification \"App restarted due to:\n'$FILENAME'\" with title \"nodemon\"'"
  },
  "watch": [
    "src/"
  ],
  "env": {
    "NODE_ENV": "development"
  },
  "ext": "js,json"
}
```

### live-server

自动检测 html 文件及其引用文件的变化并 reload

```shell
npm i --save-dev live-server
live-server # 自动打开默认浏览器，在浏览器界面点击 HTML 文件即可
```

### JSDoc

自动生成文档的命令：

```shell
jsdoc -R ./README.md -r ./src/ -d ./docs/
```

## 工具脚本

`./src/toolkit/`文件夹保存了大量工具函数，用于简化 JS 中对数据的操作。

积累自己的工具集，是非常好的习惯。

### Data-Forge 模块

官网：[Data-Forge (data-forge-js.com)](http://www.data-forge-js.com/)

另外一处使用说明：[JavaScript for Data Science (js4ds.org)](http://js4ds.org/#s:dataforge)

```shell
npm i --save data-forge
npm i --save data-forge-fs
npm i --save data-forge-plot @data-forge-plot/render
```



```js
const DF = require('data-forge');
require('data-forge-fs');
require('data-forge-plot');
require('@data-forge-plot/render');
```



