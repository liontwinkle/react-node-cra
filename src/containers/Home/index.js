import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Section, Bar } from 'react-simple-resizer';

import { VirtualTree, VirtualDetail } from './Virtual';
import { ProductsTable, ProductsDetail } from './Products';

import './style.scss';

function Home({
  type,
  category,
  productViewType,
}) {
  const value = type && type.key;
  const tableRef = React.createRef();

  return (
    <div className="app-container">
      <Container>
        <Section minSize={(value === 'products') ? '70%' : '35%'} defaultSize={(value === 'products') ? 700 : 350}>
          {(value === 'virtual' || value === 'native') && <VirtualTree />}
          {(value === 'products') && <ProductsTable ref={tableRef} productViewType={productViewType} />}
        </Section>

        <Bar className="resizer" size={8} />

        <Section minSize={(value === 'products') ? '30%' : '65%'}>
          <Fragment>
            {value === 'products' && (
              <ProductsDetail ref={tableRef} productViewType={productViewType} />
            )}
            {category && (value === 'virtual' || value === 'native') && (
              <VirtualDetail />
            )}
          </Fragment>
        </Section>
      </Container>
    </div>
  );
}

Home.propTypes = {
  type: PropTypes.object,
  productViewType: PropTypes.object,
  category: PropTypes.object,
};

Home.defaultProps = {
  type: null,
  productViewType: null,
  category: null,
};

const mapStateToProps = store => ({
  type: store.clientsData.type,
  productViewType: store.clientsData.productViewType,
  category: store.categoriesData.category,
});

export default connect(mapStateToProps)(Home);
