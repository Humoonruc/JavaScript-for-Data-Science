/**
 * @module vectorization
 * @file 将向量化操作封装为一个对象并导出。向量作为矩阵的特殊形式，也可以用 math.js 模块的矩阵运算
 * @author Humoonruc
 */

const assert = require('assert');


// 将常用运算定义为函数
const add = (a, b) => a + b;
const times = (a, b) => a * b;
const power = (a, b) => Math.pow(a, b);


/** 生产向量化操作函数的工厂
 * @param  {Function} operation - 操作两个标量的函数
 * @returns {Function} - 操作矢量的函数
 */
function vectorizationFactory(operation) {

  /** 工厂返回的向量化操作函数
   * @param  {Array} vector - 向量
   * @param  {any} para - 操作的第二个参数，可能是向量，也可能是标量
   */
  return function (vector, para) {
    if (Array.isArray(para)) {
      const n = vector.length;
      const result = [];
      for (let i = 0; i < n; i++) {
        result.push(operation(vector[i], para[i]));
      }
      return result;
    } else {
      return vector.map(ele => operation(ele, para));
    }
  };
}


// 用对象封装这些函数，然后把这个对象暴露给其他模块
const vectorization = {
  add: vectorizationFactory(add),
  times: vectorizationFactory(times),
  power: vectorizationFactory(power),
};
module.exports = vectorization;

// 测试
const testing = () => {
  const v1 = [1, 2, 3];
  const v2 = [4, 5, 6];
  const scalar = 2;

  assert.deepStrictEqual(vectorization.add(v1, v2), [5, 7, 9]);
  assert.deepStrictEqual(vectorization.power(v1, scalar), [1, 4, 9]);
};

testing();