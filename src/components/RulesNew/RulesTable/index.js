import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';

import { updateCategory } from 'redux/actions/categories';

import './style.scss';
import { CustomInput, CustomSelect } from 'components/elements';

function RulesTable(props) {
  const { enqueueSnackbar } = useSnackbar();

  const basis = [
    {
      label: 'Includes categories or products',
      key: 'include',
    },
    {
      label: 'Excludes categories or products',
      key: 'exclude',
    },
  ];
  const refer = [
    {
      label: 'Refer to product details',
      key: 'product_detail',
    },
  ];
  const valueDetails = [
    {
      label: 'By All',
      key: '*',
    },
    {
      label: 'By Name',
      key: 'name',
    },
    {
      label: 'By Description',
      key: 'description',
    },
    {
      label: 'By Description Html',
      key: 'description_html',
    },
    {
      label: 'By Feature',
      key: 'feature',
    },
    {
      label: 'By Color',
      key: 'color',
    },
    {
      label: 'By Color Map',
      key: 'color_map',
    },
  ];
  const match = [
    {
      label: 'Exact(text)',
      key: ':=',
    },
    {
      label: 'Literal(text)',
      key: '::',
    },
    {
      label: 'Contains(text)',
      key: ':',
    },
    {
      label: 'Lower or equals(number)',
      key: '<=',
    },
    {
      label: 'Greater or equals(number',
      key: '>=',
    },
    {
      label: 'Lower',
      key: '<',
    },
    {
      label: 'Greater',
      key: '>',
    },
    {
      label: 'Equals',
      key: '==',
    },
  ];
  const scope = [
    {
      label: '- All Categories -',
      key: '0',
    },
  ];
  const {
    rules,
    isUpdating,
    category,
    updateCategory,
  } = props;

  const [basisItem, setBasis] = useState(basis[0]);
  const [referItem, setRefer] = useState(refer[0]);
  const [valueDetailItem, setValueDetails] = useState(valueDetails[0]);
  const [matchItem, setMatch] = useState(match[0]);
  const [value, setValue] = useState('');
  const [scopeItem, setScopeItem] = useState(scope[0]);
  const [rulesState, setRulesState] = useState(rules);
  // const [open, setOpen] = useState({ add: false, edit: false });
  // const handleToggle = field => () => {
  //   setOpen({
  //     ...open,
  //     [field]: !open[field],
  //   });
  // };
  //
  const saveRules = (updatedState) => {
    console.log('rulesState>>>>>>', updatedState);// fixme
    const updatedData = [];
    updatedState.forEach((item) => {
      const value = `[${item.detail.key} ${item.match.key}] ${item.value}`;
      updatedData.push({
        basis: item.basis.key,
        refer: item.refer.key,
        value,
        scope: 0,
      });
    });
    console.log('updatedData>>>>', updatedData);// fixme
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
    const updatedState = (rules.length > 0) ? rules : [{
      basis: rulesState[0] ? rulesState[0].basis : basis[0],
      refer: rulesState[0] ? rulesState[0].refer : refer[0],
      detail: rulesState[0] ? rulesState[0].detail : valueDetails[0],
      match: rulesState[0] ? rulesState[0].match : match[0],
      scope: rulesState[0] ? rulesState[0].scope : scope[0],
      value: rulesState[0] ? rulesState[0].value : '',
    }];
    const index = (key !== -1) ? key : rules.length;
    switch (type) {
      case 'basis':
        setBasis(item);
        updatedState[index].basis = item;
        break;
      case 'refer':
        setRefer(item);
        updatedState[index].refer = item;
        break;
      case 'detail':
        setValueDetails(item);
        updatedState[index].detail = item;
        break;
      case 'match':
        setMatch(item);
        updatedState[index].match = item;
        break;
      case 'scope':
        setScopeItem(item);
        updatedState[index].scope = item;
        break;
      default:
        break;
    }
    setRulesState(updatedState);
    saveRules(updatedState);
  };
  const handleChangeValue = key => (e) => {
    const updatedState = (rules.length > 0) ? rules : [{
      basis: rulesState[0] ? rulesState[0].basis : basis[0],
      refer: rulesState[0] ? rulesState[0].refer : refer[0],
      detail: rulesState[0] ? rulesState[0].detail : valueDetails[0],
      match: rulesState[0] ? rulesState[0].match : match[0],
      scope: rulesState[0] ? rulesState[0].scope : scope[0],
      value: rulesState[0] ? rulesState[0].value : '',
    }];
    const index = (key !== -1) ? key : rules.length;
    updatedState[index].value = e.target.value;
    setRulesState(updatedState);
    setValue(e.target.value);
    saveRules(updatedState);
  };
  return (
    <div className="mg-rule-actions d-flex flex-column align-items-center">
      <table>
        <thead>
          <tr>
            <th>Rule`s basis:</th>
            <th>Rule`s refer:</th>
            <th>Rule`s value:</th>
            <th>Rule`s scope:</th>
          </tr>
        </thead>
        <tbody>
          {
            rules.map((item, key) => (
              <tr key={parseInt(key + 1, 10)}>
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
                  <div className="rule_value">
                    <CustomSelect
                      placeholder="Select Detail of Rule"
                      value={item.detail}
                      items={valueDetails}
                      onChange={handleChange('detail', key)}
                    />
                    <CustomSelect
                      placeholder="Select matches of Rule"
                      value={item.match}
                      items={match}
                      onChange={handleChange('match', key)}
                    />
                    <CustomInput
                      inline
                      value={item.value}
                      placeholder="Input the value"
                      onChange={handleChangeValue(key)}
                    />
                  </div>
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
          <tr key="new">
            <td>
              <CustomSelect
                placeholder="Select Basis of Rule"
                value={basisItem}
                items={basis}
                onChange={handleChange('basis', -1)}
              />
            </td>
            <td>
              <CustomSelect
                placeholder="Select Refer of Rule"
                value={referItem}
                items={refer}
                onChange={handleChange('refer', -1)}
              />
            </td>
            <td>
              <div className="rule_value">
                <CustomSelect
                  placeholder="Select Detail of Rule"
                  value={valueDetailItem}
                  items={valueDetails}
                  onChange={handleChange('detail', -1)}
                />
                <CustomSelect
                  placeholder="Select matches of Rule"
                  value={matchItem}
                  items={match}
                  onChange={handleChange('match', -1)}
                />
                <CustomInput
                  inline
                  value={value}
                  placeholder="Input the value"
                  onChange={handleChangeValue(-1)}
                />
              </div>
            </td>
            <td>
              <CustomSelect
                placeholder="Select Scope of Rule"
                value={scopeItem}
                items={scope}
                onChange={handleChange('scope', -1)}
              />
            </td>
          </tr>
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
};

const mapStateToProps = store => ({
  isUpdating: store.categoriesData.isUpdating,
  category: store.categoriesData.category,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateCategory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RulesTable);
