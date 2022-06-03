const constants = require("./constants");

const testFun = (a: number, b: number): string => {
  console.log(constants.PAYMENT_WRAPPER);
  return `${constants.IFRAME_WRAPPER} ${a + b}`;
};

const re = testFun(5, 10);
console.log(re);
