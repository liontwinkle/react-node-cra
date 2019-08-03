import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { OrderedMap } from 'immutable';
import isEqual from 'lodash/isEqual';

import { getMapFromJson, getJsonFromMap } from 'utils';
import { RuleBuilder } from 'components/elements';
import RuleActions from './RuleActions';

import './style.scss';

class Rules extends Component {
  state = {
    map: new OrderedMap({}),
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
    const rules = category.rules || {};
    const ruleKeys = category.ruleKeys || [];

    this.setState({
      map: getMapFromJson(rules, ''),
      ruleKeys,
    });
  };

  changeMap = (map) => {
    this.setState({ map });
  };

  render() {
    const { map, ruleKeys } = this.state;

    const json = getJsonFromMap(map, '', '');

    return (
      <div className="mg-rules-container d-flex">
        <div className="mg-rule-content">
          {map.size > 0 && (
            <RuleBuilder
              ruleKeys={ruleKeys}
              map={map}
              json={json}
              changeMap={this.changeMap}
            />
          )}
        </div>

        <RuleActions rules={json} />
      </div>
    );
  }
}

Rules.propTypes = {
  category: PropTypes.object.isRequired,
};

const mapStateToProps = store => ({
  category: store.categoriesData.category,
});

export default connect(mapStateToProps)(Rules);
