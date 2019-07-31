import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { OrderedMap } from 'immutable';
import uuidv4 from 'uuid/v4';

import { removeRecursive } from 'utils';
import Toggle from './Toggle';
import Rule from './Rule';

import './style.scss';

class RuleBuilder extends Component {
  renderRuleGroup = ({
    glue, rules = [], hashKey, lastKey,
  }) => {
    const { map, ruleKeys } = this.props;

    const [...keys] = map.keys();
    const lastIndex = keys.indexOf(lastKey);

    return (
      <div
        className="mg-rule-group"
        key={uuidv4()}
      >
        <div className="rule-group-content">
          <Toggle
            value={glue}
            onToggle={this.changeGlue(hashKey)}
          />

          <div className="mg-rules">
            {rules.map((rule) => {
              if (rule.glue) {
                return this.renderRuleGroup(rule);
              }

              return (
                <Rule
                  key={uuidv4()}
                  item={rule}
                  fieldItems={ruleKeys}
                  removeItem={this.removeRule}
                  changeField={this.changeField}
                  changeRule={this.changeRule}
                  changeValue={this.changeValue}
                />
              );
            })}
          </div>
        </div>

        <div className="rule-group-action">
          <button
            className="mg-add-rule-group"
            onClick={this.addRuleGroup(hashKey, lastIndex)}
          >
            + Add Group
          </button>

          <button
            className="mg-add-rule"
            onClick={this.addRule(hashKey, lastIndex)}
          >
            + Add Rule
          </button>
        </div>
      </div>
    );
  };

  changeGlue = hashKey => (glue) => {
    this.props.changeMap(
      this.props.map.update(hashKey, val => ({
        ...val,
        glue,
      })),
    );
  };

  removeRule = (hashKey, parentKey) => {
    let { map } = this.props;

    map = map.delete(hashKey);
    map = removeRecursive(map, parentKey);

    if (map.size === 0) {
      const newKey = uuidv4();
      map = map.set(newKey, {
        glue: 'and',
        parentKey: '',
      });
      map = map.set(uuidv4(), {
        key: '',
        parentKey: newKey,
      });
    }

    this.props.changeMap(map);
  };

  changeField = hashKey => (key) => {
    this.props.changeMap(
      this.props.map.update(hashKey, val => ({
        ...val,
        key,
      })),
    );
  };

  changeRule = hashKey => (rule) => {
    this.props.changeMap(
      this.props.map.update(hashKey, val => ({
        ...val,
        rule,
      })),
    );
  };

  changeValue = hashKey => (value) => {
    this.props.changeMap(
      this.props.map.update(hashKey, val => ({
        ...val,
        value,
      })),
    );
  };

  addRuleGroup = (parentKey, lastIndex) => () => {
    const { map } = this.props;
    let newMap = new OrderedMap();
    const [...keys] = map.keys();

    const end = Math.min(lastIndex, keys.length);
    for (let i = 0; i <= end; i++) {
      newMap = newMap.set(keys[i], map.get(keys[i]));
    }

    const newKey = uuidv4();
    newMap = newMap.set(newKey, {
      glue: 'and',
      parentKey,
    });
    newMap = newMap.set(uuidv4(), {
      key: '',
      parentKey: newKey,
    });

    for (let i = end + 1; i < keys.length; i++) {
      newMap = newMap.set(keys[i], map.get(keys[i]));
    }

    this.props.changeMap(newMap);
  };

  addRule = (parentKey, lastIndex) => () => {
    const { map } = this.props;
    let newMap = new OrderedMap();
    const [...keys] = map.keys();

    const end = Math.min(lastIndex, keys.length);
    for (let i = 0; i <= end; i++) {
      newMap = newMap.set(keys[i], map.get(keys[i]));
    }

    const newKey = uuidv4();
    newMap = newMap.set(newKey, {
      key: '',
      parentKey,
    });

    for (let i = end + 1; i < keys.length; i++) {
      newMap = newMap.set(keys[i], map.get(keys[i]));
    }

    this.props.changeMap(newMap);
  };

  render() {
    const { json } = this.props;

    return (
      <PerfectScrollbar
        options={{
          minScrollbarLength: 50,
        }}
      >
        {this.renderRuleGroup(json)}
      </PerfectScrollbar>
    );
  }
}

RuleBuilder.propTypes = {
  map: PropTypes.object.isRequired,
  ruleKeys: PropTypes.array.isRequired,
  json: PropTypes.object.isRequired,
  changeMap: PropTypes.func.isRequired,
};

export default RuleBuilder;
