import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import ProductsDataDetail from 'components/ProductDetail';
import ProductsGridDetail from 'components/ProductGridDetail';

const ProductsDetail = forwardRef((props, ref) => (
  <div className="product-details">
    {
      props.productViewType.key === 'data'
        ? (<ProductsDataDetail tableRef={ref} />)
        : (<ProductsGridDetail />)
    }
  </div>
));

ProductsDetail.propTypes = {
  productViewType: PropTypes.object.isRequired,
};

export default ProductsDetail;
