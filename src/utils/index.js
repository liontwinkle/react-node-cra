import { OrderedMap } from 'immutable';
import uuidv4 from 'uuid/v4';
import { makeStyles } from '@material-ui/core';
import {
  AddSets, DiffSets, formatDifference, RuleEngine,
} from './RuleEngine';


const makeArrayObject = (array, idName) => {
  const list = JSON.parse(JSON.stringify(array)) || [];
  list.forEach((item, index) => {
    if (item[idName] === '') {
      list[index][idName] = null;
    }
  });
  return list;
};
/** ** PREDEFINED ***** */
export const sortByOrder = (a, b) => {
  const fieldItemA = a.order || 0;
  const fieldItemB = b.order || 0;
  return fieldItemA - fieldItemB;
};

export const sortByField = (field) => (a, b) => {
  const fieldItemA = a[field].toUpperCase();
  const fieldItemB = b[field].toUpperCase();
  let comparison = 0;
  if (fieldItemA > fieldItemB) {
    comparison = 1;
  } else if (fieldItemA < fieldItemB) {
    comparison = -1;
  }
  return comparison;
};
/** ** UTILS DEFINE **** */
const getRuleProducts = (products, field, match, criteria, basis) => {
  const rule = RuleEngine[match](criteria);
  const returnValue = {
    includes: [],
    excludes: [],
  };
  let includeIndex = 0;
  let excludeIndex = 0;
  let matchedFlag = false;
  products.forEach((productItem) => {
    matchedFlag = !!(productItem[field] && productItem[field].match(rule));
    if (matchedFlag) {
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

const getSubTree = (list, parentId, type, originNode, newPid) => {
  list.sort(sortByField('name'));

  const subTree = [];
  const association = [];
  const sublist = list.filter((item) => item[type] === parentId);
  if (sublist.length > 0) {
    sublist.forEach((item) => {
      let subNode = null;
      let expandFlag = false;
      if (originNode && originNode.length) {
        subNode = originNode.find((nodeItem) => (nodeItem.item._id === item._id));
      }

      if (newPid !== undefined && item._id === newPid) {
        expandFlag = true;
      } else {
        expandFlag = (subNode) ? subNode.expanded : false;
      }

      association.push({
        label: item.name,
        value: item._id,
        appear: item.appear || [],
        children: getSubTree(list, item._id, type).association,
      });
      subTree.push({
        title: item.name,
        editable: false,
        expanded: expandFlag,
        item,
        children: getSubTree(list, item._id, type, (subNode) ? subNode.children : null, newPid).subTree,
      });
    });
  }

  return {
    subTree,
    association,
  };
};

const getRulesKey = (keys) => {
  // const ruleKeys = [
  //   {
  //     label: 'All',
  //     key: '*',
  //   },
  // ];
  // keys.forEach((keyItem, key) => {
  //   ruleKeys[key + 1] = {
  //     label: keyItem,
  //     key: keyItem,
  //   };
  // });
  const ruleKeys = [];
  keys.forEach((keyItem, key) => {
    ruleKeys[key] = {
      label: keyItem,
      key: keyItem,
    };
  });
  return ruleKeys;
};

/** ** EXPORTS DEFINE **** */

export const useStyles = makeStyles((theme) => ({
  dialogAction: {
    margin: theme.spacing(2),
  },
  dialogContent: {
    overflow: 'unset',
  },
}));

export const hasSubArray = (master, sub) => sub.every(((i) => master.indexOf(i) > -1));

export const confirmMessage = (func, msg, type) => {
  const duration = (type === 'success' || type === 'info') ? 2000 : 4000;
  func(msg, {
    variant: type,
    autoHideDuration: duration,
  });
};

export const getSubItems = ({ children }) => {
  let childLength = 0;

  if (children) {
    childLength = children.length;
    children.forEach((item) => {
      childLength += getSubItems(item);
    });
  }
  return childLength;
};

export const setHandler = (context, callback) => {
  const keys = Object.keys(context);
  keys.forEach((keyItem) => {
    context[keyItem].addEventListener('contextmenu', callback);
  });
  return () => keys.forEach((keyItem) => {
    context[keyItem].removeEventListener('contextmenu', callback);
  });
};


export const getPreFilterData = (rules, products) => {
  formatDifference();
  let filterResult = new Set();
  rules.forEach((item) => {
    const field = item.key;
    const { type, criteria, basis } = item;
    if (field === '*') {
      filterResult = getRuleProducts(products, 'name', type, criteria, basis);
    } else {
      filterResult = getRuleProducts(products, field, type, criteria, basis);
    }
    AddSets(filterResult.includes, 'includes');
    AddSets(filterResult.excludes, 'excludes');
  });

  return Array.from(DiffSets());
};

export const getCategoryTree = (categories, originNode, newPid) => {
  const parentId = null;
  const list = makeArrayObject(categories, 'parent_id');
  return getSubTree(list, parentId, 'parent_id', originNode, newPid);
};

export const getAttribute = (attributes, originNode, newGid) => {
  const groupId = null;
  const list = makeArrayObject(attributes, 'group_id');

  return getSubTree(list, groupId, 'group_id', originNode, newGid);
};

export const convertPropertyData = (data) => {
  const source = JSON.parse(JSON.stringify(data));
  let result = {};
  const properties = source.properties || {};
  const keys = Object.keys(properties);
  keys.forEach((keyItem) => {
    result = { ...result, ...properties[keyItem] };
  });
  source.properties = result;
  return source;
};

export const convertString = (data) => {
  let defaultValue = '';
  if (data === 'false') {
    defaultValue = false;
  } else if (data === 'true') {
    defaultValue = true;
  } else {
    defaultValue = data;
  }
  return defaultValue;
};

export const changePropertiesData = (data) => {
  const recvData = JSON.parse(JSON.stringify(data));
  recvData.forEach((recvItem, index) => {
    recvData[index] = convertPropertyData(recvItem);
  });
  return recvData;
};
export const isExist = (obj, key) => {
  const filterArr = obj.filter((item) => (item.key === key));
  return filterArr.length;
};

export const getNodeKey = ({ treeIndex }) => treeIndex;

export const getMapFromJson = (data, pKey) => {
  let map = new OrderedMap();

  const { glue, rules } = data;

  if (glue) {
    const parentKey = uuidv4();
    map = map.set(parentKey, { glue, parentKey: pKey });

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

export const getObjectFromArray = (array) => {
  const res = {};
  array.forEach((item) => {
    res[item.key] = item.label;
  });

  return res;
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

export const getMaxValueFromArray = (field = null, source) => {
  let max = 0;
  source.forEach((item) => {
    const compareValue = (field) ? (item[field] || 0) : item;
    if (compareValue > max) {
      max = compareValue;
    }
  });
  return max;
};

export const checkObject = (data) => !(data === null || typeof data !== 'object' || Array.isArray(data));

export const getRootCategories = (categories, field) => {
  const roots = [];
  categories.forEach((item) => {
    if (item[field] === null) {
      roots.push(item);
    }
  });
  return roots;
};
