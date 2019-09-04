import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import PerfectScrollbar from 'react-perfect-scrollbar';

import {
  basis,
  refer,
  match,
  scope,
} from 'utils/constants';
import { fetchProducts } from 'redux/actions/products';
import RulesTable from './RulesTable';
import RulesAction from './RulesAction';

import './style.scss';
import { confirmMessage } from '../../utils';

class NewRules extends Component {
  state = {
    newRules: [],
    editRules: [],
  };

  componentDidMount() {
    this.props.fetchProducts()
      .then(() => {
        this.setMap(this.props.category);
        confirmMessage(this.props.enqueueSnackbar, 'Success to collect the Rule keys.', 'success');
      })
      .catch(() => {
        confirmMessage(this.props.enqueueSnackbar, 'Error to collect the Rule Keys.', 'error');
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props.category && (this.props.category !== prevProps.category)) {
      this.setMap(this.props.category);
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
        <div className="mg-rule-content">
          <PerfectScrollbar>
            <RulesTable rules={newRules} />
          </PerfectScrollbar>
        </div>
        <RulesAction className="mg-rules-actions" rules={editRules} newRules={newRules} />
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
