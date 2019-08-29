import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import PerfectScrollbar from 'react-perfect-scrollbar';

import {
  basis, refer, valueDetails, match, scope,
} from 'utils/constants';
import RulesTable from './RulesTable';
import './style.scss';

class NewRules extends Component {
  state = {
    newRules: [],
  };

  componentDidMount() {
    this.setMap(this.props.category);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.category, nextProps.category)) {
      this.setMap(nextProps.category);
    }
  }

  AnaylsisDetails = (valueStr) => {
    const partValue = valueStr.split(' ');
    const detailKey = partValue[0].replace('[', '');
    const matchKey = partValue[1].replace(']', '');
    const valueKey = partValue[2];
    const detailObj = valueDetails.find(valueDetailsItem => (valueDetailsItem.key === detailKey));
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
        <div className="mg-rule-content">
          <PerfectScrollbar
            options={{
              suppressScrollX: true,
              suppressScrollY: true,
              minScrollbarLength: 50,
            }}
          >
            <RulesTable rules={newRules} />
          </PerfectScrollbar>
        </div>
      </div>
    );
  }
}

NewRules.propTypes = {
  category: PropTypes.object.isRequired,
};

const mapStateToProps = store => ({
  category: store.categoriesData.category,
});

export default connect(mapStateToProps)(NewRules);
