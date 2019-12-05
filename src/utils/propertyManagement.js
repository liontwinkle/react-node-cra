import React from 'react';
import { Tooltip } from 'react-tippy';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

import {
  CustomArray,
  CustomInput, CustomRichText,
  CustomSelectWithLabel,
  CustomText,
  CustomToggle,
  IconButton,
} from 'components/elements';

import CustomMonaco from 'components/elements/CustomMonaco';

import { propertyTypes } from './constants';
import { sortByOrder } from './index';
import CustomImageDisplay from '../components/elements/CustomImageDisplay';

/** utils * */
const createValuefromtemplate = (template, state, propertyFields) => {
  let string = template;
  const regex = /\$\w+/g;
  const result = regex[Symbol.matchAll](string);
  const matchedArray = Array.from(result, (x) => x[0]);
  matchedArray.forEach((resultItem) => {
    const keyValue = resultItem.substr(1, resultItem.length - 1);
    const property = propertyFields.find((propertyItem) => (propertyItem.key === keyValue));
    let expectedValue = '';
    if (property) {
      if (property.template && property.template !== '') {
        expectedValue = createValuefromtemplate(property.template, state, propertyFields);
      } else if (state.properties[keyValue]) {
        expectedValue = state.properties[keyValue];
      } else {
        expectedValue = property.default || '';
      }
    }
    const re = new RegExp(`\\${resultItem}\\b`, 'g');
    string = string.replace(re, expectedValue);
  });
  return string;
};

export const getRootParent = (Items, currentItem, type) => {
  let rootParent = {};
  if (!currentItem[type]) {
    rootParent = currentItem;
    return rootParent;
  }
  const parentItem = Items.find((node) => (node._id === currentItem[type]));
  return getRootParent(Items, parentItem, type);
};
const getStringTypeValue = (property, state, propertyFields, template) => {
  let value = '';
  let templateFlag = (template[property.key] && template[property.key] !== '' && template[property.key] !== 'null');
  if (property.template && property.template !== '') {
    value = createValuefromtemplate(property.template, state, propertyFields);
    templateFlag = true;
  } else if (template[property.key] && template[property.key] !== '') {
    value = createValuefromtemplate(template[property.key], state, propertyFields);
    templateFlag = true;
  } else if (
    property.default && state.properties[property.key] === undefined) {
    value = createValuefromtemplate(property.default, state, propertyFields);
  } else {
    value = createValuefromtemplate(state.properties[property.key], state, propertyFields);
  }
  if (property.propertyType === 'urlpath' && value) {
    value = value.replace('_', '-');
    value = value.replace(' ', '-');
  }
  value = (value === null) ? '' : value;
  return {
    value,
    templateFlag,
  };
};

/** exports * */
export const updateProperties = (propertyFields, properties) => {
  const nextProperties = {};
  propertyFields.forEach((item, key) => {
    if (properties[item.key]) {
      if (properties[item.key] === item.default) {
        nextProperties[item.key] = propertyFields[key].default;
      } else if (properties[item.key] === (item.default === 'true')) {
        nextProperties[item.key] = (propertyFields[key].default === true);
      } else {
        nextProperties[item.key] = properties[item.key];
      }
    }
  });
  return nextProperties;
};

