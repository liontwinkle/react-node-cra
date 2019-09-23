import { Tooltip } from 'react-tippy';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import {
  CustomArray,
  CustomInput,
  CustomSelectWithLabel,
  CustomText,
  CustomToggle,
  IconButton,
} from 'components/elements';

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
  handleSelItemToggle, toggleSwitch,
) => {
  const res = [];
  propertyFields.forEach((p) => {
    if ((section && (p.section === section.key))
      || ((section === null) && (p.section === null))) {
      let value = '';
      if (p.propertyType === 'string') {
        if (state.properties[p.key] === undefined) {
          value = p.default;
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
          value = p.default;
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
          value = p.default;
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
      }
    }
  });
  return res;
};
