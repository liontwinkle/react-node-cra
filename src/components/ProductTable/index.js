import React from 'react';
import { HotTable } from '@handsontable/react';

import 'handsontable/dist/handsontable.full.css';
import './style.scss';

import swansonData from 'data/swansonvitamins_en_products';
// import eddieData from 'data/eddiebauer_en_products';
import Loader from 'components/Loader';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';


class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: true,
      data: [],
      columns: [],
      colHeaders: [],
      width: window.innerWidth * parseFloat(0.7),
      height: window.innerHeight * parseFloat(0.9),
    };
  }

  componentDidMount() {
    // const data = require(`data/${this.props.client.code}_${this.props.type}`);
    const keys = Object.keys(swansonData[0]);
    const values = Object.values(swansonData[0]);
    console.log('keys>>>>', keys);// fixme
    const headers = keys.map(key => key.toUpperCase());
    const columns = [];
    values.forEach((value, key) => {
      let type = {};
      switch (typeof value) {
        case 'boolean':
          type = {
            data: keys[key],
            type: 'checkbox',
          };
          break;
        case 'number':
          type = {
            data: keys[key],
            type: 'numeric',
          };
          break;
        case 'date':
          type = {
            data: keys[key],
            type: 'date',
            dateFormat: 'MM/DD/YYYY',
          };
          break;
        case 'object':
        case 'string':
          type = {
            data: keys[key],
            type: 'text',
          };
          break;
        default:
          type = {
            data: keys[key],
          };
          break;
      }
      columns.push(type);
    });
    console.log('keys>>>>', headers);// fixme
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
      flag: false,
    });
  }

  render() {
    return (
      <div id="hot-app">
        {
          (!this.state.flag)
            ? (
              <HotTable
                data={this.state.data}
                columns={this.state.columns}
                rowHeaders
                autoWrapRow
                width={this.state.width}
                height={this.state.height}
                manualRowResize
                autoColumnResize
                colHeaders={this.state.colHeaders}
              />
            )
            : (
              <Loader size="big" color="dark" />
            )
        }
      </div>
    );
  }
}

// ProductTable.propTypes = {
//   client: PropTypes.object,
//   type: store.clientsData.type,
//
// };

const mapStateToProps = store => ({
  client: store.clientsData.client,
  type: store.clientsData.type,
});

export default connect(
  mapStateToProps,
)(ProductTable);
