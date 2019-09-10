import React, { useState } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { Tooltip } from 'react-tippy';
import { useSnackbar } from 'notistack';
import SaveIcon from '@material-ui/icons/Filter';

import { IconButton } from 'components/elements';
import PreviewProducts from '../RulesAction/PreviewProducts';
import PreviewGrid from '../RulesAction/PreviewGrid';
import { View } from '../RuleEngine';


import './style.scss';

function RulesTable({ rules, products, productViewType }) {
  const { enqueueSnackbar } = useSnackbar();

  const [preViewState, setPreViewState] = useState(false);
  const [previewProducts, setProducts] = useState([]);

  const getProducts = (field, match, value) => {
    const caseInsensitiveMatch = new RegExp(`${value}`, 'i');
    const caseSensitiveMatch = new RegExp(`${value}`);
    const returnValue = [];
    let index = 0;

    console.log('viewName>>>>', View.type({ name: 'name' }));// fixme

    products.forEach((productItem) => {
      switch (match) {
        case ':=':
          if (productItem[field] === value) {
            returnValue[index] = productItem;
            index++;
          }
          break;
        case '::':
          if (caseInsensitiveMatch.test(productItem[field])) {
            returnValue[index] = productItem;
            index++;
          }
          break;
        case ':':
          if (caseSensitiveMatch.test(productItem[field])) {
            returnValue[index] = productItem;
            index++;
          }
          break;
        case ':<=':
          if (typeof productItem[field] === 'number') {
            if (productItem[field] <= value) {
              returnValue[index] = productItem;
              index++;
            }
          }
          break;
        case ':>=':
          if (typeof productItem[field] === 'number') {
            if (productItem[field] >= value) {
              returnValue[index] = productItem;
              index++;
            }
          }
          break;
        case ':<':
          if (typeof productItem[field] === 'number') {
            if (productItem[field] < value) {
              returnValue[index] = productItem;
              index++;
            }
          }
          break;
        case ':>':
          if (typeof productItem[field] === 'number') {
            if (productItem[field] > value) {
              returnValue[index] = productItem;
              index++;
            }
          }
          break;
        case ':==':
          if (typeof productItem[field] === 'number') {
            if (productItem[field] === value) {
              returnValue[index] = productItem;
              index++;
            }
          }
          break;
        default:
          break;
      }
    });
    return returnValue;
  };

  const getAllmatched = (match, value) => {
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
