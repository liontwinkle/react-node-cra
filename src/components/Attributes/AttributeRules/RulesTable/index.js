import React, { useState } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { Tooltip } from 'react-tippy';
import { useSnackbar } from 'notistack';

import { filterProducts } from 'utils/ruleManagement';
import PreviewProducts from '../RulesAction/PreviewProducts';
import PreviewGrid from '../RulesAction/PreviewGrid';

import './style.scss';

function RulesTable({ rules, products, productViewType }) {
  const { enqueueSnackbar } = useSnackbar();

  const [preViewState, setPreViewState] = useState(false);
  const [previewProducts, setProducts] = useState([]);

  const handleToggle = key => () => {
    if (key !== 'close') {
      const data = filterProducts(products, rules, key);
      if (data.length === 0) {
        enqueueSnackbar('No Products match this rule.', {
          variant: 'info',
          autoHideDuration: 4000,
        });
      } else {
        setProducts(data);
        setPreViewState(true);
      }
    } else {
      setPreViewState(false);
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
                    title={`Preview ${filterProducts(products, rules, i).length}Products for Current Rule`}
                    position="right"
                    arrow
                  >
                    <span onClick={handleToggle(i)}>{filterProducts(products, rules, i).length}</span>
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
