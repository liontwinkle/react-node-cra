import React from 'react';
import { HotTable } from '@handsontable/react';

import 'handsontable/dist/handsontable.full.css';
import './style.scss';
import axios from 'axios';

import Loader from 'components/Loader';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';


class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: true,
      data: [],
      columns: [],
      colHeaders: [],
      // width: window.innerWidth * parseFloat(0.7),
      // height: window.innerHeight * parseFloat(0.9),
    };
  }

  componentDidMount() {
    const { client, type } = this.props;
    axios.get(`data/${client.code}_${type.key}.json`)
      .then((response) => {
        const { data } = response;
        const keys = Object.keys(data[0]);
        const values = Object.values(data[0]);
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
        const objects = [];
        data.forEach((dataObj) => {
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
        this.setState({
          colHeaders: headers,
          columns,
          data: objects,
          flag: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <PerfectScrollbar>
        <div id="hot-app">
          {
            (!this.state.flag)
              ? (

                <HotTable
                  data={this.state.data}
                  columns={this.state.columns}
                  rowHeaders
                  autoWrapRow
                  manualRowResize
                  autoColumnResize
                  colHeaders={this.state.colHeaders}
                />
              )
              : (
                <div className="loader">
                  <Loader size="small" color="dark" />
                </div>
              )
          }
        </div>
      </PerfectScrollbar>
    );
  }
}

ProductTable.propTypes = {
  client: PropTypes.object.isRequired,
  type: PropTypes.object.isRequired,
};

const mapStateToProps = store => ({
  client: store.clientsData.client,
  type: store.clientsData.type,
});

export default connect(
  mapStateToProps,
)(ProductTable);
