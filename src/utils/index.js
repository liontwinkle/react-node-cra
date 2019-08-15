import { OrderedMap } from 'immutable';
import uuidv4 from 'uuid/v4';

const getSubTree = (list, parentId) => {
  const subTree = [];
  const sublist = list.filter(item => item.parentId === parentId);
  if (sublist.length > 0) {
    sublist.forEach((item) => {
      subTree.push({
        title: item.name,
        editable: false,
        item,
        children: getSubTree(list, item._id),
      });
    });
  }

  return subTree;
};

export const getCategoryTree = (categories) => {
  const parentId = '';
  const list = categories || [];

  return getSubTree(list, parentId);
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

export const getProducts = (products) => {
  const keys = Object.keys(products[0]);
  const values = Object.values(products[0]);
  const headers = keys.map(key => key.toUpperCase());
  const columns = [];
  values.forEach((value, key) => {
    let type = {};
    switch (typeof value) {
      case 'boolean':
        type = {
          data: keys[key],
          type: 'checkbox',
        };
        break;
      case 'number':
        type = {
          data: keys[key],
          type: 'numeric',
        };
        break;
      case 'date':
        type = {
          data: keys[key],
          type: 'date',
          dateFormat: 'MM/DD/YYYY',
        };
        break;
      case 'object':
      case 'string':
        type = {
          data: keys[key],
          type: 'text',
        };
        break;
      default:
        type = {
          data: keys[key],
        };
        break;
    }
    columns.push(type);
  });
  const objects = [];
  products.forEach((dataObj) => {
    const subObject = {};
    const subKeys = Object.keys(dataObj);
    const subValues = Object.values(dataObj);
    subValues.forEach((dataItems, key) => {
      let data = '';
      if (typeof dataItems === 'object') {
        data = JSON.stringify(dataItems);
      } else {
        data = dataItems;
      }
      subObject[subKeys[key]] = data;
    });
    objects.push(subObject);
  });
  return {
    columns,
    headers,
    data: objects,
  };
};
