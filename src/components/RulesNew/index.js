import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { withSnackbar } from 'notistack';
import PerfectScrollbar from 'react-perfect-scrollbar';

import {
  basis, refer, match, scope,
} from 'utils/constants';
import './style.scss';
import { bindActionCreators } from 'redux';
import { fetchProducts } from 'redux/actions/products';
import RulesTable from './RulesTable';
import RulesAction from './RulesAction';

class NewRules extends Component {
  state = {
    newRules: [],
  };

  componentDidMount() {
    this.props.fetchProducts()
      .then(() => {
        this.setMap(this.props.category);
        this.props.enqueueSnackbar('Success to collect the Rule keys.',
          {
            variant: 'success',
            autoHideDuration: 1000,
          });
      })
      .catch(() => {
        this.props.enqueueSnackbar('Error to collect the Rule Keys.',
          {
            variant: 'error',
            autoHideDuration: 4000,
          });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.category, nextProps.category)) {
      this.setMap(nextProps.category);
    }
  }

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
    recvNewRules.forEach((item) => {
      const basisObj = basis.find(basisItem => (basisItem.key === item.basis));
      const referObj = refer.find(referItem => (referItem.key === item.refer));
      const otherObj = this.AnaylsisDetails(item.value);
      newRules.push({
        basis: basisObj,
        refer: referObj,
        detail: otherObj.detailObj,
        match: otherObj.matchObj,
        value: otherObj.valueKey,
        scope: scope[0],
      });
    });
    this.setState({
      newRules,
    });
  };

  render() {
    const { newRules } = this.state;

    return (
      <div className="mg-rules-container d-flex">
        <RulesAction className="mg-rules-actions" />
        <div className="divider" />
        <div className="mg-rule-content">
          <PerfectScrollbar>
            <RulesTable rules={newRules} />
          </PerfectScrollbar>
        </div>
      </div>
    );
  }
}

NewRules.propTypes = {
  category: PropTypes.object.isRequired,
  valueDetails: PropTypes.array.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  category: store.categoriesData.category,
  valueDetails: store.productsData.valueDetails,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchProducts,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(NewRules));
