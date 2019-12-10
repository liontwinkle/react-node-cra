import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import { filterProducts } from 'utils/ruleManagement';
import PreviewProducts from './PreviewProducts';
import PreviewGrid from './PreviewGrid';

import './style.scss';

function RulesTable({ rules, products, productViewType }) {
  const { enqueueSnackbar } = useSnackbar();
  const [preViewState, setPreViewState] = useState(false);
  const [previewProducts, setProducts] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [rulesData, setRulesData] = useState([]);

  useEffect(() => {
    if (rules && rulesData !== rules) {
      const data = [];
      rules.forEach((item, index) => {
        data[index] = filterProducts(products, rules, index);
      });
      setPreviewData(data);
      setRulesData(rules);
    }
  }, [products, rules, setPreviewData, previewData, rulesData]);

  const handleToggle = (key) => () => {
    if (key !== 'close') {
      const data = previewData[key];
      if (data.length === 0) {
        enqueueSnackbar('No Products match this rule.', { variant: 'info', autoHideDuration: 4000 });
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
      {(previewData.length > 0) && (
        <table>
          <thead className="rule-table-thead">
            <tr>
              <th>Rule`s Basis</th>
              <th>Rule`s Refer</th>
              <th>Search By Key</th>
              <th>Search Method</th>
              <th>Rule`s Criteria</th>
              <th>Rule`s Scope</th>
              <th>Rule`s Type</th>
              <th>Preview Matches</th>
            </tr>
          </thead>
          <tbody className="rule-table-tbody">
            {rulesData.map((item, i) => (
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
                    {item.key.label}
                  </label>
                </td>
                <td>
                  <label className="item">
                    {item.type.label}
                  </label>
                </td>
                <td>
                  <label className="item">
                    {item.criteria}
                  </label>
                </td>
                <td>
                  <label className="item">
                    {item.scope.label}
                  </label>
                </td>
                <td>
                  <label className="item">
                    {item.ruleType.label}
                  </label>
                </td>
                <td>
                  <Tooltip
                    title={`Preview ${previewData[i].length} Products for Current Rule`}
                    position="right"
                    arrow
                  >
                    <span onClick={handleToggle(i)}>{previewData[i].length}</span>
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
const mapStateToProps = (store) => ({
  products: store.productsData.data.products,
  productViewType: store.clientsData.productViewType,
});
export default connect(
  mapStateToProps,
)(RulesTable);
