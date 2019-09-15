import React, { useState } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { Tooltip } from 'react-tippy';
import { useSnackbar } from 'notistack';
import SaveIcon from '@material-ui/icons/Filter';

import { IconButton } from 'components/elements';
import PreviewProducts from '../RulesAction/PreviewProducts';
import PreviewGrid from '../RulesAction/PreviewGrid';
import {
  AddSets,
  formatProductsData,
  getData,
  RuleEngine,
} from '../RuleEngine';

import './style.scss';

function RulesTable({ rules, products, productViewType }) {
  const { enqueueSnackbar } = useSnackbar();

  const [preViewState, setPreViewState] = useState(false);
  const [previewProducts, setProducts] = useState([]);

  const getProducts = (field, match, value) => {
    const rule = RuleEngine[match](value);
    const returnValue = [];
    let index = 0;

    products.forEach((productItem) => {
      if (rule.test(productItem[field])) {
        returnValue[index] = productItem;
        index++;
      }
    });
    return returnValue;
  };

  const getAllmatched = (match, value) => {
    const returnValue = [];
    let index = 0;
    const rule = RuleEngine[match](value);
    products.forEach((proItem) => {
      const values = Object.values(proItem);
      if (values.filter(item => (rule.test(item))).length > 0) {
        returnValue[index] = proItem;
        index++;
      }
    });
    return returnValue;
  };

  const filterProducts = (key) => {
    const field = rules[key].detail.key;
    const match = rules[key].match.key;
    const { value } = rules[key];
    let filterResult = new Set();

    formatProductsData();

    if (field === '*') {
      filterResult = getAllmatched(match, value);
    } else {
      filterResult = getProducts(field, match, value);
    }
    AddSets(filterResult, 'union');
    const filter = Array.from(getData().union);
    setProducts(filter);
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
              <th>Preview Matches</th>
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
  products: store.categoriesData.preProducts,
  productViewType: store.clientsData.productViewType,
});
export default connect(
  mapStateToProps,
)(RulesTable);
