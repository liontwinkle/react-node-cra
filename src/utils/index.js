import { OrderedMap } from 'immutable';
import uuidv4 from 'uuid/v4';
import {
  AddSets, DiffSets, formatDifference, RuleEngine,
} from 'components/Attributes/AttributeRules/RuleEngine';
import {
  basis, match, refer, scope,
} from './constants';

const AnaylsisDetails = (valueStr, valueDetails) => {
  const partValue = valueStr.split(']');
  const detailValue = partValue[0].split(':');
  const detailKey = detailValue[0].replace('[', '');
  const matchKey = `:${detailValue[1]}`;
  const valueKey = partValue[1];
  const detailObj = valueDetails.find(
    valueDetailsItem => (valueDetailsItem.key === detailKey.replace(' ', '')),
  );
  const matchObj = match.find(matchItem => (matchItem.key === matchKey));
  return {
    detailObj,
    matchObj,
    valueKey,
  };
};

export const getRules = (srcRules, valueDetails) => {
  const newRules = [];
  const editRules = [];
  srcRules.forEach((item) => {
    const basisObj = basis.find(basisItem => (basisItem.key === item.basis));
    const referObj = refer.find(referItem => (referItem.key === item.refer));
    const otherObj = AnaylsisDetails(item.value, valueDetails);
    newRules.push({
      _id: item._id,
      basis: basisObj,
      refer: referObj,
      detail: otherObj.detailObj,
      match: otherObj.matchObj,
      value: otherObj.valueKey,
      scope: scope[0],
    });
    editRules.push({
      _id: item._id,
      basis: basisObj.key,
      refer: referObj.key,
      detail: otherObj.detailObj.key,
      match: otherObj.matchObj.key,
      value: otherObj.valueKey,
      scope: scope[0].key,
    });
  });
  return {
    newRules,
    editRules,
  };
};

const getAllmatched = (products, match, value, basis) => {
  const returnValue = {
    includes: [],
    excludes: [],
  };
  let includeIndex = 0;
  let excludeIndex = 0;
  const rule = RuleEngine[match](value);


  products.forEach((proItem) => {
    const values = Object.values(proItem);
    if (values.filter(item => (rule.test(item))).length > 0) {
      if (basis === 'include') {
        returnValue.includes[includeIndex] = proItem;
        includeIndex++;
      } else {
        returnValue.excludes[excludeIndex] = proItem;
        excludeIndex++;
      }
    }
  });
  return returnValue;
};

const getRuleProducts = (products, field, match, value, basis) => {
  const rule = RuleEngine[match](value);
  const returnValue = {
    includes: [],
    excludes: [],
  };
  let includeIndex = 0;
  let excludeIndex = 0;

  products.forEach((productItem) => {
    if (rule.test(productItem[field])) {
      if (basis === 'include') {
        returnValue.includes[includeIndex] = productItem;
        includeIndex++;
      } else {
        returnValue.excludes[excludeIndex] = productItem;
        excludeIndex++;
      }
    }
  });
  return returnValue;
};

export const getPreFilterData = (rules, products) => {
  formatDifference();
  let filterResult = new Set();

  rules.forEach((item) => {
    const field = item.detail;
    const { match, value, basis } = item;
    if (field === '*') {
      filterResult = getAllmatched(products, match, value, basis);
    } else {
      filterResult = getRuleProducts(products, field, match, value, basis);
    }
    AddSets(filterResult.includes, 'includes');
    AddSets(filterResult.excludes, 'excludes');
  });

  return Array.from(DiffSets());
};

const getSubTree = (list, parentId, type, originNode) => {
  const subTree = [];
  const association = [];
  const sublist = list.filter(item => item[type] === parentId);
  if (sublist.length > 0) {
    sublist.forEach((item, key) => {
      const subNode = (originNode && originNode.length > 0 && originNode[key]) ? originNode[key] : null;
      association.push({
        label: item.name,
        value: item._id,
        appear: item.appear || [],
        children: getSubTree(list, item._id, type).association,
      });
      subTree.push({
        title: item.name,
        editable: false,
        expanded: (subNode) ? subNode.expanded : false,
        item,
        children: getSubTree(list, item._id, type, (subNode) ? subNode.children : null).subTree,
      });
    });
  }

  return {
    subTree,
    association,
  };
};

export const confirmMessage = (func, msg, type) => {
  const duration = (type === 'success' || type === 'info') ? 2000 : 4000;
  func(msg, {
    variant: type,
    autoHideDuration: duration,
  });
};

export const getCategoryTree = (categories, originNode) => {
  const parentId = '';
  const list = categories || [];

  return getSubTree(list, parentId, 'parentId', originNode);
};

