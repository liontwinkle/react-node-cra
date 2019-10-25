/* eslint-disable no-await-in-loop */

import _difference from 'lodash/difference';
import _union from 'lodash/union';

/** ** CONSTANT DEFINE **** */

const LIMIT_SIZE = 100 * 1024 * 1024;

const validateKey = {
  virtual: ['categoryid', 'name'],
  attributes: ['attributeid', 'name'],
  native: ['parentId', 'name'],
  products: [],
};


/** ** UTILS DEFINE **** */

const checkException = (keys, dataItem, type) => {
  let passFlag = true;
  validateKey[type].forEach((validateItem) => {
    if (keys.findIndex(item => (item === validateItem)) === -1) {
      if (validateItem === 'categoryid' || validateItem === 'attributeid') {
        if (keys.findIndex(item => (item === '_id')) === -1) {
          passFlag = false;
        }
      } else {
        passFlag = false;
      }
    }
  });
  return passFlag;
};


const handleExceptionVirtual = (newData, dataItem, categories) => {
  let passFlag = true;
  const parentId = dataItem.parent_id || dataItem.parentid || '';
  if (parentId !== '' && categories.findIndex(item => (item.categoryId === parentId)) === -1) {
    if (newData.findIndex(newItem => (
      newItem.categoryid === parentId || newItem._id === parentId
    ) === -1)) {
      passFlag = false;
    }
  }
  return passFlag;
};

const handleExceptionAttribute = (newData, dataItem, attributes, categories) => {
  let passFlag = true;
  const deletedData = [];
  const recvGroupId = dataItem.groupid || dataItem.group_id || '';
  const groupIds = attributes.filter((attributeItem => (attributeItem.groupId === '')));
  const groupItem = groupIds.filter(item => (item.attributeId === recvGroupId));
  let groupData = [];
  if (recvGroupId !== '' && groupItem.length === 0) {
    if (newData.findIndex(newItem => (
      newItem.attributeid === recvGroupId || newItem._id === recvGroupId
    ) === -1)) {
      passFlag = false;
    }
  } else {
    const appearData = (groupItem.length > 0) ? groupItem[0].appear : [];
    groupData = (recvGroupId === '') ? [] : appearData;
  }
  if (dataItem.appear) {
    dataItem.appear.forEach((appearItem) => {
      if (categories.findIndex(categoryItem => categoryItem.categoryId === appearItem) === -1) {
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


/** ** EXPORTS DEFINE **** */

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
              tempData.categoryId = (dataItem.categoryid && typeof dataItem.categoryid === 'string')
                ? parseInt(dataItem.categoryid, 10) : dataItem.categoryid || dataItem._id;
              tempData.name = dataItem.name || [];
              tempData.parentId = dataItem.parent_id || '';
            }
          } else if (type === 'attributes') {
            const validateData = handleExceptionAttribute(data, dataItem, attributes, categories);
            pushFlag = validateData.passFlag;
            if (pushFlag) {
              tempData.rules = dataItem.rules || [];
              tempData.appear = validateData.returnData || [];
              tempData.attributeId = (dataItem.attributeid && typeof dataItem.attributeid === 'string')
                ? parseInt(dataItem.attributeid, 10) : dataItem.attributeid || dataItem._id;
              tempData.name = dataItem.name || [];
              tempData.groupId = dataItem.groupid || dataItem.group_id || '';
            }
          } else {
            tempData = JSON.parse(JSON.stringify(dataItem));
          }
          if (pushFlag) validateData.push(tempData);
        }
      }
    });
  }
  return validateData;
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