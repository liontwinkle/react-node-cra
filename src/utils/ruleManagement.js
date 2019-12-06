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

const getProducts = (products, field, match, value) => {
  const rule = RuleEngine[match](value);
  const returnValue = [];
  let index = 0;
  let matchedFlag = false;
  products.forEach((productItem) => {
    matchedFlag = !!(productItem[field] && productItem[field].match(rule));
    if (matchedFlag) {
      returnValue[index] = productItem;
      index++;
    }
  });
  return returnValue;
};
export const filterProducts = (products, rules, key) => {
  const field = rules[key].key.key;
  const match = rules[key].type.key;
  const { criteria } = rules[key];
  let filterResult = new Set();

  formatProductsData();
  formatDifference();
  if (field === '*') {
    filterResult = getProducts(products, 'name', match, criteria);
  } else {
    filterResult = getProducts(products, field, match, criteria);
  }
  AddSets(filterResult, 'union');
  return Array.from(getData().union);
};

export const addNewRuleHistory = (createHistory, Item, groupId, msgCurrent, msgParent, type) => {
  createHistory({
    label: msgCurrent,
    itemId: Item._id,
    type,
  })
    .then(() => {
      if (groupId !== null) {
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
    const matchObj = match.find((matchItem) => (matchItem.key === item.type));
    const keyObject = valueDetails.find((keyItem) => (keyItem.key === item.key));
    if (keyObject) {
      newRules.push({
        basis: basisObj,
        refer: referObj,
        key: keyObject,
        type: matchObj,
        criteria: item.criteria,
        scope: scope[0],
        ruleType: ruleTypeObj,
      });
      editRules.push({
        basis: basisObj.key,
        refer: referObj.key,
        key: keyObject.key,
        type: matchObj.key,
        criteria: item.criteria,
        scope: scope[0].key,
        ruleType: ruleTypeObj.key,
      });
    }
  });
  return {
    newRules,
    editRules,
  };
};

export const unionRules = (ruleA, ruleB) => {
  let ruleBigSet = [];
  let ruleSmallSet = [];
  if (ruleA.length >= ruleB.length) {
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
      && item.type === itemSmall.type
      && item.key === itemSmall.key
      && itemSmall.criteria === item.criteria
    ));
    if (index < 0) {
      unionSet.push(item);
    }
  });
  return _union(unionSet, ruleSmallSet);
};
