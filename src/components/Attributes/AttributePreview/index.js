import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';

import { connect } from 'react-redux';
import { HotTable } from '@handsontable/react';

import { productViewTypes } from 'utils/constants';
import { CustomSelect } from 'components/elements';
import { fetchProducts } from 'redux/actions/products';

import Loader from 'components/Loader';
import { confirmMessage, getPreFilterData } from 'utils';

import './style.scss';

class AttributePreview extends Component {
  state = {
    productViewType: {},
    fetchingFlag: true,
    noneDisplayFlag: false,
  };

  componentDidMount() {
    const {
      attribute,
      nodes,
      products,
      enqueueSnackbar,
    } = this.props;

    if (attribute === null) {
      this.setState({ noneDisplayFlag: true });

      confirmMessage(enqueueSnackbar, 'Please select attribute', 'info');
    } else if (products.length === 0) {
      this.setState({ noneDisplayFlag: false });
      this.setFetchingFlag(true);
      this.props.fetchProducts()
        .then(() => {
          confirmMessage(enqueueSnackbar, 'Success fetching products data.', 'success');
        })
        .catch(() => {
          confirmMessage(this.props.enqueueSnackbar, 'Error in fetching products data.', 'error');
        });
    } else {
      getPreFilterData(attribute, nodes, products);
      this.setState({ noneDisplayFlag: false });
      this.setFetchingFlag(false);
    }
    this.setState({
      productViewType: { key: 'data', label: 'Product Table' },
    });
  }


  componentDidUpdate(prevProps) {
    const {
      attribute,
      nodes,
      products,
    } = this.props;
    if (prevProps.attribute !== attribute || prevProps.products !== products) {
      this.setFetchingFlag(true);
      getPreFilterData(attribute, nodes, products);
      this.setFetchingFlag(false);
    }
  }

  setFetchingFlag = (value) => {
    this.setState({
      fetchingFlag: value,
    });
  };

  handleChangeProductViewType = (productViewType) => {
    this.setState({
      productViewType,
    });
  };

  render() {
    const {
      columns,
      headers,
      products,
    } = this.props;

    const { fetchingFlag, noneDisplayFlag } = this.state;

    return (
      <div className="preview-container">
        <CustomSelect
          className="preview-type"
          placeholder="Select View Method"
          value={this.state.productViewType}
          items={productViewTypes}
          onChange={this.handleChangeProductViewType}
        />
        {!fetchingFlag && !noneDisplayFlag
          ? (
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
                    }}
                  />
                ) : (
                  <div className="product-images">
                    <h1>Product Images Here</h1>
                  </div>
                )
              }
            </div>
          )
          : (
            !noneDisplayFlag
          && (
            <div className="loader">
              <Loader size="small" color="dark" />
            </div>
          )
          )
        }
      </div>
    );
  }
}

AttributePreview.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  attribute: PropTypes.object,
  nodes: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  fetchProducts: PropTypes.func.isRequired,
};

AttributePreview.defaultProps = {
  attribute: {},
};
const mapStateToProps = store => ({
  attribute: store.attributesData.attribute,
  nodes: store.attributesData.nodes,
  products: store.productsData.data.products,
  columns: store.productsData.data.columns,
  headers: store.productsData.data.headers,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchProducts,
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(AttributePreview));
