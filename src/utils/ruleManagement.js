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

const getAllmatched = (products, match, value) => {
  const returnValue = [];
  let index = 0;
  const rule = RuleEngine[match](value);
  products.forEach((proItem) => {
    const values = Object.values(proItem);
    if (values.filter((item) => (rule.test(item))).length > 0) {
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

const AnaylsisDetails = (valueStr, valueDetails) => {
  const partValue = valueStr.split(']');
  const detailValue = partValue[0].split(':');
  const detailKey = detailValue[0].replace('[', '');
  const matchKey = `:${detailValue[1]}`;
  const valueKey = partValue[1];
  const detailObj = valueDetails.find(
    (valueDetailsItem) => (valueDetailsItem.key === detailKey.replace(' ', '')),
  );
  const matchObj = match.find((matchItem) => (matchItem.key === matchKey));
  return {
    detailObj,
    matchObj,
    valueKey,
  };
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
    const otherObj = AnaylsisDetails(item.value, valueDetails);
    if (otherObj.detailObj && otherObj.matchObj && otherObj.valueKey) {
      newRules.push({
        _id: item._id,
        basis: basisObj,
        refer: referObj,
        detail: otherObj.detailObj,
        match: otherObj.matchObj,
        value: otherObj.valueKey,
        scope: scope[0],
        ruleType: ruleTypeObj,
      });
      editRules.push({
        _id: item._id,
        basis: basisObj.key,
        refer: referObj.key,
        detail: otherObj.detailObj.key,
        match: otherObj.matchObj.key,
        value: otherObj.valueKey,
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
