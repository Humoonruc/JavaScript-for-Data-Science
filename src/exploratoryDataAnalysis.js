/**
 * @module exploratoryDataAnalysis
 * @file 探索性数据分析的一般流程
 */


//========================================
// 1. import modules
const path = require('path');
const assert = require('assert');
const formulajs = require('formulajs');

// data-forge series
const DF = require('data-forge');
require('data-forge-fs');
require('data-forge-plot');
require('@data-forge-plot/render');

// read csv function
const readCsvFile = require('./toolkit/csvAPI').readCsvFile;


//========================================
// 2. scan data structure
const rootPath = path.parse(__dirname).dir;
const dataPath = path.join(rootPath, 'data', 'monthly_crashes-cut-down.csv');
const data = readCsvFile(dataPath).slice(-3); // 只看后3行
console.log(data);

// 看到局部数据的结构后，检验全部数据的数据类型
// 关系型数据库中读来的数据最好都进行这种检查
data.forEach(row => {
  assert(typeof (row.Year) === 'number');
  assert(typeof (row.Month) === 'string');
  assert(typeof (row.Crashes) === 'number');
  assert(typeof (row.Fatalities) === 'number');
});


//========================================
// 3. 将csv转化为规范的数据框
const dataFrame = DF.readFileSync(dataPath).parseCSV() // 这一步已转化为数据框
  .parseFloats(["Month#", "Year", "Crashes", "Fatalities", "Hospitalized"]) // 解析数字
  .setIndex('Month#'); // 设定索引（主键）

console.log("=== Head ===");
console.log(dataFrame.head(2).toString());
console.log("=== Tail ===");
console.log(dataFrame.tail(2).toString());
console.log("=== Data Structure ===");
console.log(dataFrame.detectTypes().toString());


//========================================
// 4. 计算新列并添加到旧数据框中
const fatalitiesSeries = dataFrame.getSeries('Fatalities'); // 返回一列，数据类型为 data series
const fatalitiesSeriesWithForecast = fatalitiesSeries
  .rollingWindow(6).select(window => { // 这列的每六个元素组成一个 window，类型仍为 data series
    const fatalitiesValues = window.toArray(); // 将 data series 转化为数组
    const monthNoValues = window.getIndex().toArray(); // windows 对应的索引数组
    const nextMonthNo = monthNoValues[fatalitiesValues.length - 1] + 1;
    return [
      // 横坐标外延，预测纵坐标的值。这是外推法
      nextMonthNo, formulajs.FORECAST(nextMonthNo, fatalitiesValues, monthNoValues)
    ]; // 每个window返回一个(索引，值)的二元数组
  })
  .withIndex(pair => pair[0]) // 索引作为主键
  .select(pair => pair[1]); // 将新产生的预测值这一列赋值给 fatalitiesSeriesWithForecast

const dataFrameWithForecast = dataFrame.withSeries({
  Trend: fatalitiesSeriesWithForecast,
}); // 旧数据框 data-join 新列后，成为新数据框


//========================================
// 5. 输出
const outputPath = path.join(rootPath, 'public', 'output', 'trend_output.csv');
dataFrameWithForecast.asCSV() // 数据框还原为 csv
  .writeFileSync(outputPath);