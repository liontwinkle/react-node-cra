import React, { forwardRef } from 'react';

import ProductTable from 'components/ProductTable';

const ProductsTable = forwardRef((props, ref) => (
  <div className="app-tree-container d-flex flex-column">
    <ProductTable tableRef={ref} className="product-table" />
  </div>
));

export default ProductsTable;
