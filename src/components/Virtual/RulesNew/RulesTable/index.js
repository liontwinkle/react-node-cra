import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import { filterProducts } from 'utils/ruleManagement';
import PreviewProducts from '../RulesAction/PreviewProducts';
import PreviewGrid from '../RulesAction/PreviewGrid';

import './style.scss';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function RulesTable({ rules, products, productViewType }) {
  const { enqueueSnackbar } = useSnackbar();
  const prevProps = usePrevious({ rules, products, productViewType });
  const [preViewState, setPreViewState] = useState(false);
  const [previewProducts, setProducts] = useState([]);
  const [previewData, setPreviewData] = useState([]);

  useEffect(() => {
    if (rules.length > 0 && prevProps.rules !== rules) {
      const data = [];
      rules.forEach((item, index) => {
        data[index] = filterProducts(products, rules, index);
      });
      setPreviewData(data);
      console.log('### DEBUG DATA: ', data); // fixme
    }
  }, [products, rules, setPreviewData, previewData, prevProps.rules]);

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
          <thead>
            <tr>
              <th>Rule`s Basis</th>
              <th>Rule`s Refer</th>
              <th>Search By Key</th>
              <th>Rule`s Type</th>
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
                    {item.key.label}
                  </label>
                </td>
                <td>
                  <label className="item">
                    {item.match.label}
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
  products: store.categoriesData.preProducts,
  productViewType: store.clientsData.productViewType,
});
export default connect(
  mapStateToProps,
)(RulesTable);
