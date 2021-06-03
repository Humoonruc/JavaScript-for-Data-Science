/**
 * @module exploratoryDataAnalysis
 * @file 探索性数据分析的一般流程
 */


// import modules
const path = require('path');
const assert = require('assert');
const DF = require('data-forge');
require('data-forge-fs');
require('data-forge-plot');
require('@data-forge-plot/render');
const formulajs = require('formulajs');
const readCsvFile = require('./csvAPI').readCsvFile;


// scan data structure
const dataPath = path.join(path.parse(__dirname).dir, 'data', 'monthly_crashes-cut-down.csv');
const data = readCsvFile(dataPath).slice(-3); // 只看后3行
console.log(data);


// 检验数据类型，关系型数据库中读来的数据最好都进行这种检查
data.forEach(row => {
  assert(typeof (row.Year) === 'number');
  assert(typeof (row.Month) === 'string');
  assert(typeof (row.Crashes) === 'number');
  assert(typeof (row.Fatalities) === 'number');
});


// 打印规范的数据框，查看数据表结构
let dataFrame = DF.readFileSync(dataPath).parseCSV();

console.log("=== Head ===");
console.log(dataFrame.head(2).toString());
console.log("=== Tail ===");
console.log(dataFrame.tail(2).toString());

dataFrame = dataFrame.parseFloats(["Month#", "Year", "Crashes", "Fatalities", "Hospitalized"])
  .setIndex('Month#');
console.log("=== Data Structure ===");
console.log(dataFrame.detectTypes().toString());


// 计算新列并添加到旧列中
const fatalitiesSeries = dataFrame.getSeries('Fatalities'); // 返回 Data-Forge Series 对象
const fatalitiesSeriesWithForecast = fatalitiesSeries.rollingWindow(6).select(window => {
  const fatalitiesValues = window.toArray();
  const monthNoValues = window.getIndex().toArray();
  const nextMonthNo = monthNoValues[fatalitiesValues.length - 1] + 1;
  return [
    nextMonthNo, formulajs.FORECAST(nextMonthNo, fatalitiesValues, monthNoValues)
  ];
}).withIndex(pair => pair[0]).select(pair => pair[1]);

const dataFrameWithForecast = dataFrame.withSeries({ Trend: fatalitiesSeriesWithForecast, });


// 输出 csv
const outputPath = path.join(path.parse(__dirname).dir, 'output', 'trend_output.csv');
dataFrameWithForecast.asCSV().writeFileSync(outputPath);