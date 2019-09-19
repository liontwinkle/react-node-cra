import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CheckboxTree from 'react-checkbox-tree-enhanced';
import { withSnackbar } from 'notistack';

import { confirmMessage } from 'utils';
import _ from 'lodash';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import AttributeSettingAction from './AttributeSettingAction';
import './style.scss';

class AttributeSetting extends Component {
  state = {
    // selectedGroup: null,
    // newCategory: null,
    categoryList: [],
    checked: [],
    expanded: [],
  };

  componentDidMount() {
    // const { attribute, categories } = this.props;
  }

  componentDidUpdate() {
    // if (prevProps.attribute !== this.props.attribute) {
    // }
  }

  checkGroupPermission= (value) => {
    const group = this.props.nodes.filter(nodeItem => (nodeItem.item._id === this.props.attribute.groupId));
    let updateFlag = true;
    if (group.length > 0) {
      updateFlag = !(group[0].item.appear.find(arrItem => (arrItem === value)));
    }
    return updateFlag;
  };

  getSubCategory = (array, source) => {
    source.children.forEach((childItem) => {
      array.push(childItem.value);
      this.getSubCategory(array, childItem);
    });
  };

  updateList = (target) => {
    const updateCategory = [];
    updateCategory.push(target.value);
    this.getSubCategory(updateCategory, target);
    console.log(updateCategory);// fixme
    return updateCategory;
  };

  handleCheck = (checked, targetNode) => {
    if (this.checkGroupPermission(targetNode.value)) {
      const updateData = this.updateList(targetNode);
      if (targetNode.checked) {
        this.setState(prevState => ({
          categoryList: _.union(updateData, prevState.categoryList),
          checked,
        }));
      } else {
        this.setState(prevState => ({
          categoryList: _.difference(prevState.categoryList, updateData),
          checked,
        }));
      }
    } else {
      confirmMessage(this.props.enqueueSnackbar, 'This attribute is changeable on the group only', 'info');
    }
    console.log('update State>>>', this.state.categoryList); // fixme
  };

  handleExpand = (expanded) => {
    console.log('expand>>>>>', expanded);
    this.setState({ expanded });
  };

  render() {
    const {
      categoryList,
    } = this.state;

    const {
      attribute,
      assoicationCategories,
    } = this.props;

    return (
      <div className="mg-attr-setting-container d-flex">
        <PerfectScrollbar
          options={{
            suppressScrollX: true,
            minScrollbarLength: 50,
          }}
        >
          <CheckboxTree
            nodes={assoicationCategories}
            checked={this.state.checked}
            expanded={this.state.expanded}
            onCheck={this.handleCheck}
            onExpand={this.handleExpand}
            nativeCheckboxes
            showNodeIcon={false}
            icons={{
              expandClose: <AddIcon />,
              expandOpen: <RemoveIcon />,
            }}
          />
        </PerfectScrollbar>
        <AttributeSettingAction attribute={attribute} categoryList={categoryList} />
      </div>
    );
  }
}

AttributeSetting.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  attribute: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  assoicationCategories: PropTypes.array.isRequired,
};

const mapStateToProps = store => ({
  attribute: store.attributesData.attribute,
  nodes: store.attributesData.nodes,
  assoicationCategories: store.categoriesData.associations,
  categories: store.categoriesData.categories,
});
export default connect(mapStateToProps)(withSnackbar(AttributeSetting));