export const sectionRender = (
  propertyFields, template, state, section,
  changeInput, changeSelect,
  handleSelItemToggle, handleEditImage, toggleSwitch, changeMonaco,
) => {
  const res = [];
  let fields = propertyFields;
  fields = propertyFields.sort(sortByOrder);
  fields.forEach((p) => {
    if ((section && (p.section === section.key))
      || ((section === null) && (p.section === null))
      || ((section === '') && (p.section === ''))) {
      if ((p.propertyType === 'string') || (p.propertyType === 'urlpath')) {
        const { value, templateFlag } = getStringTypeValue(p, state, fields, template);
        res.push(
          <CustomInput
            label={p.label}
            inline
            value={value}
            onChange={templateFlag ? () => {} : changeInput(p.key)}
            type="text"
            key={p.key}
          />,
        );
      } else if (p.propertyType === 'select') {
        const item = (p.items) ? p.items.filter((item) => (item.key === state.properties[p.key]))[0] || {} : {};
        res.push(
          <div className="mg-select-section" key={p.key}>
            <CustomSelectWithLabel
              label={p.label}
              inline
              value={item}
              items={p.items || []}
              onChange={changeSelect(p.key)}
              key={p.key}
            />
            <Tooltip
              title="Edit Select Items"
              position="bottom"
              arrow
            >
              <IconButton
                disabled={state.isUpdating}
                onClick={() => handleSelItemToggle('isOpenSelItemEditModal')(p.key)}
              >
                <EditIcon style={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Add Select Items"
              position="bottom"
              arrow
            >
              <IconButton
                disabled={state.isUpdating}
                onClick={() => handleSelItemToggle('isOpenSelItemModal')(p.key)}
              >
                <AddIcon style={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </div>,
        );
      } else if (p.propertyType === 'toggle') {
        let value = true;
        if (state.properties[p.key] === undefined) {
          value = (p.default === 'true');
        } else {
          value = (typeof state.properties[p.key] === 'string')
            ? (state.properties[p.key] === 'true') : state.properties[p.key];
        }
        value = (typeof value === 'number') ? (value >= 1) : value;
        res.push(
          <CustomToggle
            label={p.label}
            value={value}
            onToggle={toggleSwitch(p.key)}
            key={p.key}
          />,
        );
      } else if (p.propertyType === 'text') {
        const { value, templateFlag } = getStringTypeValue(p, state, propertyFields, template);
        res.push(
          <CustomText
            label={p.label}
            inline
            value={value}
            onChange={templateFlag ? () => {} : changeInput(p.key)}
            key={p.key}
          />,
        );
      } else if (p.propertyType === 'array') {
        let value = '';
        if (state.properties[p.key] === null) {
          value = p.default || '';
        } else if (Array.isArray(state.properties[p.key])) {
          value = JSON.stringify(state.properties[p.key]);
        } else {
          value = state.properties[p.key];
        }
        res.push(
          <CustomArray
            label={p.label}
            inline
            value={value}
            onChange={changeInput(p.key)}
            key={p.key}
          />,
        );
      } else if (p.propertyType === 'monaco') {
        const { value, templateFlag } = getStringTypeValue(p, state, propertyFields, template);
        res.push(
          <CustomMonaco
            label={p.label}
            inline
            value={value}
            key={p.key}
            onChange={templateFlag ? () => {} : changeMonaco(p.key)}
          />,
        );
      } else if (p.propertyType === 'richtext') {
        const { value, templateFlag } = getStringTypeValue(p, state, propertyFields, template);
        res.push(
          templateFlag
            ? (
              <CustomText
                label={p.label}
                inline
                value={value}
                onChange={() => {}}
                key={p.key}
              />
            ) : (
              <CustomRichText
                id={p.key}
                label={p.label}
                inline
                onChange={changeMonaco(p.key)}
                value={value}
                key={p.key}
              />
            ),
        );
      } else if (p.propertyType === 'image') {
        const image = (state.properties[p.key]) ? state.properties[p.key] : p.image;
        res.push(
          <CustomImageDisplay
            id={p.key}
            label={p.label}
            inline
            key={p.key}
            value={image.path !== '' ? image.path : null}
            name={image ? image.name : null}
            handleEditImage={() => handleEditImage(p.key)}
          />,
        );
      }
    }
  });
  return res;
};

export const getTableData = (sections, propertyFields, order) => {
  const columnData = {
    columns: [
      { title: 'Key', field: 'key' },
      { title: 'Label', field: 'label' },
      { title: 'Default', field: 'default' },
      {
        title: 'Type',
        field: 'propertyType',
        lookup: propertyTypes,
      },
      { title: 'Template', field: 'template' },
      { title: 'Order', field: 'order' },
      {
        title: 'Section',
        field: 'section',
        lookup: sections,
      },
    ],
    data: propertyFields,
  };
  if (order.index >= 0) {
    columnData.columns[order.index].defaultSort = order.direction;
  }
  return columnData;
};

export const checkPathValidate = (propertyFields, propertyFieldData) => {
  let result = true;
  const key = propertyFieldData.propertyType.key || propertyFieldData.propertyType;
  if (key === 'urlpath') {
    const regex = /(\/[a-z0-9\-_].*)/g;
    if (propertyFieldData.default && propertyFieldData.default !== '') {
      if (!regex.test(propertyFieldData.default)) {
        result = false;
      }
    }
    if (propertyFieldData.template && propertyFieldData.template !== '') {
      if (!regex.test(propertyFieldData.template)) {
        result = false;
      }
    }
  }
  return result;
};

export const setDefault = (properties, fields) => {
  const tempProperties = JSON.parse(JSON.stringify(properties));
  let errMsg = '';
  fields.forEach((item) => {
    if (tempProperties[item.key] === undefined) {
      if (item.template) {
        tempProperties[item.key] = item.template;
      } else if (item.default) {
        tempProperties[item.key] = item.default;
      } else if (item.propertyType === 'toggle') {
        tempProperties[item.key] = false;
      } else if (item.propertyType === 'array') {
        tempProperties[item.key] = null;
      } else if (item.propertyType === 'image') {
        tempProperties[item.key] = item.image;
      } else {
        tempProperties[item.key] = '';
      }
    } else if (item.propertyType === 'array') {
      try {
        if (tempProperties[item.key] === '') {
          tempProperties[item.key] = null;
        } else {
          tempProperties[item.key] = JSON.parse(tempProperties[item.key]);
        }
      } catch (e) {
        errMsg = `Array input is wrong at the ${item.key} field.`;
      }
    } else if (item.propertyType === 'urlpath') {
      const regex = /(\/[a-z0-9\-_].*)/g;
      if (!regex.test(tempProperties[item.key])) {
        errMsg = `URL Path's format is wrong at the ${item.key} field.`;
      }
    }
  });
  return {
    tempProperties,
    errMsg,
  };
};

export const makeUpdatedData = (properties, fields, sections) => {
  let currentSection = JSON.parse(JSON.stringify(sections));
  const result = {};
  fields.forEach((item) => {
    currentSection = currentSection.filter((sectionItem) => (sectionItem.key !== item.section));
    if (!result[item.section]) {
      result[item.section] = {};
      result[item.section][item.key] = properties[item.key];
    } else {
      result[item.section][item.key] = properties[item.key];
    }
  });
  currentSection.forEach(((leftSectionItem) => {
    result[leftSectionItem.key] = {};
  }));

  return result;
};

export const getFilterItem = (srcArray, searchkey) => {
  const filtered = [];
  srcArray.forEach((item) => {
    if (item.indexOf(searchkey) > -1) {
      filtered.push(item);
    }
  });
  return filtered;
};

const checkTemplating = (string, propertyFields, type) => {
  let invalidData = '';
  const regex = /\$\w+/g;
  const result = regex[Symbol.matchAll](string);
  const matchedArray = Array.from(result, (x) => x[0]);
  if (type === 'template' && matchedArray.length === 0 && string !== '') {
    invalidData = 'The template should include some keys';
  } else {
    matchedArray.forEach((item) => {
      const keyValue = item.substr(1, item.length - 1);
      const property = propertyFields.find((propertyItem) => (propertyItem.key === keyValue));
      if (!property) {
        invalidData = (invalidData === '') ? item : `${invalidData},${item}`;
      }
    });
  }
  return invalidData;
};

export const checkTemplate = (propertyFields, propertyFieldData) => {
  let invalidData = '';
  if (propertyFieldData.template && propertyFieldData.template !== '') {
    invalidData = checkTemplating(propertyFieldData.template, propertyFields, 'template');
  }

  if (propertyFieldData.default && propertyFieldData.default !== '') {
    invalidData = checkTemplating(propertyFieldData.default, propertyFields, 'default');
  }
  return invalidData;
};

export const validateTemplate = (propertyFields, data) => {
  const errKey = [];
  const templateData = data.template;
  const keys = Object.keys(templateData);
  keys.forEach((keyItem) => {
    if (checkTemplating(templateData[keyItem], propertyFields, 'template') !== '') {
      errKey.push(keyItem);
    }
  });
  return errKey;
};
