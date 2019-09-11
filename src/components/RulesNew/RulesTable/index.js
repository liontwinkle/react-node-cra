import React, { useState } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { Tooltip } from 'react-tippy';
import { useSnackbar } from 'notistack';
import SaveIcon from '@material-ui/icons/Filter';

import { IconButton } from 'components/elements';
import PreviewProducts from '../RulesAction/PreviewProducts';
import PreviewGrid from '../RulesAction/PreviewGrid';
import RuleEngine from '../RuleEngine';

import './style.scss';

function RulesTable({ rules, products, productViewType }) {
  const { enqueueSnackbar } = useSnackbar();

  const [preViewState, setPreViewState] = useState(false);
  const [previewProducts, setProducts] = useState([]);

  const getProducts = (field, match, value) => {
    console.log('-------- RulesTable.getProducts --------');
    console.log('Match:', match);
    console.log('Field (Key):', field);
    console.log('Value (Criteria):', value);

    console.log('Check what value is:', RuleEngine); // fixme
    const rule = RuleEngine[match](value);
    console.log(rule);
    // console.log(productItem[field]);


    const returnValue = [];
    let index = 0;

    products.forEach((productItem) => {
      // console.log('In forEach..');
      console.log('rule.test(productItem[field])', rule.test(productItem[field]));

      if (rule.test(productItem[field])) {
        console.log('================== Match: ================== ', match);
        console.log('Field (Key):', field);
        console.log('Value (Criteria):', value);
        console.log('MATCH!', productItem[field]);
        console.log('rule.test(productItem[field])', rule.test(productItem[field]));
        returnValue[index] = productItem;
        index++;
      }
    });
    return returnValue;
  };

  const getAllmatched = (match, value) => {
    console.log('-------- RulesTable.getAllmatched --------');
    const caseInsensitiveMatch = new RegExp(`${value}`, 'i');
    const caseSensitiveMatch = new RegExp(`${value}`);
    let checkValue = [];
    const returnValue = [];
    let index = 0;
    products.forEach((proItem) => {
      const values = Object.values(proItem);
      switch (match) {
        case ':=':
          if (values.filter(item => (item === value)).length > 0) {
            returnValue[index] = proItem;
            index++;
          }
          break;
        case '::':
          if (values.filter(item => caseInsensitiveMatch.test(item)).length > 0) {
            returnValue[index] = proItem;
            index++;
          }
          break;
        case ':':
          if (values.filter(item => caseSensitiveMatch.test(item)).length > 0) {
            returnValue[index] = proItem;
            index++;
          }
          break;
        case ':<=':
          checkValue = values.filter((item) => {
            if (typeof item === 'number') {
              return item <= value;
            }
            return false;
          });
          if (checkValue.length > 0) {
            returnValue[index] = proItem;
            index++;
          }
          break;
        case ':>=':
          checkValue = values.filter((item) => {
            if (typeof item === 'number') {
              return item >= value;
            }
            return false;
          });
          if (checkValue.length > 0) {
            returnValue[index] = proItem;
            index++;
          }
          break;
        case ':<':
          checkValue = values.filter((item) => {
            if (typeof item === 'number') {
              return item < value;
            }
            return false;
          });
          if (checkValue.length > 0) {
            returnValue[index] = proItem;
            index++;
          }
          break;
        case ':>':
          checkValue = values.filter((item) => {
            if (typeof item === 'number') {
              return item > value;
            }
            return false;
          });
          if (checkValue.length > 0) {
            returnValue[index] = proItem;
            index++;
          }
          break;
        case ':==':
          checkValue = values.filter((item) => {
            if (typeof item === 'number') {
              return item === value;
            }
            return false;
          });
          if (checkValue.length > 0) {
            returnValue[index] = proItem;
            index++;
          }
          break;
        default:
          break;
      }
    });
    return returnValue;
  };

  const filterProducts = (key) => {
    console.log('-------- RulesTable.filterProducts --------');
    let filter = [];
    const field = rules[key].detail.key;
    const match = rules[key].match.key;
    const { value } = rules[key];
    if (field === '*') {
      filter = [...filter, ...getAllmatched(match, value)];
    } else {
      filter = [...filter, ...getProducts(field, match, value)];
    }
    setProducts(filter.filter((e, i) => filter.indexOf(e) >= i));
    return filter.length;
  };

  const handleToggle = key => () => {
    console.log('-------- RulesTable.handleToggle --------');
    if (key !== 'close' && filterProducts(key) === 0) {
      enqueueSnackbar('No Products match this rule.', {
        variant: 'info',
        autoHideDuration: 4000,
      });
    } else {
      setPreViewState(!preViewState);
    }
  };

  return (
    <div className="mg-rule-actions d-flex flex-column align-items-center">
      {(rules.length > 0) && (
        <table>
          <thead>
            <tr>
              <th>Rule`s Basis</th>
              <th>Rule`s Refer</th>
              <th>Search By Key</th>
              <th>Rule`s Value</th>
              <th>Rule`s Criteria</th>
              <th>Rule`s Scope</th>
              <th>Preview Marches</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((item, i) => (
              <tr key={parseInt(i, 10)}>
                <td>
                  <label className="item">
                    {item.basis.label}
                  </label>
                </td>
                <td>
                  <label className="item">
                    {item.refer.label}
                  </label>
                </td>
                <td>
                  <label className="item">
                    {item.detail.label}
                  </label>
                </td>
                <td>
                  <label className="item">
                    {item.match.label}
                  </label>
                </td>
                <td>
                  <label className="item">
                    {item.value}
                  </label>
                </td>
                <td>
                  <label className="item">
                    {item.scope.label}
                  </label>
                </td>
                <td>
                  <Tooltip
                    title="Preview Products for Current Rule"
                    position="right"
                    arrow
                  >
                    <IconButton>
                      <SaveIcon style={{ fontSize: 20 }} onClick={handleToggle(i)} />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {preViewState && (
        (productViewType.key === 'grid')
          ? (
            <PreviewGrid
              open={preViewState}
              handleClose={handleToggle('close')}
              filterProducts={previewProducts}
            />
          )
          : (
            <PreviewProducts
              open={preViewState}
              handleClose={handleToggle('close')}
              filterProducts={previewProducts}
            />
          )
      )}
    </div>
  );
}

RulesTable.propTypes = {
  rules: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  productViewType: PropTypes.object.isRequired,
};
const mapStateToProps = store => ({
  products: store.productsData.data.products,
  productViewType: store.clientsData.productViewType,
});
export default connect(
  mapStateToProps,
)(RulesTable);
