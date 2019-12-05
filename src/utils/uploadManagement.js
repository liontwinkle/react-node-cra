/* eslint-disable no-await-in-loop */

import _difference from 'lodash/difference';
import _union from 'lodash/union';
import { checkObject } from './index';

/** ** CONSTANT DEFINE **** */

const LIMIT_SIZE = 100 * 1024 * 1024;

const validateKey = {
  virtual: ['_id', 'name'],
  attributes: ['_id', 'name'],
  native: ['_id', 'name'],
  products: [],
};


/** ** UTILS DEFINE **** */

const checkException = (keys, dataItem, type) => {
  let passFlag = true;
  validateKey[type].forEach((validateItem) => {
    if (keys.findIndex((item) => (item === validateItem)) === -1) {
      passFlag = false;
    }
  });
  return passFlag;
};


const handleExceptionVirtual = (newData, dataItem, categories) => {
  let passFlag = true;
  const parentId = dataItem.parent_id || dataItem.parentid || null;
  if (parentId !== null && categories.findIndex((item) => (item._id === parentId)) === -1) {
    if (newData.findIndex((newItem) => (
      newItem.categoryid === parentId
    ) === -1)) {
      passFlag = false;
    }
  }
  return passFlag;
};

const handleExceptionAttribute = (newData, dataItem, attributes, categories) => {
  let passFlag = true;
  const recvGroupId = dataItem.groupid || dataItem.group_id || null;
  if (attributes.length === 0) {
    passFlag = (recvGroupId === 'null' || recvGroupId === null);
    return {
      passFlag,
      returnData: [],
    };
  }
  const deletedData = [];
  const groupIds = attributes.filter(((attributeItem) => (attributeItem.group_id === null)));
  const groupItem = groupIds.filter((item) => (item._id === recvGroupId));
  let groupData = [];
  if (recvGroupId !== null && groupItem.length === 0) {
    if (newData.findIndex((newItem) => (
      newItem.attributeid === recvGroupId
    ) === -1)) {
      passFlag = false;
    }
  } else {
    const appearData = (groupItem.length > 0) ? groupItem[0].appear : [];
    groupData = (recvGroupId === null) ? [] : appearData;
  }
  if (dataItem.appear) {
    dataItem.appear.forEach((appearItem) => {
      if (categories.findIndex((categoryItem) => categoryItem._id === appearItem) === -1) {
        deletedData.push(appearItem);
      }
    });
  }
  const returnData = _difference(dataItem.appear, deletedData);
  return {
    passFlag,
    returnData: _union(returnData, groupData),
  };
};

const checkPropertiesException = (value) => {
  if (!checkObject(value)) {
    return value;
  }
  const result = JSON.parse(JSON.stringify(value));
  const keys = Object.keys(value);
  keys.forEach((keyItem) => {
    if (!Array.isArray(value) && typeof result[keyItem] === 'object' && result[keyItem] !== null) {
      delete result[keyItem];
    }
  });
  return result;
};
const getProperties = (source) => {
  const data = JSON.parse(JSON.stringify(source));
  const keys = Object.keys(source);
  keys.forEach((keyItem) => {
    const regex = /\w*id|Id|updated/g;

    if (keyItem === 'name'
      || keyItem === 'appear'
      || keyItem === 'rules'
      || regex.test(keyItem)) {
      delete data[keyItem];
    } else {
      data[keyItem] = checkPropertiesException(data[keyItem]);
    }
  });
  return data;
};
const setTypefrmMatch = (match) => {
  switch (match) {
    case '==':
    case ':=':
      return 'exactly';
    case ':':
      return 'contains_any_tokens_case_insensitive';
    case '::':
      return 'contains_any_tokens_case_sensitive';
    default:
      return 'exactly';
  }
};

const analysisOldRuleValue = (value) => {
  const partValue = value.split(']');
  const detailValue = partValue[0].split(':');
  const key = detailValue[0].replace('[', '').replace('==', '');
  const matchKey = `:${detailValue[1]}`;
  const valueKey = partValue[1];

  return {
    key,
    type: setTypefrmMatch(matchKey),
    criteria: valueKey,
  };
};

