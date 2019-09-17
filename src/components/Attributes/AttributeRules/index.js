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
    newEditRules: [],
    editRules: [],
    displayRules: [],
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

  setRuleArray = (srcList, ruleArray, type = null) => {
    srcList.forEach((item) => {
      const basisObj = basis.find(basisItem => (basisItem.key === item.basis));
      const referObj = refer.find(referItem => (referItem.key === item.refer));
      const otherObj = this.AnaylsisDetails(item.value);
      ruleArray.push({
        _id: item._id,
        basis: (type) ? basisObj.key : basisObj,
        refer: (type) ? referObj.key : referObj,
        detail: (type) ? otherObj.detailObj.key : otherObj.detailObj,
        match: (type) ? otherObj.matchObj.key : otherObj.matchObj,
        value: (type) ? otherObj.valueKey : otherObj.valueKey,
        scope: (type) ? scope[0].key : scope[0],
      });
    });
  };

  setMap = (attribute) => {
    let currentRules = [];
    const grpRules = this.props.attributes.filter(attributeItem => (attributeItem.id === attribute.groupId));
    if (attribute.rules) {
      currentRules = _union(currentRules, attribute.rules);
    }
    let displayRules = currentRules;
    if (grpRules.length > 0 && grpRules[0].rules) {
      displayRules = _union(currentRules, grpRules[0].rules);
    }
    const newRules = [];
    const editRules = [];
    const newEditRules = [];
    const displayEditRules = [];
    this.setRuleArray(currentRules, editRules, 'key');
    this.setRuleArray(currentRules, newEditRules);
    this.setRuleArray(displayRules, newRules);
    this.setRuleArray(displayRules, displayEditRules, 'key');

    this.setState({
      newRules,
      editRules,
      displayRules: displayEditRules,
    });
  };

  render() {
    const {
      newRules,
      editRules,
      newEditRules,
      displayRules,
    } = this.state;
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
                <RulesAction
                  className="mg-rules-actions"
                  rules={editRules}
                  newRules={newEditRules}
                  displayRules={displayRules}
                />
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
