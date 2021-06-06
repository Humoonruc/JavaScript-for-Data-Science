[TOC]

# Data I/O

## CSV

### 解析 CSV

注意，==从 Excel 保存的 csv 文件的编码格式为 UTF-8-BOM==，读取时常常产生错误。因此一定要在 Notepad++中打开，将编码格式改为 UTF-8，才能正常解析。

#### csv-parse 模块

Home Page: https://csv.js.org/

CSV 内含四个子模块，都==只能在 Node.js 中使用==：

1. [csv-generate](https://csv.js.org/generate/)
2. [csv-parse](https://csv.js.org/parse/)，将 CSV 解析为==对象数组==，最实用
3. [stream-transform](https://csv.js.org/transform/)
4. [csv-stringify](https://csv.js.org/stringify/)

```shell
npm i csv --save
npm i csv-parse --save # 只用这个子模块时，不必全安装 csv
```

CSV-Parse 有五种API: Stream, Callback, Stream+Callback, Sync, Async iterator

以下为 Sync 同步版代码：`parse(data[, options])`

```javascript
const fs = require('fs');
const parseSync = require('csv-parse/lib/sync');

const data = fs.readFileSync('./data.csv', 'utf8');
const records = parseSync(data, {
  bom: true,
  columns: true,
  skip_empty_lines: true,
  trim: true,
  cast: value => isNaN(+value) ? value : +value, // 数字不要读为字符串
});
console.log(records);
```

options 中的 key:

- `cast`(function(value[, context]))，接收一个函数，对读入的每一个单元格（value）进行操作。context 对象中可以调用 value 的各项属性：
  - `column` (number|string)
    The column name if the `columns` options is defined or the field position.
  - `empty_lines` (number)
    Internal counter of empty lines encountered until this field.
  - `header` (boolean)
    A boolean indicating if the provided value is a part of the header.
  - `index` (number) 所在列的索引
    The field position starting at 0. 
  - `invalid_field_length` (number)
    Number of records with a non uniform length when [`relax_column_count`](https://csv.js.org/parse/options/relax_column_count/) is true. It was named `skipped_lines` until version 3.
  - `lines` (number)
    The number of lines which have been processed including the current line.
  - `quoting` (boolean)
    A boolean indicating if the field was surrounded by quotes.
  - `records` (number)
    The number of records which have been fully parsed. It was named `count` until version 3.
- `columns`(boolean), 是否将首行作为字段名
- `delimiter`，分隔符，默认为`,`
- `encoding`
- `bom`(boolean = false)，建议设为 true，若 csv 的编码格式为 UTF-8-BOM，一样能正确解析
- `skip_empty_lines`(boolean)，去掉空行
- `info`(boolean = false), 若为true，返回一个对象，其 info 属性储存了csv的一些元信息，record属性储存了数据
- `from`, 从第几行记录开始
- `to`，到第几行记录结束
- `from_line`, 从第几行开始
- `to_line`，到第几行结束
- `trim`(boolean), 是否删除数据两边的空格
- `ltrim`(boolean), 只删除数据左边的空格
- `rtrim`(boolean), 只删除数据右边的空格

#### d3 模块

`d3.csv()`可以读取csv，注意其是对 Ajax 的包装，返回 promise，因此==要用 async/await 包裹==，而且==只能运行在浏览器中==

#### Papa Parse 模块

[Papa Parse - Powerful CSV Parser for JavaScript](https://www.papaparse.com/)

https://github.com/mholt/PapaParse，有 papaparse.min.js 的下载链接，因此该模块除了可以运行在 Node.js 中，还可以用在浏览器端

```shell
npm i papaparse --save
```

解析CSV：

```js
const Papa = require('papaparse')

// Parse CSV string
const results = Papa.parse(csvString[, options]);
/*
	results = {
		data: [ ... ],    // parsed data
		errors: [ ... ],  // errors encountered
		meta: {	... }     // extra parse info
	}
*/
```

options 对象中的部分 key: 

- `header`: true, 标题行
- `dynamicTyping`: true，不要将数字和布尔值解析为字符串
- `comments`: "#", 规定注释行，不解析

```js
// 自动识别分隔符
const results = Papa.parse(csvString);
console.log(results.meta.delimiter);
// "\t"


// Parse local CSV file
Papa.parse(file, {
	complete: function(results) {
		console.log("Finished:", results.data);
	}
});


// parse remote csv file
Papa.parse("http://example.com/file.csv", {
	download: true,
	complete: function(results) {
		console.log(results);
	}
});


// Stream big csv file
Papa.parse(bigFile, {
	download: true,
	step: function(row) {
		console.log("Row:", row.data);
	},
	complete: function() {
		console.log("All done!");
	}
});

Papa.parse(bigFile, {
	worker: true,
	step: function(row) {
		console.log("Row:", row.data);
	},
	complete: function() {
		console.log("All done!");
	}
});
```

### 格式化数据为 CSV

#### Papa Parse 模块

```js
const fs = require('fs')
const Papa = require('papaparse')

const csvString = Papa.unparse(data);
fs.writeFileSync('./unparse.csv', csvString, 'utf8');
```