const ruleValidate = (data) => {
  const validateData = JSON.parse(JSON.stringify(data));
  data.forEach((dataItem, index) => {
    const length = (dataItem.rules) ? dataItem.rules.length : 0;
    if (length > 0) {
      const tempRule = [];
      dataItem.rules.forEach((item) => {
        if (checkObject(item) && item.basis && item.refer) {
          if (item.value) {
            const transformData = analysisOldRuleValue(item.value);
            tempRule.push({
              basis: item.basis,
              refer: item.refer,
              type: transformData.type,
              key: transformData.key,
              criteria: transformData.criteria,
              ruleType: 'normal',
            });
          } else {
            tempRule.push({
              basis: item.basis,
              refer: item.refer,
              type: item.type,
              key: item.key,
              criteria: item.criteria,
              ruleType: 'normal',
            });
          }
        }
      });
      validateData[index].rules = JSON.parse(JSON.stringify(tempRule));
    }
  });
  return validateData;
};
/** ** EXPORTS DEFINE **** */
const validateId = (item, type) => {
  let id = 0;
  if (typeof item._id !== 'object' || item._id === null) {
    id = item._id;
  } else {
    id = (item[`${type}_id`]) || item[`${type}id`];
  }
  if (typeof id === 'string') {
    id = parseInt(id, 10);
  }
  return id;
};
export const validateData = (type, data, categories, attributes) => {
  const validateData = [];
  let tempData = {};
  if (validateKey[type]) {
    data.forEach((dataItem) => {
      const keys = Object.keys(dataItem);
      if (keys.length > 0) {
        if (checkException(keys, dataItem, type)) {
          let pushFlag = true;
          if (type === 'virtual') {
            pushFlag = handleExceptionVirtual(data, dataItem, categories);
            if (pushFlag) {
              tempData.rules = dataItem.rules || [];
              tempData._id = validateId(dataItem, 'category');
              tempData.name = dataItem.name || [];
              tempData.parent_id = dataItem.parent_id || null;
              tempData.parent_id = (tempData.parent_id === 'null') ? tempData.parent_id = null : tempData.parent_id;
              tempData.properties = getProperties(dataItem, 'virtual');
            }
          } else if (type === 'attributes') {
            const validateAttributes = handleExceptionAttribute(data, dataItem, attributes, categories);
            pushFlag = validateAttributes.passFlag;
            if (pushFlag) {
              tempData.rules = dataItem.rules || [];
              tempData.appear = validateAttributes.returnData || [];
              tempData._id = validateId(dataItem, 'attribute');
              tempData.name = dataItem.name || [];
              tempData.group_id = dataItem.groupid || dataItem.group_id || null;
              tempData.group_id = (tempData.group_id === 'null') ? tempData.group_id = null : tempData.group_id;
              tempData.properties = getProperties(dataItem, 'attributes');
            }
          } else {
            tempData = JSON.parse(JSON.stringify(dataItem));
          }
          if (pushFlag) validateData.push(JSON.parse(JSON.stringify(tempData)));
        }
      }
    });
  }
  return ruleValidate(validateData);
};

export const makeUploadData = (size, sourceData) => {
  const uploadData = [];
  if (size > LIMIT_SIZE) {
    const dataNum = Math.ceil(size / LIMIT_SIZE);
    const unitNum = sourceData.length / dataNum;
    for (let i = 0; i < dataNum; i++) {
      uploadData.push(sourceData.slice(i * unitNum, (i + 1) * unitNum - 1));
    }
  } else {
    uploadData.push(sourceData);
  }
  return uploadData;
};

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const checkJSONData = (data) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return 'err';
  }
};

export const convertArray = (data) => {
  let result = [];
  if (Array.isArray(data)) {
    result = data;
  } else {
    result.push(data);
  }
  return result;
};
