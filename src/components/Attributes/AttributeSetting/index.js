import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CheckboxTree from 'react-checkbox-tree-enhanced';
import { withSnackbar } from 'notistack';
import _union from 'lodash/union';
import _difference from 'lodash/difference';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import { confirmMessage } from 'utils';
import { fetchAttributes, updateAttribute } from 'redux/actions/attribute';

import './style.scss';

class AttributeSetting extends Component {
  state = {
    categoryList: [],
    checked: [],
    expanded: [],
  };

  componentDidMount() {
    const { attribute } = this.props;
    this.setChecked(attribute);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.attribute !== this.props.attribute) {
      this.setChecked(this.props.attribute);
    }
  }

  setChecked = (attribute) => {
    this.setState({
      checked: attribute.appear,
      categoryList: attribute.appear,
    });
  };

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
    return updateCategory;
  };

  updateAttribute = (updateData) => {
    const {
      attribute,
      enqueueSnackbar,
      updateAttribute,
      fetchAttributes,
    } = this.props;

    updateAttribute(attribute._id, { appear: updateData })
      .then(() => {
        confirmMessage(enqueueSnackbar, 'Attribute has been updated successfully.', 'success');
        fetchAttributes(this.props.client.id, 'attributes');
      })
      .catch(() => {
        confirmMessage(enqueueSnackbar, 'Error in adding attribute.', 'error');
      });
  };

  handleCheck = (checked, targetNode) => {
    if (this.checkGroupPermission(targetNode.value)) {
      let updateData = [];
      if (targetNode.checked) {
        updateData = _union(this.updateList(targetNode), this.state.categoryList);
        this.setState({
          categoryList: updateData,
          checked,
        });
      } else {
        updateData = _difference(this.state.categoryList, this.updateList(targetNode));
        this.setState({
          categoryList: updateData,
          checked,
        });
      }
      this.updateAttribute(updateData);
    } else {
      confirmMessage(this.props.enqueueSnackbar, 'This attribute is changeable on the group only', 'info');
    }
  };

  handleExpand = (expanded) => {
    this.setState({ expanded });
  };

  render() {
    const {
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
      </div>
    );
  }
}

AttributeSetting.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  attribute: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  assoicationCategories: PropTypes.array.isRequired,
  client: PropTypes.object.isRequired,
  updateAttribute: PropTypes.func.isRequired,
  fetchAttributes: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  attribute: store.attributesData.attribute,
  nodes: store.attributesData.nodes,
  assoicationCategories: store.categoriesData.associations,
  categories: store.categoriesData.categories,
  client: store.clientsData.client,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateAttribute,
  fetchAttributes,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(AttributeSetting));
