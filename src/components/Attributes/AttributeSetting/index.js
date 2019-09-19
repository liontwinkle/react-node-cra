import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CheckboxTree from 'react-checkbox-tree-enhanced';
import { withSnackbar } from 'notistack';

import { confirmMessage } from 'utils';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AttributeSettingAction from './AttributeSettingAction';
import './style.scss';

class AttributeSetting extends Component {
  state = {
    // selectedGroup: null,
    // newCategory: null,
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


  handleCheck = (checked) => {
    console.log('checked>>>', checked);
    const stateLen = this.state.checked.length;
    const updateLen = checked.length;
    let value = '';
    if (stateLen > updateLen) {
      value = this.state.checked[stateLen - 1];
    } else {
      value = checked[updateLen - 1];
    }
    if (this.checkGroupPermission(value)) {
      console.log('# DEBUG: UPDATE'); // fixme
      this.setState({ checked });
    } else {
      confirmMessage(this.props.enqueueSnackbar, 'This attribute is changeable on the group only', 'info');
    }
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
              expandClose: <FontAwesomeIcon className="rct-icon rct-icon-expand-close" icon="chevron-right" />,
              expandOpen: <FontAwesomeIcon className="rct-icon rct-icon-expand-open" icon="chevron-down" />,
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
