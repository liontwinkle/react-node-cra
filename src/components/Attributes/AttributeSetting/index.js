import React, { Component } from 'react';
import {
  CustomInput,
  CustomSection,
  CustomSelectWithLabel, IconButton,
} from 'components/elements';
import './style.scss';
import { Tooltip } from 'react-tippy';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

const attrKey = [
  {
    label: 'Color',
    key: 'color',
  },
  {
    label: 'Size',
    key: 'size',
  },
  {
    label: 'Type',
    key: 'type',
  },
];

// const attrGroup = [
//   { label: 'Color', key: 'color' },
//   { label: 'Size', key: 'size' },
//   { label: 'Type', key: 'type' },
// ];
//
const categories = [
  {
    label: 'VitaminA',
    key: 'vitamin_a',
  },
  {
    label: 'VitaminB',
    key: 'vitamin_b',
  },
  {
    label: 'VitaminC',
    key: 'vitamin_c',
  },
];

class AttributeSetting extends Component {
  state = {
    selectedKey: attrKey[0],
    categoryList: [
      {
        label: 'VitaminA',
        key: 'vitamin_a',
      },
    ],
    newCategory: {},
    keyTitle: '',
  };

  changeSelect = type => (value) => {
    this.setState({
      [type]: value,
    });
  };

  changeInput = type => (e) => {
    e.persist();
    this.setState({
      [type]: e.target.value,
    });
  };

  changeCategory = type => (value) => {
    if (type === 'new') {
      this.setState({
        newCategory: value,
      });
    } else {
      this.setState((prevState) => {
        const currentState = prevState;
        currentState.categoryList[type] = value;
        return {
          ...currentState,
        };
      });
    }
  };

  render() {
    const {
      selectedKey,
      keyTitle,
      categoryList,
      newCategory,
    } = this.state;
    return (
      <div className="mg-attr-setting-container d-flex">
        <CustomSection title="Setting Attribute" key="setting_attribute">
          <div className="mg-setting-section">
            <CustomSelectWithLabel
              label="Key"
              inline
              value={selectedKey}
              items={attrKey || []}
              onChange={this.changeSelect('selectedKey')}
              key={attrKey.key}
            />
          </div>
          <CustomInput
            label="Title"
            inline
            value={keyTitle}
            onChange={this.changeInput('keyTitle')}
            type="text"
          />
        </CustomSection>
        <CustomSection title="Associated Category" key="associated_category">
          {
            categoryList.map((listItem, key) => (
              <div className="mg-setting-section" key={parseInt(key, 10)}>
                <CustomSelectWithLabel
                  label={`Category ${parseInt([key], 10) + 1}`}
                  inline
                  value={categoryList[key]}
                  items={categories || []}
                  onChange={this.changeCategory(key)}
                />
                <Tooltip
                  title="Delete Category"
                  position="bottom"
                  arrow
                >
                  <IconButton>
                    <DeleteIcon style={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </div>
            ))
          }
          <div className="mg-setting-section">
            <CustomSelectWithLabel
              label="Category New"
              inline
              value={newCategory}
              items={categories || []}
              onChange={this.changeCategory('new')}
              key
            />
            <Tooltip
              title="Add New Category Association"
              position="bottom"
              arrow
            >
              <IconButton>
                <AddIcon style={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </div>
        </CustomSection>
      </div>
    );
  }
}

export default AttributeSetting;
