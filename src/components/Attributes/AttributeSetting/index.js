import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  CustomInput,
  CustomSection,
  CustomSelectWithLabel,
  IconButton,
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

const attrGroup = [
  { label: 'Color', key: 'color' },
  { label: 'Size', key: 'size' },
  { label: 'Type', key: 'type' },
];


class AttributeSetting extends Component {
  state = {
    selectedKey: attrKey[0],
    selectedGroup: attrGroup[0],
    categoryList: [
      { label: 'VitaminA', key: 'vitamin_a' },
    ],
    categories: [
      { label: 'VitaminA', key: 'vitamin_a' },
      { label: 'VitaminB', key: 'vitamin_b' },
      { label: 'VitaminC', key: 'vitamin_c' },
    ],
    newCategory: null,
    keyTitle: '',
    groupTitle: '',
  };

  componentDidMount() {
    const newCategories = [];
    this.state.categories.forEach((item) => {
      if (this.state.categoryList.filter(listItem => (listItem.key === item.key)).length === 0) {
        newCategories.push(item);
      }
    });
    this.setState({
      categories: newCategories,
    });
  }

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
        const tempCategories = [...currentState.categories, currentState.categoryList[type]];
        const changeCategories = tempCategories.filter(item => (item !== value));
        currentState.categoryList[type] = value;
        currentState.categories = changeCategories;
        return {
          ...currentState,
        };
      });
    }
  };

  addCategory = () => {
    if (this.state.newCategory) {
      this.setState(prevState => (
        {
          categoryList: [...prevState.categoryList, prevState.newCategory],
          categories: prevState.categories.filter(item => (item !== prevState.newCategory)),
          newCategory: null,
        }
      ));
    } else {
      console.log('#DEBUG: Create New Catogry.');// fixme
    }
  };

  deleteCategory = (key) => {
    console.log('DEBUG: ', key);// fixme
    console.log('DEBUG ARRAY: ###', this.state.categoryList);// fixme
    this.setState(prevState => (
      {
        categoryList: prevState.categoryList.filter((item, keyItem) => (keyItem !== key)),
        categories: [...prevState.categories, prevState.categoryList[key]],
        newCategory: null,
      }
    ));
  };

  render() {
    const {
      selectedKey,
      selectedGroup,
      keyTitle,
      groupTitle,
      categoryList,
      newCategory,
      categories,
    } = this.state;

    const {
      groupFg,
    } = this.props;
    return (
      <div className="mg-attr-setting-container d-flex">
        <CustomSection title="Setting Attribute" key="setting_attribute">
          {
            groupFg
              ? (
                <Fragment>
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
                </Fragment>
              )
              : (
                <Fragment>
                  <div className="mg-setting-section">
                    <CustomSelectWithLabel
                      label="Group"
                      inline
                      value={selectedGroup}
                      items={attrGroup || []}
                      onChange={this.changeSelect('selectedGroup')}
                      key={attrGroup.key}
                    />
                  </div>
                  <CustomInput
                    label="Title"
                    inline
                    value={groupTitle}
                    onChange={this.changeInput('keyTitle')}
                    type="text"
                  />
                </Fragment>
              )
          }
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
                  <IconButton onClick={() => this.deleteCategory(parseInt(key, 10))}>
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
              <IconButton onClick={this.addCategory}>
                <AddIcon style={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </div>
        </CustomSection>
      </div>
    );
  }
}

AttributeSetting.propTypes = {
  groupFg: PropTypes.bool.isRequired,
};
export default AttributeSetting;
