import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';

import { updateCategory } from 'redux/actions/categories';

import './style.scss';
import { CustomInput, CustomSelect } from 'components/elements';
import {
  basis, refer, match, scope,
} from 'utils/constants';

function RulesTable(props) {
  const { enqueueSnackbar } = useSnackbar();
  const {
    rules,
    isUpdating,
    category,
    updateCategory,
    valueDetails,
  } = props;

  const [rulesState, setRulesState] = useState(rules);

  useEffect(() => {
    setRulesState(rules);
  }, [rules]);
  const saveRules = (updatedState) => {
    const updatedData = [];
    updatedState.forEach((item) => {
      const value = `[${item.detail.key}${item.match.key}]${item.value}`;
      updatedData.push({
        basis: item.basis.key,
        refer: item.refer.key,
        value,
        scope: 0,
      });
    });
    if (!isUpdating) {
      updateCategory(category.id, { newRules: updatedData })
        .catch(() => {
          enqueueSnackbar('Error in updating new rules.',
            {
              variant: 'error',
              autoHideDuration: 4000,
            });
        });
    }
  };

  const handleChange = (type, key) => (item) => {
    const index = (key !== -1) ? key : rules.length;
    const updatedState = rules;
    if (!rulesState[index]) {
      updatedState.push({
        basis: basis[0],
        refer: refer[0],
        detail: valueDetails[0],
        match: match[0],
        scope: scope[0],
        value: '',
      });
    }
    switch (type) {
      case 'basis':
        updatedState[index].basis = item;
        break;
      case 'refer':
        updatedState[index].refer = item;
        break;
      case 'detail':
        updatedState[index].detail = item;
        break;
      case 'match':
        updatedState[index].match = item;
        break;
      case 'scope':
        updatedState[index].scope = item;
        break;
      default:
        break;
    }
    setRulesState(updatedState);
    saveRules(updatedState);
  };
  const handleChangeValue = key => (e) => {
    const index = (key !== -1) ? key : rules.length;
    const updatedState = rules;
    if (!rulesState[index]) {
      updatedState.push({
        basis: basis[0],
        refer: refer[0],
        detail: valueDetails[0],
        match: match[0],
        scope: scope[0],
        value: '',
      });
    }
    updatedState[index].value = e.target.value;
    setRulesState(updatedState);
    saveRules(updatedState);
  };
  return (
    <div className="mg-rule-actions d-flex flex-column align-items-center">
      <table>
        <thead>
          <tr>
            <th>Rule`s Basis</th>
            <th>Rule`s Refer</th>
            <th>Search By Key</th>
            <th>Rule`s Value</th>
            <th>Rule`s Criteria</th>
            <th>Rule`s Scope</th>
          </tr>
        </thead>
        <tbody>
          <tr key="new">
            <td>
              <CustomSelect
                placeholder="Select Basis of Rule"
                value={basis[0]}
                items={basis}
                onChange={handleChange('basis', -1)}
              />
            </td>
            <td>
              <CustomSelect
                placeholder="Select Refer of Rule"
                value={refer[0]}
                items={refer}
                onChange={handleChange('refer', -1)}
              />
            </td>
            <td>
              <CustomSelect
                placeholder="Select Detail of Rule"
                value={valueDetails[0]}
                items={valueDetails}
                onChange={handleChange('detail', -1)}
              />
            </td>
            <td>
              <CustomSelect
                placeholder="Select matches of Rule"
                value={match[0]}
                items={match}
                onChange={handleChange('match', -1)}
              />
            </td>
            <td>
              <CustomInput
                inline
                value=""
                placeholder="Input the value"
                onChange={handleChangeValue(-1)}
              />
            </td>
            <td>
              <CustomSelect
                placeholder="Select Scope of Rule"
                value={scope[0]}
                items={scope}
                onChange={handleChange('scope', -1)}
              />
            </td>
          </tr>
          {
            rules.map((item, key) => (
              <tr key={parseInt(key, 10)}>
                <td>
                  <CustomSelect
                    placeholder="Select Basis of Rule"
                    value={item.basis}
                    items={basis}
                    onChange={handleChange('basis', key)}
                  />
                </td>
                <td>
                  <CustomSelect
                    placeholder="Select Refer of Rule"
                    value={item.refer}
                    items={refer}
                    onChange={handleChange('refer', key)}
                  />
                </td>
                <td>
                  <CustomSelect
                    placeholder="Select Detail of Rule"
                    value={item.detail}
                    items={valueDetails}
                    onChange={handleChange('detail', key)}
                  />
                </td>
                <td>
                  <CustomSelect
                    placeholder="Select matches of Rule"
                    value={item.match}
                    items={match}
                    onChange={handleChange('match', key)}
                  />
                </td>
                <td>
                  <CustomInput
                    inline
                    value={item.value}
                    placeholder="Input the value"
                    onChange={handleChangeValue(key)}
                  />
                </td>
                <td>
                  <CustomSelect
                    placeholder="Select Scope of Rule"
                    value={item.scope}
                    items={scope}
                    onChange={handleChange('scope', key)}
                  />
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>

  );
}

RulesTable.propTypes = {
  isUpdating: PropTypes.bool.isRequired,
  category: PropTypes.object.isRequired,
  rules: PropTypes.array.isRequired,
  updateCategory: PropTypes.func.isRequired,
  valueDetails: PropTypes.array.isRequired,
};

const mapStateToProps = store => ({
  isUpdating: store.categoriesData.isUpdating,
  category: store.categoriesData.category,
  valueDetails: store.productsData.valueDetails,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateCategory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RulesTable);
