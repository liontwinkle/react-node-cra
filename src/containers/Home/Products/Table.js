import React, { forwardRef } from 'react';

// import ProductTable from 'components/ProductTable';
import ProductGridView from 'components/ProductGridView';

const ProductsTable = forwardRef((props, ref) => (
  <div className="app-tree-container d-flex flex-column">
    {/* <ProductTable tableRef={ref} className="product-table" /> */}
    <ProductGridView tableRef={ref} className="product-table" />
  </div>
));

export default ProductsTable;
