import React from 'react';
import { connect } from 'react-redux';
import { Container, Section, Bar } from 'react-simple-resizer';
import PropTypes from 'prop-types';

import { VirtualTree, VirtualDetail } from './Virtual';
import { AttributeTree, AttributeContent } from './Attributes';
import { ProductsTable, ProductsDetail } from './Products';

import './style.scss';

function Home({
  type,
  category,
  attribute,
  productViewType,
}) {
  const value = type && type.key;
  const tableRef = React.createRef();

  return (
    <div className="app-container">
      <Container>
        <Section minSize={(value === 'products') ? '70%' : '35%'} defaultSize={(value === 'products') ? 700 : 350}>
          {(value === 'virtual' || value === 'native') && <VirtualTree />}
          {(value === 'attributes') && <AttributeTree />}
          {(value === 'products') && <ProductsTable ref={tableRef} productViewType={productViewType} />}
        </Section>

        <Bar className="resizer" size={8} />

        <Section minSize={(value === 'products') ? '30%' : '65%'}>
          <>
            {value === 'products' && (
              <ProductsDetail ref={tableRef} productViewType={productViewType} />
            )}
            {attribute && value === 'attributes' && (
              <AttributeContent />
            )}
            {category && (value === 'virtual' || value === 'native') && (
              <VirtualDetail />
            )}
          </>
        </Section>
      </Container>
    </div>
  );
}

Home.propTypes = {
  type: PropTypes.object,
  productViewType: PropTypes.object,
  category: PropTypes.object,
  attribute: PropTypes.object,
};

Home.defaultProps = {
  type: null,
  productViewType: null,
  category: null,
  attribute: null,
};

const mapStateToProps = (store) => ({
  type: store.clientsData.type,
  productViewType: store.clientsData.productViewType,
  category: store.categoriesData.category,
  attribute: store.attributesData.attribute,
});

export default connect(mapStateToProps)(Home);
