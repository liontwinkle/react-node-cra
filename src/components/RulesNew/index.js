import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import PerfectScrollbar from 'react-perfect-scrollbar';

import _difference from 'lodash/difference';
import _union from 'lodash/union';

import {
  basis,
  refer,
  match,
  scope,
} from 'utils/constants';
import { fetchProducts } from 'redux/actions/products';
import { setPrefilterData } from 'redux/actions/categories';
import { confirmMessage, getRules } from 'utils';
import RulesTable from './RulesTable';
import RulesAction from './RulesAction';
import Loader from '../Loader';

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
    console.log('########### DEBUG Origin Attribute: ', filterAttribute); // fixme
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
      console.log('########### DEBUG Filter Attribute: ', filterAttribute); // fixme
      const srcAttributeRules = this.getSrcAttributeRules(filterAttribute);
      console.log('########### DEBUG Filter Source Attribute Rules: ', srcAttributeRules); // fixme
      const attributeRules = getRules(srcAttributeRules);
      console.log('########### DEBUG Convert Attribute Rules: ', attributeRules); // fixme
    } else {
      filterProduct = products;
    }

    setPrefilterData(filterProduct);
    this.setState({
      fetchingFlag: false,
    });
  };

  getSrcAttributeRules = (srcAttributes) => {
    let srcAttributeRules = [];
    srcAttributes.forEach((attritbueItem) => {
      srcAttributeRules = _union(srcAttributeRules, attritbueItem.rules);
    });
    return srcAttributeRules;
  };

  AnaylsisDetails = (valueStr) => {
    const partValue = valueStr.split(']');
    const detailValue = partValue[0].split(':');
    const detailKey = detailValue[0].replace('[', '');
    const matchKey = `:${detailValue[1]}`;
    const valueKey = partValue[1];
    const detailObj = this.props.valueDetails.find(
      valueDetailsItem => (valueDetailsItem.key === detailKey.replace(' ', '')),
    );
    const matchObj = match.find(matchItem => (matchItem.key === matchKey));
    return {
      detailObj,
      matchObj,
      valueKey,
    };
  };

  setMap = (category) => {
    const recvNewRules = category.newRules || [];
    const newRules = [];
    const editRules = [];
    recvNewRules.forEach((item) => {
      const basisObj = basis.find(basisItem => (basisItem.key === item.basis));
      const referObj = refer.find(referItem => (referItem.key === item.refer));
      const otherObj = this.AnaylsisDetails(item.value);
      newRules.push({
        _id: item._id,
        basis: basisObj,
        refer: referObj,
        detail: otherObj.detailObj,
        match: otherObj.matchObj,
        value: otherObj.valueKey,
        scope: scope[0],
      });
      editRules.push({
        _id: item._id,
        basis: basisObj.key,
        refer: referObj.key,
        detail: otherObj.detailObj.key,
        match: otherObj.matchObj.key,
        value: otherObj.valueKey,
        scope: scope[0].key,
      });
    });
    this.setState({
      newRules,
      editRules,
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
