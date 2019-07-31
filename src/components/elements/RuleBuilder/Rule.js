import React from 'react';
import PropTypes from 'prop-types';

import { ruleStringItems, ruleNumberItems } from 'utils/constants';
import { CustomSelect } from 'components/elements';
import Input from './Input';

const Rule = (props) => {
  const {
    item: {
      key, rule, value, hashKey, parentKey,
    },
    fieldItems,
    removeItem,
    changeField,
    changeRule,
    changeValue,
  } = props;

  if (key === undefined) {
    return null;
  }

  return (
    <div className="mg-rule">
      <CustomSelect
        className="key mr-2"
        value={key}
        items={fieldItems}
        onChange={changeField(hashKey)}
      />

      {key && (
        <CustomSelect
          className="rule mr-2"
          value={rule}
          items={key === 'age' ? ruleNumberItems : ruleStringItems}
          onChange={changeRule(hashKey)}
        />
      )}

      {rule && (
        <Input
          value={value}
          onChange={changeValue(hashKey)}
        />
      )}

      <button
        className="mg-rule-remove"
        onClick={() => removeItem(hashKey, parentKey)}
      >
        <i className="fa fa-trash-o" aria-hidden="true" />
      </button>
    </div>
  );
};

Rule.propTypes = {
  item: PropTypes.object,
  fieldItems: PropTypes.array.isRequired,
  removeItem: PropTypes.func.isRequired,
  changeField: PropTypes.func.isRequired,
  changeRule: PropTypes.func.isRequired,
  changeValue: PropTypes.func.isRequired,
};

Rule.defaultProps = {
  item: null,
};

export default Rule;
