import React, { Component } from 'react';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CheckboxTree from 'react-checkbox-tree-enhanced';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import _union from 'lodash/union';
import _difference from 'lodash/difference';

import { confirmMessage, hasSubArray } from 'utils';
import { getAllChildData, getNewAppearData } from 'utils/attributeManagement';
import { fetchAttributes, updateAttribute } from 'redux/actions/attribute';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './style.scss';

class AttributeSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [],
      checked: [],
      expanded: [],
    };
  }

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
    this.setState({ checked: attribute.appear, categoryList: attribute.appear });
  };

  getSubCategory = (array, source) => {
    source.children.forEach((childItem) => {
      array.push(childItem.value);
      this.getSubCategory(array, childItem);
    });
  };

  updateList = (target) => {
    const targetCategory = this.props.categories.filter((item) => (item._id === target.value));
    const willCheckedCategory = getNewAppearData(this.props.categories, this.state.categoryList, targetCategory[0]);
    const allChildData = getAllChildData(this.props.categories, targetCategory[0]);
    willCheckedCategory.push(targetCategory[0]._id);
    return _union(willCheckedCategory, allChildData);
  };

  updateAttribute = (updateData, checked, id) => {
    const {
      enqueueSnackbar,
      updateAttribute,
      fetchAttributes,
    } = this.props;
    updateAttribute(id, { appear: updateData, checked })
      .then(() => {
        confirmMessage(enqueueSnackbar, 'Attribute has been updated successfully.', 'success');
        fetchAttributes(this.props.client.id, 'attributes');
      })
      .catch(() => {
        confirmMessage(enqueueSnackbar, 'Error in adding attribute.', 'error');
      });
  };

  checkedAction = (updateAppear) => {
    let returnId = null;
    const { attributes, attribute } = this.props;
    const unCheckedSibling = attributes.find((item) => (
      item.group_id === attribute.group_id
      && item._id !== attribute._id
      && !hasSubArray(item.appear, updateAppear)));
    if (!unCheckedSibling && attribute.group_id) {
      returnId = attributes.find((item) => (item._id === attribute.group_id))._id;
    } else {
      returnId = attribute._id;
    }
    return returnId;
  };

  handleCheck = (checked, targetNode) => {
    let updateData = [];
    let updateAttributeId = null;

    if (!this.props.isUpdating) {
      const updateAppear = this.updateList(targetNode);
      if (targetNode.checked) {
        updateAttributeId = this.checkedAction(updateAppear);
        updateData = _union(updateAppear, this.state.categoryList);
        this.setState({ categoryList: updateData, checked });
      } else {
        updateAttributeId = this.props.attribute._id;
        updateData = _difference(this.state.categoryList, updateAppear);
        this.setState({ categoryList: updateData, checked });
      }
      this.updateAttribute(updateData, targetNode.checked, updateAttributeId);
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
          options={{ suppressScrollX: true, minScrollbarLength: 50 }}
        >
          <CheckboxTree
            nodes={assoicationCategories}
            checked={this.state.checked}
            expanded={this.state.expanded}
            onCheck={this.handleCheck}
            onExpand={this.handleExpand}
            showNodeIcon={false}
            icons={{
              check: <FontAwesomeIcon className="rct-icon rct-icon-check" icon="check-square" />,
              uncheck: <FontAwesomeIcon className="rct-icon rct-icon-uncheck" icon={['far', 'square']} />,
              halfCheck: <FontAwesomeIcon className="rct-icon rct-icon-half-check" icon="check-square" />,
              expandClose: <FontAwesomeIcon className="rct-icon rct-icon-expand-close" icon={['far', 'plus-square']} />,
              expandOpen: <FontAwesomeIcon className="rct-icon rct-icon-expand-open" icon={['far', 'minus-square']} />,
              expandAll: <FontAwesomeIcon className="rct-icon rct-icon-expand-all" icon={['far', 'plus-square']} />,
              collapseAll: <FontAwesomeIcon
                className="rct-icon rct-icon-collapse-all"
                icon={['far', 'minus-square']}
              />,
              parentClose: <FontAwesomeIcon className="rct-icon rct-icon-parent-close" icon="folder" />,
              parentOpen: <FontAwesomeIcon className="rct-icon rct-icon-parent-open" icon="folder-open" />,
              leaf: <FontAwesomeIcon className="rct-icon rct-icon-leaf-close" icon="file" />,
            }}
          />
        </PerfectScrollbar>
      </div>
    );
  }
}

AttributeSetting.propTypes = {
  isUpdating: PropTypes.bool.isRequired,
  categories: PropTypes.array.isRequired,
  attributes: PropTypes.array.isRequired,
  assoicationCategories: PropTypes.array.isRequired,
  client: PropTypes.object.isRequired,
  attribute: PropTypes.object.isRequired,
  updateAttribute: PropTypes.func.isRequired,
  fetchAttributes: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  attribute: store.attributesData.attribute,
  attributes: store.attributesData.attributes,
  isUpdating: store.attributesData.isUpdating,
  assoicationCategories: store.categoriesData.associations,
  categories: store.categoriesData.categories,
  client: store.clientsData.client,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateAttribute,
  fetchAttributes,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(AttributeSetting));
