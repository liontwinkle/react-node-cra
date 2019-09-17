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
import { confirmMessage, getPreFilterData } from 'utils';
import Loader from 'components/Loader';
import {
  basis,
  refer,
  match,
  scope,
} from 'utils/constants';
import RulesTable from './RulesTable';
import RulesAction from './RulesAction';


import './style.scss';

class AttributeRules extends Component {
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
          console.log('######## DEBUG: START THE BUILDING RULES PAGE ###############'); // fixme
          this.setMap(this.props.attribute);
          this.FilterProducts();
          confirmMessage(this.props.enqueueSnackbar, 'Success to collect the Rule keys.', 'success');
        })
        .catch(() => {
          confirmMessage(this.props.enqueueSnackbar, 'Error to collect the Rule Keys.', 'error');
          this.setState({
            fetchingFlag: false,
          });
        });
    } else {
      this.setMap(this.props.attribute);
      this.FilterProducts();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.attribute && (this.props.attribute !== prevProps.attribute)) {
      this.setMap(this.props.attribute);
    }
  }

  FilterProducts = () => {
    const {
      attributes,
      attribute,
      products,
      setPrefilterData,
      nodes,
    } = this.props;

    let filterProject = [];
    let attributeList = attributes.filter(Item => (!!Item.appear.find(appearItem => (appearItem === attribute._id))));
    if (attributeList.length > 0) {
      const groups = attributeList.filter(item => (!item.groupId));
      attributeList = _difference(attributeList, groups);
      groups.forEach((groupItem) => {
        const childrenList = attributeList.filter(childItem => (childItem.groupId === groupItem._id));
        filterProject = _union(filterProject, getPreFilterData(groupItem, nodes, products));
        attributeList = _difference(attributeList, childrenList);
      });

      attributeList.forEach((childListItem) => {
        filterProject = _union(filterProject, getPreFilterData(childListItem, nodes, products));
      });
    } else {
      filterProject = products;
    }

    setPrefilterData(filterProject);
    this.setState({
      fetchingFlag: false,
    });
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

  setMap = (attribute) => {
    const recvRules = attribute.rules || [];
    const newRules = [];
    const editRules = [];
    recvRules.forEach((item) => {
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

AttributeRules.propTypes = {
  attribute: PropTypes.object.isRequired,
  attributes: PropTypes.array.isRequired,
  valueDetails: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  setPrefilterData: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  attribute: store.attributesData.attribute,
  valueDetails: store.productsData.data.valueDetails,
  products: store.productsData.data.products,
  attributes: store.attributesData.attributes,
  nodes: store.attributesData.nodes,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchProducts,
  setPrefilterData,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(AttributeRules));
