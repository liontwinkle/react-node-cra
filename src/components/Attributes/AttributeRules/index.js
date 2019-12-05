import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withSnackbar } from 'notistack';

import { fetchProducts } from 'redux/actions/products';
import { setProductViewType } from 'redux/actions/clients';
import { setPrefilterData } from 'redux/actions/categories';
import Loader from 'components/Loader';
import { CustomToggle } from 'components/elements';
import {
  basis, refer, match, scope, productViewTypes, ruleType,
} from 'utils/constants';
import { confirmMessage } from 'utils';
import { unionRules } from 'utils/ruleManagement';

import RulesTable from 'components/shared/Rules/RulesTable';
import RulesAction from './RulesAction';

import './style.scss';

class AttributeRules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newRules: [],
      newEditRules: [],
      universalRules: [],
      otherRules: [],
      editRules: [],
      displayRules: [],
      productsFlag: false,
      fetchingFlag: true,
    };
  }

  componentDidMount() {
    this.setState({ fetchingFlag: true });
    if (this.props.products.length === 0 && !this.props.isFetchingList) {
      this.geProductsData();
    } else {
      try {
        this.setMap(this.props.attribute);
        this.setState({ fetchingFlag: false });
      } catch (e) {
        this.setState({ fetchingFlag: false });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.attribute && (this.props.attribute !== prevProps.attribute)) {
      if (this.props.products.length === 0 && !this.props.isFetchingList) {
        this.geProductsData();
      } else {
        this.setMap(this.props.attribute);
      }
    }
  }

  geProductsData = () => {
    this.props.fetchProducts()
      .then(() => {
        try {
          this.setMap(this.props.attribute);
          confirmMessage(this.props.enqueueSnackbar, 'Success to collect the Rule keys.', 'success');
        } catch (e) {
          confirmMessage(this.props.enqueueSnackbar, 'Error to collect the Rule Keys.', 'error');
        }
        this.setState({ fetchingFlag: false });
      })
      .catch(() => {
        confirmMessage(this.props.enqueueSnackbar, 'Error to collect the Rule Keys.', 'error');
        this.setState({ fetchingFlag: false });
      });
  };

  setRuleArray = (srcList, ruleArray, type = null) => {
    srcList.forEach((item) => {
      const basisObj = basis.find((basisItem) => (basisItem.key === item.basis));
      const referObj = refer.find((referItem) => (referItem.key === item.refer));
      const keyObj = this.props.valueDetails.find((keyItem) => (keyItem.key === item.key));
      const matchObj = match.find((matchItem) => (matchItem.key === item.type));
      const ruleTypeObj = ruleType.find((ruleTypeObjItem) => (ruleTypeObjItem.key === item.ruleType));
      if (keyObj) {
        ruleArray.push({
          basis: (type) ? basisObj.key : basisObj,
          refer: (type) ? referObj.key : referObj,
          key: (type) ? keyObj.key : keyObj,
          type: (type) ? matchObj.key : matchObj,
          criteria: item.criteria,
          scope: (type) ? scope[0].key : scope[0],
          ruleType: (type) ? ruleTypeObj.key : ruleTypeObj,
        });
      }
    });
  };

  setMap = (attribute) => {
    let currentRules = [];
    const grpRules = this.props.attributes.filter((attributeItem) => (
      attributeItem._id === attribute.group_id));
    if (attribute.rules.length > 0) {
      currentRules = unionRules(currentRules, attribute.rules);
    }
    let displayRules = JSON.parse(JSON.stringify(currentRules));
    const defaultFlag = (attribute.rules.length <= 0);
    if (grpRules.length > 0 && grpRules[0].rules) {
      const defaultRules = grpRules[0].rules.filter((item) => (item.ruleType === 'default'));
      const universalRules = grpRules[0].rules.filter((item) => (item.ruleType === 'universal'));
      const filteredRules = (defaultFlag) ? unionRules(defaultRules, universalRules) : universalRules;
      displayRules = unionRules(currentRules, filteredRules);
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
      newEditRules,
      universalRules: newRules.filter((item) => (item.ruleType.key === 'universal')),
      otherRules: newRules.filter((item) => (item.ruleType.key !== 'universal')),
      displayRules: displayEditRules,
    });
  };

  onHandleSwitchView = () => {
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
    const {
      newRules,
      editRules,
      newEditRules,
      displayRules,
      universalRules,
      otherRules,
    } = this.state;
    return (
      <div className="mg-rules-container d-flex">
        {
          !this.state.fetchingFlag
            ? (
              <>
                <div className="mg-rule-content">
                  {
                    this.props.products.length > 0
                      ? (
                        <>
                          <CustomToggle
                            label="Products Switch"
                            value={this.state.productsFlag}
                            onToggle={this.onHandleSwitchView}
                          />
                          <PerfectScrollbar>
                            <div className="virtual-rule-section">
                              {
                                universalRules.length > 0 && (
                                  <>
                                    <label className="rule-section-header">
                                      Universal
                                    </label>
                                    <RulesTable rules={universalRules} />
                                  </>
                                )
                              }
                              {
                                otherRules.length > 0 && (
                                  <>
                                    <div className="virtual-rule-section">
                                      <label className="rule-section-header">
                                        Normal / Default
                                      </label>
                                      <RulesTable rules={otherRules} />
                                    </div>
                                  </>
                                )
                              }
                            </div>
                          </PerfectScrollbar>
                        </>
                      )
                      : (
                        <label className="products_empty_body">
                          The Products data is not existed. Please import Data.
                        </label>
                      )
                  }
                </div>
                {
                  this.props.products.length > 0
                  && (
                    <RulesAction
                      className="mg-rules-actions"
                      rules={editRules}
                      newRules={newEditRules}
                      matchRules={newRules}
                      displayRules={displayRules}
                      universalRules={universalRules.map((item) => ({
                        basis: item.basis.key,
                        refer: item.refer.key,
                        key: item.key.key,
                        criteria: item.criteria,
                        type: item.type.key,
                        scope: item.scope.key,
                        ruleType: item.ruleType.key,
                      }))}
                    />
                  )
                }
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

AttributeRules.propTypes = {
  attribute: PropTypes.object.isRequired,
  attributes: PropTypes.array.isRequired,
  valueDetails: PropTypes.array.isRequired,
  isFetchingList: PropTypes.bool.isRequired,
  products: PropTypes.array.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  setProductViewType: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  attribute: store.attributesData.attribute,
  attributes: store.attributesData.attributes,
  nodes: store.attributesData.nodes,
  valueDetails: store.productsData.data.valueDetails,
  isFetchingList: store.productsData.isFetchingList,
  products: store.productsData.data.products,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchProducts,
  setPrefilterData,
  setProductViewType,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(AttributeRules));
