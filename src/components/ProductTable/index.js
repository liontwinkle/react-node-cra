import React from 'react';
import { HotTable } from '@handsontable/react';

import 'handsontable/dist/handsontable.full.css';
import './style.scss';

import swansonData from 'data/swansonvitamins_en_products';

class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [],
      colHeaders: [],
    };
  }

  componentWillMount(nextState) {
    console.log(nextState);
    const keys = Object.keys(swansonData[0]);
    const values = Object.values(swansonData[0]);
    console.log('keys>>>>', keys);// fixme
    const headers = keys.map(key => key.toUpperCase());
    const types = values.map((value) => {
      let type = '';
      switch (typeof value) {
        case 'boolean':
          type = 'boolean';
          break;
        case 'number':
          type = 'numeric';
          break;
        case 'object':
        case 'string':
          type = 'string';
          break;
        default:
          type = 'string';
          break;
      }
      return type;
    });
    console.log('keys>>>>', headers);// fixme
    console.log('types>>>>', types);// fixme
    const columns = keys.map((item, key) => ({
      data: item,
      type: types[key],
    }));
    const objects = [];
    swansonData.forEach((dataObj) => {
      const subObject = {};
      const subKeys = Object.keys(dataObj);
      const subValues = Object.values(dataObj);
      subValues.forEach((dataItems, key) => {
        let data = '';
        if (typeof dataItems === 'object') {
          data = JSON.stringify(dataItems);
        } else {
          data = dataItems;
        }
        subObject[subKeys[key]] = data;
      });
      objects.push(subObject);
    });
    console.log('columns>>>>', columns);// fixme
    console.log('objects>>>>', objects);// fixme
    this.setState({
      colHeaders: headers,
      columns,
      data: objects,
    });
  }

  render() {
    console.log('data>>>>', swansonData);// fixme
    return (
      <div id="hot-app">
        {
          (this.state.data.length > 0)
          && (
            <HotTable
              data={this.state.data}
              columns={this.state.columns}
              rowHeaders
              autoWrapRow
              width="1000"
              height="487"
              maxRows="22"
              manualRowResize
              autoColumnResize
              colHeaders={this.state.colHeaders}
            />
          )
        }
      </div>
    );
  }
}

export default ProductTable;
