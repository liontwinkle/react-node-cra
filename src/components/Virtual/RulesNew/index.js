import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import _difference from 'lodash/difference';
import _union from 'lodash/union';

import { fetchProducts } from 'redux/actions/products';
import { setPrefilterData } from 'redux/actions/categories';
import { setProductViewType } from 'redux/actions/clients';
import { confirmMessage, getPreFilterData } from 'utils';
import { setUnionRules, getRules } from 'utils/ruleManagement';
import { productViewTypes } from 'utils/constants';
import Loader from 'components/Loader/index';
import { CustomToggle } from 'components/elements';
import RulesTable from './RulesTable/index';
import RulesAction from './RulesAction/index';

import './style.scss';

class NewRules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newRules: [],
      editRules: [],
      fetchingFlag: true,
      productsFlag: false,
    };
  }

  componentDidMount() {
    this.setState({
      fetchingFlag: true,
    });
    if (this.props.products.length === 0 && !this.props.isFetchingList) {
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
    let attributeList = attributes.filter((Item) => (
      !!Item.appear.find((appearItem) => (appearItem === category.categoryId))));
    let filterAttribute = attributeList;

    if (attributeList.length > 0) {
      const groups = attributeList.filter((item) => (!item.groupId));
      attributeList = _difference(attributeList, groups);
      groups.forEach((groupItem) => {
        const childrenList = attributeList.filter((childItem) => (
          childItem.groupId === groupItem.attributeId.toString()));
        attributeList = _difference(attributeList, childrenList);
      });
      attributeList.forEach((childListItem) => {
        const groupChild = attributes.filter((item) => (item.attributeId.toString() === childListItem.groupId));
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
    const recvNewRules = category.rules || [];
    const attributeRules = getRules(recvNewRules, this.props.valueDetails);
    this.setState({
      newRules: attributeRules.newRules,
      editRules: attributeRules.editRules,
    });
  };

  onHandleSwtichView = () => {
    this.setState((prevState) => ({
      productsFlag: !prevState.productsFlag,
    }));
    if (this.state.productsFlag) {
      this.props.setProductViewType(productViewTypes[0]);
    } else {
      this.props.setProductViewType(productViewTypes[1]);
    }
  };

  render() {
    const { newRules, editRules } = this.state;
    return (
      <div className="mg-rules-container d-flex">
        {
          !this.state.fetchingFlag
            ? (
              <>
                <div className="mg-rule-content">
                  <CustomToggle
                    label="Products Switch"
                    value={this.state.productsFlag}
                    onToggle={this.onHandleSwtichView}
                  />
                  <PerfectScrollbar>
                    <RulesTable rules={newRules} />
                  </PerfectScrollbar>
                </div>
                <RulesAction className="mg-rules-actions" rules={editRules} newRules={newRules} />
              </>
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
  isFetchingList: PropTypes.bool.isRequired,
  attributes: PropTypes.array.isRequired,
  valueDetails: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  setPrefilterData: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  setProductViewType: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  category: store.categoriesData.category,
  products: store.productsData.data.products,
  valueDetails: store.productsData.data.valueDetails,
  isFetchingList: store.productsData.isFetchingList,
  attributes: store.attributesData.attributes,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchProducts,
  setPrefilterData,
  setProductViewType,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(NewRules));
