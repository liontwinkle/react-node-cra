import React from 'react';
import { HotTable } from '@handsontable/react';

import 'handsontable/dist/handsontable.full.css';
import './style.scss';

class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.data = [
      ['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
      ['2016', 10, 11, 12, 13],
      ['2017', 20, 11, 14, 13],
      ['2018', 30, 15, 12, 13],
    ];
  }

  render() {
    return (
      <div id="hot-app">
        <HotTable
          data={this.data}
          colHeaders
          rowHeaders
          width="100%"
          height="300"
          colWidths="100%"
          manualColumnResize
        />
      </div>
    );
  }
}

export default ProductTable;
