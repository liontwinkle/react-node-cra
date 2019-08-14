import React from 'react';
import ProductTable from '../../../components/ProductTable';

function ProductsTable() {
  return (
    <div className="app-tree-container d-flex flex-column">
      <ProductTable className="product-table" />
    </div>
  );
}

ProductsTable.propTypes = {
};


export default ProductsTable;
