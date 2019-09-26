import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Grid } from 'react-virtualized';
import { withSnackbar } from 'notistack';
import $ from 'jquery';
import { fetchProducts } from 'redux/actions/products';
import Loader from 'components/Loader';
import { confirmMessage } from 'utils';
import DetailView from './detail_view';

import './style.scss';

const MAX_LENGTH_NUM = 6;

class ProductGridView extends Component {
  constructor() {
    super();
    this.state = {
      fetchingFlag: false,
      detail: {},
      viewDetailFlag: false,
      pointX: 0,
      pointY: 0,
      width: 0,
      height: 0,
      data: [],
    };
  }

  componentDidMount() {
    this.setState({
      fetchingFlag: true,
    });
    if (this.props.imageKey !== '') {
      if (this.props.filterProducts.length === 0) {
        this.props.fetchProducts()
          .then(() => {
            this.fetchData(this.props.products);
          })
          .catch(() => {
            confirmMessage(this.props.enqueueSnackbar, 'Error in fetching products data.', 'error');
          });
      } else {
        this.fetchData(this.props.filterProducts);
      }
    } else {
      confirmMessage(this.props.enqueueSnackbar, 'Please set the ImageKey at the Table data.', 'error');
    }
  }

  fetchData = (getData) => {
    let temp = [];
    const data = [];
    getData.forEach((item, key) => {
      if (key % MAX_LENGTH_NUM === MAX_LENGTH_NUM - 1) {
        data.push(temp);
        temp = [];
      } else {
        temp.push(item);
      }
    });
    if (temp.length > 0) {
      data.push(temp);
    }
    this.setState({
      fetchingFlag: false,
      data,
    });
    confirmMessage(this.props.enqueueSnackbar, 'Success fetching products data.', 'success');
  };

  displayDetail = (key) => {
    const { top, left } = $(`.grid-item-${key}`)
      .offset();
    let topOffset = top;
    let leftOffset = left;
    if (this.props.filterProducts.length === 0) {
      topOffset += 100;
      leftOffset += 100;
    } else {
      topOffset -= 50;
      leftOffset -= 150;
    }
    const keys = key.split('-');
    const index = parseInt(keys[0], 10) * MAX_LENGTH_NUM + parseInt(keys[1], 10);
    this.setState({
      detail: this.props.products[index],
      viewDetailFlag: true,
      pointX: leftOffset,
      pointY: topOffset,
      width: this.props.hoverSize.width,
      height: this.props.hoverSize.height,
    });
  };

  handleClose = () => {
    this.setState({
      viewDetailFlag: false,
    });
  };

  cellRenderer = ({
    columnIndex, key, rowIndex, style,
  }) => (
    <div
      key={key}
      style={style}
    >
      {this.state.data[rowIndex][columnIndex] && (
        <img
          className={`grid-item-${key}`}
          src={this.state.data[rowIndex][columnIndex][this.props.imageKey]}
          alt="products"
          onMouseEnter={() => this.displayDetail(key)}
        />
      )}
    </div>
  );

  render() {
    const {
      productsField,
      headers,
    } = this.props;

    const {
      viewDetailFlag,
      fetchingFlag,
      detail,
      pointX,
      pointY,
      width,
      height,
      data,
    } = this.state;
    return (
      <div className="grid-view-container">
        {(!fetchingFlag)
          ? (
            <div className="grid-view-content">
              <Grid
                cellRenderer={this.cellRenderer}
                columnCount={MAX_LENGTH_NUM}
                columnWidth={200}
                rowCount={data.length}
                rowHeight={200}
                height={1000}
                width={1200}
              />
            </div>
          ) : (
            <div className="loader">
              <Loader size="small" color="dark" />
            </div>
          )
        }
        {viewDetailFlag && (
          <DetailView
            pointX={pointX}
            headers={headers}
            productsField={productsField}
            detail={detail}
            pointY={pointY}
            width={width}
            height={height}
            close={this.handleClose}
          />
        )}
      </div>
    );
  }
}

ProductGridView.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  imageKey: PropTypes.string.isRequired,
  hoverSize: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  productsField: PropTypes.object.isRequired,
  filterProducts: PropTypes.array,
  headers: PropTypes.array.isRequired,
  fetchProducts: PropTypes.func.isRequired,
};

ProductGridView.defaultProps = {
  filterProducts: [],
};

const mapStateToProps = store => ({
  products: store.productsData.data.products,
  productsField: store.productsFieldsData.productsField,
  headers: store.productsData.data.headers,
  imageKey: store.productsFieldsData.imageKey,
  hoverSize: store.productsFieldsData.hoverSize,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchProducts,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(ProductGridView));
