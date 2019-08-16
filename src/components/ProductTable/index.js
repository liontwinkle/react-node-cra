import React from 'react';
import { HotTable } from '@handsontable/react';

import 'handsontable/dist/handsontable.full.css';
import './style.scss';
import { withSnackbar } from 'notistack';

import Loader from 'components/Loader';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { bindActionCreators } from 'redux';
import {
  fetchProducts,
} from 'redux/actions/products';

class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingFlag: true,
    };
  }

  componentDidMount() {
    this.setState({
      fetchingFlag: true,
    });
    this.props.fetchProducts()
      .then(() => {
        this.setState({
          fetchingFlag: false,
        });
        this.props.enqueueSnackbar('Success fetching products data.',
          {
            variant: 'success',
            autoHideDuration: 1000,
          });
      })
      .catch(() => {
        this.props.enqueueSnackbar('Error in fetching products data.',
          {
            variant: 'error',
            autoHideDuration: 4000,
          });
      });
  }

  render() {
    const {
      columns,
      headers,
      products,
    } = this.props;
    return (
      <div id="hot-app">
        {
          (!this.state.fetchingFlag)
            ? (
              <PerfectScrollbar>
                <HotTable
                  data={products}
                  columns={columns}
                  rowHeaders
                  autoWrapRow
                  manualRowResize
                  autoColumnResize
                  colHeaders={headers}
                />
              </PerfectScrollbar>

            )
            : (
              <div className="loader">
                <Loader size="small" color="dark" />
              </div>
            )
        }
      </div>
    );
  }
}

ProductTable.propTypes = {
  fetchProducts: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
};

const mapStateToProps = store => ({
  products: store.productsData.products,
  columns: store.productsData.columns,
  headers: store.productsData.headers,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchProducts,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(ProductTable));
