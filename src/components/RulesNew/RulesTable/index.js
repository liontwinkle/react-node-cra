import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { useSnackbar } from 'notistack';

import { updateCategory } from 'redux/actions/categories';

import './style.scss';
import { CustomInput, CustomSelect } from 'components/elements';

function RulesTable(props) {
  // const { enqueueSnackbar } = useSnackbar();

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
    // isUpdating,
    // category,
    // updateCategory,
  } = props;

  console.log('rules>>>', rules);// fixme
  const [basisItem, setBasis] = useState(basis[0]);
  const [referItem, setRefer] = useState(refer[0]);
  const [valueDetailItem, setValueDetails] = useState(valueDetails[0]);
  const [matchItem, setMatch] = useState(match[0]);
  const [value, setValue] = useState('');
  const [scopeItem, setscopeItem] = useState(scope[0]);
  // const [open, setOpen] = useState({ add: false, edit: false });
  // const handleToggle = field => () => {
  //   setOpen({
  //     ...open,
  //     [field]: !open[field],
  //   });
  // };
  //
  // const saveRules = () => {
  //   if (!isUpdating) {
  //     updateCategory(category.id, { rules })
  //       .then(() => {
  //         enqueueSnackbar('Rules has been updated successfully.', { variant: 'success', autoHideDuration: 1000 });
  //       })
  //       .catch(() => {
  //         enqueueSnackbar('Error in updating rules.',
  //           {
  //             variant: 'error',
  //             autoHideDuration: 4000,
  //           });
  //       });
  //   }
  // };

  const handleChangeBasis = (item) => {
    console.log('basisitem>>>>', item);// fixme
    setBasis(item);
  };

  const handleChangeRefer = (item) => {
    console.log('referitem>>>>', item);// fixme
    setRefer(item);
  };
  const handleChangeDetail = (item) => {
    console.log('detailItem>>>>', item);// fixme
    setValueDetails(item);
  };
  const handleChangeMatch = (item) => {
    console.log('matchItem>>>>', item);// fixme
    setMatch(item);
  };
  const handleChangeScope = (item) => {
    console.log('scopeItem>>>>', item);// fixme
    setscopeItem(item);
  };
  const handleChangeValue = (value) => {
    console.log('value>>>>', value);
    setValue(value);
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
          <tr>
            <td>
              <CustomSelect
                placeholder="Select Basis of Rule"
                value={basisItem}
                items={basis}
                onChange={handleChangeBasis}
              />
            </td>
            <td>
              <CustomSelect
                placeholder="Select Refer of Rule"
                value={referItem}
                items={refer}
                onChange={handleChangeRefer}
              />
            </td>
            <td>
              <div className="rule_value">
                <CustomSelect
                  placeholder="Select Refer of Rule"
                  value={valueDetailItem}
                  items={valueDetails}
                  onChange={handleChangeDetail}
                />
                <CustomSelect
                  placeholder="Select Refer of Rule"
                  value={matchItem}
                  items={match}
                  onChange={handleChangeMatch}
                />
                <CustomInput
                  inline
                  value={value}
                  placeholder="Input the value"
                  onChange={handleChangeValue}
                />
              </div>
            </td>
            <td>
              <CustomSelect
                placeholder="Select Scope of Rule"
                value={scopeItem}
                items={scope}
                onChange={handleChangeScope}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

RulesTable.propTypes = {
  // isUpdating: PropTypes.bool.isRequired,
  // category: PropTypes.object.isRequired,
  rules: PropTypes.array.isRequired,
  // updateCategory: PropTypes.func.isRequired,
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
