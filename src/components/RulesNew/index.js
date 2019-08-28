import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

import RulesTable from './RulesTable';
import './style.scss';

class NewRules extends Component {
  state = {
    ruleKeys: [],
  };

  componentDidMount() {
    this.setMap(this.props.category);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.category, nextProps.category)) {
      this.setMap(nextProps.category);
    }
  }

  setMap = (category) => {
    const ruleKeys = category.ruleKeys || [];
    this.setState({
      ruleKeys,
    });
  };

  render() {
    const { ruleKeys } = this.state;

    return (
      <div className="mg-rules-container d-flex">
        <div className="mg-rule-content">
          <RulesTable rules={ruleKeys} />
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
