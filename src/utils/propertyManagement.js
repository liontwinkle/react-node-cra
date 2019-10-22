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
import { propertyTypes } from './constants';
import CustomMonaco from '../components/elements/CustomMonaco';

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
    if (properties[item.key] === item.default) {
      nextProperties[item.key] = propertyFields[key].default;
    } else if (properties[item.key] === (item.default === 'true')) {
      nextProperties[item.key] = (propertyFields[key].default === true);
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
  propertyFields.forEach((p) => {
    if ((section && (p.section === section.key))
      || ((section === null) && (p.section === null))) {
      let value = '';
      if (p.propertyType === 'string') {
        if (state.properties[p.key] === undefined) {
          value = p.default || 'default';
        } else {
          value = state.properties[p.key];
        }
        res.push(
          <CustomInput
            label={p.label}
            inline
            value={value}
            onChange={changeInput(p.key)}
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
        let value = '';
        if (state.properties[p.key] === undefined) {
          value = p.default || 'default';
        } else {
          value = state.properties[p.key];
        }
        res.push(
          <CustomText
            label={p.label}
            inline
            value={value}
            onChange={changeInput(p.key)}
            key={p.key}
          />,
        );
      } else if (p.propertyType === 'array') {
        let value = '';
        if (state.properties[p.key] === undefined) {
          value = p.default || 'default';
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
        let value = '';
        if (state.properties[p.key] === undefined) {
          value = p.default || 'default';
        } else {
          value = state.properties[p.key];
        }
        res.push(
          <CustomMonaco
            label={p.label}
            inline
            value={value}
            key={p.key}
            onChange={changeMonaco(p.key)}
          />,
        );
      } else if (p.propertyType === 'richtext') {
        let value = '';
        if (state.properties[p.key] === undefined) {
          value = p.default || 'default';
        } else {
          value = state.properties[p.key];
        }
        res.push(
          <CustomRichText
            id={p.key}
            label={p.label}
            inline
            onChange={changeMonaco(p.key)}
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
    {
      title: 'Section',
      field: 'section',
      lookup: sections,
    },
  ],
  data: propertyFields,
});

export const setDefault = (properties, fields) => {
  const tempProperties = properties;
  tempProperties.chkFlag = true;
  fields.forEach((item) => {
    if (
      tempProperties[item.key] === item.default
      || tempProperties[item.key] === (item.default === 'true')
      || tempProperties[item.key] === ''
      || tempProperties[item.key] === undefined
    ) {
      delete tempProperties[item.key];
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
