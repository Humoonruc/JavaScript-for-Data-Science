/**
 * @module csvAPI
 * @file 读、写、转换 CSV 的函数集
 * @author Humoonruc
 */


// 1. import modules
const fs = require('fs');
const path = require('path');
const parseSync = require('csv-parse/lib/sync');
const Papa = require('papaparse');
const assert = require('assert');


// 2. 函数定义
/** 读取 csv 文件为 JS 的对象数组
 * @param  {string} csvPath - csv文件的路径
 * @returns {Array} 对象数组，每个元素是 csv 文件中的一行
 */
function readCsvFile(csvPath) {
  const csvString = fs.readFileSync(csvPath, 'utf8');
  const csvData = parseSync(csvString, {
    bom: true, // 兼容 UTF8-BOM 编码
    columns: true,
    skip_empty_lines: true,
    trim: true,
    cast: value => isNaN(+value) ? value : +value, // 数字不要读为字符串
  });
  return csvData;
}

/** 将 JS 中的对象数组转换为 CSV 形式的字符串
 * @param  {Array} data 对象数组
 * @returns {string} CSV 形式的长字符串
 */
function jsonToCsvString(data) {
  return Papa.unparse(data);
}

/** 将 JS 中的对象数组写入一个 CSV 文件
 * @param  {string} csvPath 要写入的 CSV 文件的路径
 * @param  {Array} data 对象数组
 * @returns {void}
 */
function writeCsvFile(csvPath, data) {
  const csvString = Papa.unparse(data);
  fs.writeFileSync(csvPath, csvString, 'utf8');
}


// 3. 测试
const testing = () => {
  const dataPath = path.join(__dirname, 'example.csv');
  const outputPath = path.join(__dirname, 'writeCsv.csv');

  const csvData = readCsvFile(dataPath);
  writeCsvFile(outputPath, csvData);

  assert.deepStrictEqual(csvData, [{ "name": "John", "age": 18, "height": 182 }, { "name": "Kate", "age": 17, "height": 163 }]);
  assert.deepStrictEqual(jsonToCsvString(csvData), "name,age,height\r\nJohn,18,182\r\nKate,17,163");
  assert.deepStrictEqual(readCsvFile(outputPath), [{ "name": "John", "age": 18, "height": 182 }, { "name": "Kate", "age": 17, "height": 163 }]);
};
testing();


// 4. 导出
module.exports = {
  readCsvFile: readCsvFile,
  writeCsvFile: writeCsvFile,
  jsonToCsvString: jsonToCsvString,
};