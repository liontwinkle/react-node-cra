import React, { useState } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';

import './style.scss';
import { IconButton } from 'components/elements';
import SaveIcon from '@material-ui/icons/Filter';
import { Tooltip } from 'react-tippy';
import { useSnackbar } from 'notistack';
import PreviewProducts from '../RulesAction/PreviewProducts';

function RulesTable(props) {
  const { enqueueSnackbar } = useSnackbar();
  const {
    rules,
    products,
  } = props;

  const [preViewState, setPreViewState] = useState(false);
  const [previewProducts, setProducts] = useState([]);

  const getProducts = (field, match, value, store) => {
    const caseItensitiveMatch = new RegExp(`${value}`, 'i');
    const caseSensitiveMatch = new RegExp(`${value}`);
    products.forEach((productItem) => {
      switch (match) {
        case ':=':
          if (productItem[field] === value) {
            store.push(productItem);
          }
          break;
        case '::':
          if (caseItensitiveMatch.test(productItem[field])) {
            store.push(productItem);
          }
          break;
        case ':':
          if (caseSensitiveMatch.test(productItem[field])) {
            store.push(productItem);
          }
          break;
        case ':<=':
          if (typeof productItem[field]) {
            const checkVal = parseInt(productItem[field], 10);
            if (checkVal <= value) {
              store.push(productItem);
            }
          }
          break;
        case ':>=':
          if (typeof productItem[field]) {
            const checkVal = parseInt(productItem[field], 10);
            if (checkVal >= value) {
              store.push(productItem);
            }
          }
          break;
        case ':<':
          if (typeof productItem[field]) {
            const checkVal = parseInt(productItem[field], 10);
            if (checkVal < value) {
              store.push(productItem);
            }
          }
          break;
        case ':>':
          if (typeof productItem[field]) {
            const checkVal = parseInt(productItem[field], 10);
            if (checkVal > value) {
              store.push(productItem);
            }
          }
          break;
        case ':==':
          if (typeof productItem[field]) {
            const checkVal = parseInt(productItem[field], 10);
            if (checkVal === value) {
              store.push(productItem);
            }
          }
          break;
        default:
          break;
      }
    });
  };

  const filterProducts = (key) => {
    const filter = [];
    const field = rules[key].detail.key;
    const match = rules[key].match.key;
    const { value } = rules[key];
    getProducts(field, match, value, filter);
    setProducts(filter);
    return filter.length;
  };

  const handleToggle = (key) => {
    if (key !== 'close' && filterProducts(key) === 0) {
      enqueueSnackbar('Matching Data is not exists.',
        {
          variant: 'info',
          autoHideDuration: 4000,
        });
    } else {
      setPreViewState(!preViewState);
    }
  };
  return (
    <div className="mg-rule-actions d-flex flex-column align-items-center">
      {
        (rules.length > 0)
        && (
          <table>
            <thead>
              <tr>
                <th>Rule`s Basis</th>
                <th>Rule`s Refer</th>
                <th>Search By Key</th>
                <th>Rule`s Value</th>
                <th>Rule`s Criteria</th>
                <th>Rule`s Scope</th>
                <th>Project`s Preview</th>
              </tr>
            </thead>
            <tbody>
              {
                rules.map((item, i) => (
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
                          <SaveIcon style={{ fontSize: 20 }} onClick={() => handleToggle(i)} />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        )
      }
      {preViewState && (
        <PreviewProducts
          open={preViewState}
          handleClose={() => handleToggle('close')}
          filterProducts={previewProducts}
        />
      )}
    </div>
  );
}

RulesTable.propTypes = {
  rules: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
};
const mapStateToProps = store => ({
  products: store.productsData.products,
});
export default connect(
  mapStateToProps,
)(RulesTable);
