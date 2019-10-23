import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import ProductTable from 'components/ProductTable';
import ProductGridView from 'components/ProductGridView';

const ProductsTable = forwardRef((props, ref) => (
  <div className="app-tree-container d-flex flex-column">
    {
      props.productViewType.key === 'data'
        ? (<ProductTable tableRef={ref} className="product-table" />)
        : (<ProductGridView className="product-table" />
        )
    }
  </div>
));

ProductsTable.propTypes = {
  productViewType: PropTypes.object.isRequired,
};
export default ProductsTable;