export const getAttribute = (attributes) => {
  const groupId = '';
  const list = attributes || [];
  return getSubTree(list, groupId, 'groupId');
};

export const isExist = (obj, key) => {
  const filterArr = obj.filter(item => (item.key === key));
  return filterArr.length;
};

export const getNodeKey = ({ treeIndex }) => treeIndex;

export const getMapFromJson = (data, pKey) => {
  let map = new OrderedMap();

  const { glue, rules } = data;

  if (glue) {
    const parentKey = uuidv4();
    map = map.set(parentKey, {
      glue,
      parentKey: pKey,
    });

    if (rules) {
      for (let i = 0; i < rules.length; i++) {
        if (rules[i].glue) {
          const subMap = getMapFromJson(rules[i], parentKey);
          map = map.mergeDeep(subMap);
        } else {
          const key = uuidv4();
          map = map.set(key, {
            ...rules[i],
            parentKey,
          });
        }
      }
    }
  }

  if (map.size === 0) {
    const newKey = uuidv4();
    map = map.set(newKey, {
      glue: 'and',
      parentKey: '',
    });
    map = map.set(uuidv4(), {
      key: '',
      parentKey: newKey,
    });
  }

  return map;
};

export const getJsonFromMap = (map, glue, pKey) => {
  let json = {};

  if (glue) {
    json = {
      glue,
      hashKey: pKey,
      rules: [],
    };
  }

  map.forEach((value, key) => {
    if (value.parentKey === pKey) {
      if (value.glue) {
        const subJson = getJsonFromMap(map, value.glue, key);
        if (json.rules) {
          json.rules.push(subJson);
        } else {
          json = subJson;
        }
      } else if (json.rules) {
        json.rules.push({
          ...value,
          hashKey: key,
        });
      }
    }
  });

  if (json.rules && json.rules.length > 0) {
    json.lastKey = json.rules[json.rules.length - 1].hashKey;
  }

  return json;
};

export const removeRecursive = (map, parentKey) => {
  let newMap = map;

  let hasChild = false;
  const [...keys] = newMap.keys();
  for (let i = 0; i < keys.length; i++) {
    const value = newMap.get(keys[i]);
    if (value.parentKey === parentKey) {
      hasChild = true;
      break;
    }
  }

  if (!hasChild) {
    const newParent = newMap.get(parentKey);
    newMap = newMap.delete(parentKey);
    if (newParent) {
      newMap = removeRecursive(newMap, newParent.parentKey);
    }
  }

  return newMap;
};

export const convertDateFormat = (date) => {
  const convertDateFormat = new Date(date.replace('T', ' '));
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(convertDateFormat);
};

export const sortByOrder = (a, b) => a.order - b.order;

export const getObjectFromArray = (array) => {
  const res = {};
  array.forEach((item) => {
    res[item.key] = item.label;
  });

  return res;
};

const getRulesKey = (keys) => {
  const ruleKeys = [
    {
      label: 'All',
      key: '*',
    },
  ];
  keys.forEach((keyItem, key) => {
    ruleKeys[key + 1] = {
      label: keyItem,
      key: keyItem,
    };
  });
  return ruleKeys;
};

export const getProducts = (products) => {
  const columns = [];
  const objects = [];
  let headers = [];

  if (products.length > 0) {
    headers = Object.keys(products[0])
      .sort();

    Object.values(products[0])
      .forEach((value, key) => {
        switch (typeof value) {
          case 'number':
            columns[key] = {
              data: headers[key],
              type: 'numeric',
            };
            break;
          case 'date':
            columns[key] = {
              data: headers[key],
              type: 'date',
              dateFormat: 'MM/DD/YYYY',
            };
            break;
          case 'object':
          case 'array':
            columns[key] = {
              data: headers[key],
              type: 'dropdown',
            };
            break;
          case 'string':
            columns[key] = {
              data: headers[key],
              type: 'text',
            };
            break;
          default:
            columns[key] = {
              data: headers[key],
            };
            break;
        }
      });

    products.forEach((dataObj, objKey) => {
      const subObject = {};
      const subKeys = Object.keys(dataObj);
      Object.values(dataObj)
        .forEach((dataItems, key) => {
          if (typeof dataItems === 'object') {
            subObject[subKeys[key]] = JSON.stringify(dataItems);
          } else {
            subObject[subKeys[key]] = dataItems;
          }
        });
      objects[objKey] = subObject;
    });
  }
  return {
    columns,
    headers,
    valueDetails: getRulesKey(headers),
    products: objects,
  };
};
