import React, { Component } from 'react';
import { HotTable } from '@handsontable/react';

import { productViewTypes } from 'utils/constants';
import { CustomSelect } from 'components/elements';

import './style.scss';

const products = [
  {
    category: 'A',
    price: '50$',
    year: '1999',
  },
  {
    category: 'B',
    price: '1000$',
    year: 'B.C 200',
  },
];

const headers = ['category', 'price', 'year'];

const columns = [
  { data: 'category', type: 'text' },
  { data: 'price', type: 'text' },
  { data: 'year', type: 'text' },
];

class AttributePreview extends Component {
  state = {
    productViewType: {},
  };

  componentDidMount() {
    this.setState({
      productViewType: { key: 'data', label: 'Product Table' },
    });
  }

  handleChangeProductViewType = (productViewType) => {
    this.setState({
      productViewType,
    });
  };

  render() {
    return (
      <div className="preview-container">
        <CustomSelect
          className="preview-type"
          placeholder="Select View Method"
          value={this.state.productViewType}
          items={productViewTypes}
          onChange={this.handleChangeProductViewType}
        />
        <div className="preview-content">
          { (this.state.productViewType.label === 'Product Table')
            ? (
              <HotTable
                className="product-table"
                root="hot-one"
                licenseKey="non-commercial-and-evaluation"
                settings={{
                  data: products,
                  columns,
                  width: '100%',
                  height: '100%',
                  headerTooltips: true,
                  colHeaders: headers,
                  rowHeaders: true,
                  contextMenu: true,
                  dropdownMenu: true,
                  hiddenColumns: true,
                }}
              />
            ) : (
              <div className="product-images">
                <h1>Product Images Here</h1>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default AttributePreview;
