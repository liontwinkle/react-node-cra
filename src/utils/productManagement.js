/* eslint-disable import/prefer-default-export */
import {
  AddSets,
  formatProductsData,
  formatDifference,
  getData,
  RuleEngine,
} from './RuleEngine';

const getAllmatched = (products, match, value) => {
  const returnValue = [];
  let index = 0;
  const rule = RuleEngine[match](value);
  products.forEach((proItem) => {
    const values = Object.values(proItem);
    if (values.filter(item => (rule.test(item))).length > 0) {
      returnValue[index] = proItem;
      index++;
    }
  });
  return returnValue;
};

const getProducts = (products, field, match, value) => {
  const rule = RuleEngine[match](value);
  const returnValue = [];
  let index = 0;

  products.forEach((productItem) => {
    if (rule.test(productItem[field])) {
      returnValue[index] = productItem;
      index++;
    }
  });
  return returnValue;
};

export const filterProducts = (products, rules, key) => {
  const field = rules[key].detail.key;
  const match = rules[key].match.key;
  const { value } = rules[key];
  let filterResult = new Set();

  formatProductsData();
  formatDifference();

  if (field === '*') {
    filterResult = getAllmatched(products, match, value);
  } else {
    filterResult = getProducts(products, field, match, value);
  }
  AddSets(filterResult, 'union');
  return Array.from(getData().union);
};
