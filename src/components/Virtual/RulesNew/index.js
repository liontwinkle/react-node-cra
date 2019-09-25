import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import PerfectScrollbar from 'react-perfect-scrollbar';

import _difference from 'lodash/difference';
import _union from 'lodash/union';

import { fetchProducts } from 'redux/actions/products';
import { setPrefilterData } from 'redux/actions/categories';
import { confirmMessage, getRules, getPreFilterData } from 'utils/index';
import Loader from 'components/Loader/index';

import { setUnionRules } from 'utils/ruleManagement';
import RulesTable from './RulesTable/index';
import RulesAction from './RulesAction/index';


import './style.scss';

class NewRules extends Component {
  state = {
    newRules: [],
    editRules: [],
    fetchingFlag: true,
  };

  componentDidMount() {
    this.setState({
      fetchingFlag: true,
    });
    if (this.props.products.length === 0) {
      this.props.fetchProducts()
        .then(() => {
          this.setMap(this.props.category);
          this.FilterProducts();
          confirmMessage(this.props.enqueueSnackbar, 'Success to collect the Rule keys.', 'success');
        })
        .catch(() => {
          confirmMessage(this.props.enqueueSnackbar, 'Error to collect the Rule Keys.', 'error');
        });
    } else {
      this.setMap(this.props.category);
      this.FilterProducts();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.category && (this.props.category !== prevProps.category)) {
      this.setMap(this.props.category);
    }
    if (this.props.products.length > 0 && (this.props.products !== prevProps.products)) {
      this.FilterProducts();
    }
  }

  FilterProducts = () => {
    const {
      attributes,
      category,
      products,
      setPrefilterData,
    } = this.props;

    let filterProduct = [];
    let filterAttribute = [];
    let attributeList = attributes.filter(Item => (!!Item.appear.find(appearItem => (appearItem === category._id))));
    filterAttribute = attributeList;
    if (attributeList.length > 0) {
      const groups = attributeList.filter(item => (!item.groupId));
      attributeList = _difference(attributeList, groups);
      groups.forEach((groupItem) => {
        const childrenList = attributeList.filter(childItem => (childItem.groupId === groupItem._id));
        attributeList = _difference(attributeList, childrenList);
      });
      attributeList.forEach((childListItem) => {
        const groupChild = attributes.filter(item => (item.id === childListItem.groupId));
        filterAttribute = _union(filterAttribute, groupChild);
      });
      const srcAttributeRules = setUnionRules(filterAttribute);

      const attributeRules = getRules(srcAttributeRules, this.props.valueDetails);
      filterProduct = getPreFilterData(attributeRules.editRules, this.props.products);
    } else {
      filterProduct = products;
    }

    setPrefilterData(filterProduct);
    this.setState({
      fetchingFlag: false,
    });
  };

  setMap = (category) => {
    const recvNewRules = category.newRules || [];
    const attributeRules = getRules(recvNewRules, this.props.valueDetails);
    this.setState({
      newRules: attributeRules.newRules,
      editRules: attributeRules.editRules,
    });
  };

  render() {
    const { newRules, editRules } = this.state;
    return (
      <div className="mg-rules-container d-flex">
        {
          !this.state.fetchingFlag
            ? (
              <Fragment>
                <div className="mg-rule-content">
                  <PerfectScrollbar>
                    <RulesTable rules={newRules} />
                  </PerfectScrollbar>
                </div>
                <RulesAction className="mg-rules-actions" rules={editRules} newRules={newRules} />
              </Fragment>
            )
            : (
              <div className="loader">
                <Loader size="small" color="dark" />
              </div>
            )
        }
      </div>
    );
  }
}

NewRules.propTypes = {
  category: PropTypes.object.isRequired,
  attributes: PropTypes.array.isRequired,
  valueDetails: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  setPrefilterData: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  category: store.categoriesData.category,
  valueDetails: store.productsData.data.valueDetails,
  products: store.productsData.data.products,
  attributes: store.attributesData.attributes,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchProducts,
  setPrefilterData,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(NewRules));
