import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withSnackbar } from 'notistack';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';


import {
  CustomSection,
  CustomSelectWithLabel,
  IconButton,
} from 'components/elements';
import { confirmMessage } from 'utils';

import AttributeSettingAction from './AttributeSettingAction';

import './style.scss';

class AttributeSetting extends Component {
  state = {
    selectedGroup: null,
    categoryList: [],
    newCategory: null,
    categories: [],
  };

  componentDidMount() {
    const { attribute, categories } = this.props;
    this.updateState(categories, attribute.appear);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.attribute !== this.props.attribute) {
      this.updateState(this.props.categories, this.props.attribute.appear);
    }
  }

  updateState = (categories, list) => {
    const newCategories = [];
    const categoryList = [];
    const categoriesData = categories.map((categoryItem => ({
      label: categoryItem.name,
      key: categoryItem._id,
    })));

    categoriesData.forEach((item) => {
      if (list.filter(listItem => (listItem === item.key)).length === 0) {
        newCategories.push(item);
      } else {
        categoryList.push(item);
      }
    });

    this.setState({
      categories: newCategories,
      categoryList,
    });
  };

  changeCategory = type => (value) => {
    if (type === 'new') {
      this.setState({
        newCategory: value,
      });
    } else if (this.checkGorupPermission(type)) {
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
    } else {
      confirmMessage(
        this.props.enqueueSnackbar,
        'This attribute could not be changed since the group is selected.',
        'info',
      );
    }
  };

  checkGorupPermission= (type) => {
    const group = this.props.nodes.filter(nodeItem => (nodeItem.item._id === this.props.attribute.groupId));
    console.log('##DEBUG:', group);// fixme
    let updateFlag = true;
    if (group.length > 0) {
      updateFlag = !(group[0].item.appear.find(arrItem => (arrItem === this.state.categoryList[type].key)));
    }
    console.log('##DEBUG FLAG:', updateFlag);// fixme
    return updateFlag;
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
      confirmMessage(this.props.enqueueSnackbar, 'There is no any updated categories.', 'info');
    }
  };

  deleteCategory = (key) => {
    if (this.checkGorupPermission(key)) {
      this.setState(prevState => (
        {
          categoryList: prevState.categoryList.filter((item, keyItem) => (keyItem !== key)),
          categories: [...prevState.categories, prevState.categoryList[key]],
          newCategory: null,
        }
      ));
    } else {
      confirmMessage(this.props.enqueueSnackbar, 'There is no any updated categories.', 'info');
    }
  };

  render() {
    const {
      categoryList,
      newCategory,
      categories,
    } = this.state;

    const {
      attribute,
    } = this.props;

    return (
      <div className="mg-attr-setting-container d-flex">
        <PerfectScrollbar
          options={{
            suppressScrollX: true,
            minScrollbarLength: 50,
          }}
        >
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
        </PerfectScrollbar>
        <AttributeSettingAction attribute={attribute} categoryList={categoryList} />
      </div>
    );
  }
}

AttributeSetting.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  attribute: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired,
};

const mapStateToProps = store => ({
  attribute: store.attributesData.attribute,
  nodes: store.attributesData.nodes,
  categories: store.categoriesData.categories,
});
export default connect(mapStateToProps)(withSnackbar(AttributeSetting));
