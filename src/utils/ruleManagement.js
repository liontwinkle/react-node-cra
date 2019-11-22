import _union from 'lodash/union';
import {
  AddSets,
  formatProductsData,
  formatDifference,
  getData,
  RuleEngine,
} from './RuleEngine';
import {
  basis, match, refer, scope, ruleType,
} from './constants';

// todo fix the algorithm or improve the performance
// const getAllmatched = (products, match, value) => {
//   const returnValue = [];
//   let index = 0;
//   const rule = RuleEngine[match](value);
//   products.forEach((proItem) => {
//     const values = Object.values(proItem);
//     if (values.filter((item) => (rule.test(item))).length > 0) {
//       returnValue[index] = proItem;
//       index++;
//     }
//   });
//   return returnValue;
// };

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
  const field = rules[key].key.key;
  const match = rules[key].match.key;
  const { criteria } = rules[key];
  let filterResult = new Set();

  formatProductsData();
  formatDifference();

  if (field === '*') {
    // filterResult = getAllmatched(products, match, criteria); todo for large data it works so lazy
    filterResult = getProducts(products, 'name', match, criteria); // fixme set 'name' field as default
  } else {
    filterResult = getProducts(products, field, match, criteria);
  }
  AddSets(filterResult, 'union');
  return Array.from(getData().union);
};

export const addNewRuleHistory = (createHistory, Item, groupId, msgCurrent, msgParent, type) => {
  createHistory({
    label: msgCurrent,
    itemId: Item.id,
    type,
  })
    .then(() => {
      if (groupId !== 'null') {
        createHistory({
          label: msgParent,
          itemId: groupId,
          type,
        });
      }
    });
};

export const setUnionRules = (srcAttributes) => {
  let srcAttributeRules = [];
  srcAttributes.forEach((attritbueItem) => {
    srcAttributeRules = _union(srcAttributeRules, attritbueItem.rules);
  });
  return srcAttributeRules;
};

export const getRules = (srcRules, valueDetails) => {
  const newRules = [];
  const editRules = [];
  srcRules.forEach((item) => {
    const basisObj = basis.find((basisItem) => (basisItem.key === item.basis));
    const referObj = refer.find((referItem) => (referItem.key === item.refer));
    const ruleTypeObj = ruleType.find((ruleTypeItem) => (ruleTypeItem.key === item.ruleType));
    const matchObj = match.find((matchItem) => (matchItem.key === item.match));
    const keyObject = valueDetails.find((keyItem) => (keyItem.key === item.key));
    newRules.push({
      _id: item._id,
      basis: basisObj,
      refer: referObj,
      key: keyObject,
      match: matchObj,
      criteria: item.criteria,
      scope: scope[0],
      ruleType: ruleTypeObj,
    });
    editRules.push({
      _id: item._id,
      basis: basisObj.key,
      refer: referObj.key,
      key: keyObject.key,
      match: matchObj.key,
      criteria: item.criteria,
      scope: scope[0].key,
      ruleType: ruleTypeObj.key,
    });
  });
  return {
    newRules,
    editRules,
  };
};

export const unionRules = (ruleA, ruleB) => {
  let ruleBigSet = [];
  let ruleSmallSet = [];
  if (ruleA.length > ruleB.length) {
    ruleBigSet = ruleA;
    ruleSmallSet = ruleB;
  } else {
    ruleBigSet = ruleB;
    ruleSmallSet = ruleA;
  }
  const unionSet = [];
  ruleBigSet.forEach((item) => {
    const index = ruleSmallSet.findIndex((itemSmall) => (
      itemSmall.basis === item.basis
      && itemSmall.value === item.value
    ));
    if (index < 0) {
      unionSet.push(item);
    }
  });
  return _union(unionSet, ruleSmallSet);
};
