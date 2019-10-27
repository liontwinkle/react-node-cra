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

/** utils * */
const createValuefromtemplate = (template, state, propertyFields) => {
  let string = template;
  const regex = /\$\w+/g;
  const result = regex[Symbol.matchAll](string);
  const matchedArray = Array.from(result, x => x[0]);
  matchedArray.forEach((resultItem) => {
    const keyValue = resultItem.substr(1, resultItem.length - 1);
    const property = propertyFields.find(propertyItem => (propertyItem.key === keyValue));
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

const getStringTypeValue = (property, state, propertyFields) => {
  let value = '';
  let templateFlag = false;
  if (property.template && property.template !== '') {
    value = createValuefromtemplate(property.template, state, propertyFields);
    templateFlag = true;
  } else if (
    property.default
    && (
      state.properties[property.key] === undefined
    || state.properties[property.key] === '')) {
    value = createValuefromtemplate(property.default, state, propertyFields);
  } else {
    value = createValuefromtemplate(state.properties[property.key], state, propertyFields);
  }
  if (property.propertyType === 'urlpath') {
    value = value.replace('_', '-');
    value = value.replace(' ', '-');
  }
  return {
    value,
    templateFlag,
  };
};

/** exports * */
export const initProperties = (properties, matchProperties) => {
  const updateProperties = {};
  const keys = Object.keys(properties);
  const propKeys = Object.keys(matchProperties);

  keys.forEach((key) => {
    if (propKeys.indexOf(key) > -1) {
      updateProperties[key] = properties[key];
    }
  });
  return updateProperties;
};

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
  propertyFields, state, section,
  changeInput, changeSelect, changeArrayInput,
  handleSelItemToggle, toggleSwitch, changeMonaco,
) => {
  const res = [];
  let fields = propertyFields;
  fields = propertyFields.sort(sortByOrder);
  fields.forEach((p) => {
    if ((section && (p.section === section.key))
      || ((section === null) && (p.section === null))
      || ((section === '') && (p.section === ''))) {
      if ((p.propertyType === 'string') || (p.propertyType === 'urlpath')) {
        const { value, templateFlag } = getStringTypeValue(p, state, fields);
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
        const item = (p.items) ? p.items.filter(item => (item.key === state.properties[p.key]))[0] || {} : {};
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
          value = state.properties[p.key];
        }
        res.push(
          <CustomToggle
            label={p.label}
            value={value}
            onToggle={toggleSwitch(p.key)}
            key={p.key}
          />,
        );
      } else if (p.propertyType === 'text') {
        const { value, templateFlag } = getStringTypeValue(p, state, propertyFields);
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
        if (state.properties[p.key] === undefined) {
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
            onChange={changeArrayInput(p.key)}
            key={p.key}
          />,
        );
      } else if (p.propertyType === 'monaco') {
        const { value, templateFlag } = getStringTypeValue(p, state, propertyFields);
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
        const { value, templateFlag } = getStringTypeValue(p, state, propertyFields);
        res.push(
          <CustomRichText
            id={p.key}
            label={p.label}
            inline
            onChange={templateFlag ? () => {} : changeMonaco(p.key)}
            value={value}
            key={p.key}
          />,
        );
      }
    }
  });
  return res;
};

export const getTableData = (sections, propertyFields) => ({
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
});

export const setDefault = (properties, fields) => {
  const tempProperties = JSON.parse(JSON.stringify(properties));
  tempProperties.chkFlag = true;
  fields.forEach((item) => {
    if (tempProperties[item.key] === undefined) {
      if (item.template) {
        tempProperties[item.key] = item.template;
      } else if (item.default) {
        tempProperties[item.key] = item.default;
      } else {
        tempProperties[item.key] = null;
      }
    } else if (item.propertyType === 'array') {
      let chkFlag = true;
      try {
        tempProperties[item.key] = JSON.parse(tempProperties[item.key]);
      } catch (e) {
        chkFlag = false;
      }
      tempProperties.chkFlag = chkFlag;
    }
  });
  return tempProperties;
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

export const checkTemplate = (propertyFields, propertyFieldData) => {
  let invalidData = '';
  if (propertyFieldData.template && propertyFieldData.template !== '') {
    const string = propertyFieldData.template;
    const regex = /\$\w+/g;
    const result = regex[Symbol.matchAll](string);
    const matchedArray = Array.from(result, x => x[0]);
    matchedArray.forEach((item) => {
      const keyValue = item.substr(1, item.length - 1);
      const property = propertyFields.find(propertyItem => (propertyItem.key === keyValue));
      if (!property) {
        invalidData = (invalidData === '') ? item : `${invalidData},${item}`;
      }
    });
  }

  if (propertyFieldData.default && propertyFieldData.default !== '') {
    const string = propertyFieldData.default;
    const regex = /\$\w+/g;
    const result = regex[Symbol.matchAll](string);
    const matchedArray = Array.from(result, x => x[0]);
    matchedArray.forEach((item) => {
      const keyValue = item.substr(1, item.length - 1);
      const property = propertyFields.find(propertyItem => (propertyItem.key === keyValue));
      if (!property) {
        invalidData = (invalidData === '') ? item : `${invalidData},${item}`;
      }
    });
  }
  return invalidData;
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
