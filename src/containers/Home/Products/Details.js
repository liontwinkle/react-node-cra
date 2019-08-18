import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { CustomSection } from 'components/elements';
import ExportDataSection from 'components/ProductDetail/exportData';
import './style.scss';
import ShowFields from 'components/ProductDetail/showFields';
import { bindActionCreators } from 'redux';
import { updateProducts, setProducts } from 'redux/actions/products';
import { useSnackbar } from 'notistack';
import { getProducts } from '../../../utils';

function ProductsDetail(props) {
  const {
    headers,
    products,
    originProducts,
    tableRef,
    updateProducts,
    setProducts,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const handleExportCsv = () => {
    tableRef.current.hotInstance.getPlugin('exportFile').downloadFile('csv', { filename: 'CSV Export File' });
  };

  const handleExportStr = () => {
    console.log(tableRef.current.hotInstance.getPlugin('exportFile').exportAsString('csv'));
  };

  const handleSaveData = () => {
    const diffArray = [];
    const originArray = getProducts(originProducts).data;
    products.forEach((item, key) => {
      const original = Object.values(originArray[key]);
      const current = Object.values(item);
      const diffres = _.isEqual(original.sort(), current.sort());
      if (!diffres) diffArray.push(item);
    });
    if (diffArray.length > 0) {
      let duplicateFlag = false;
      diffArray.forEach((item) => {
        const duplicate = _.filter(products, { _id: item._id });
        if (duplicate.length > 1) duplicateFlag = true;
      });
      if (!duplicateFlag) {
        updateProducts(diffArray)
          .then(() => {
            enqueueSnackbar('The data is saved successfly.',
              {
                variant: 'success',
                autoHideDuration: 1500,
              });
          })
          .catch(() => {
            const errMsg = 'Error is detected to save the table data1';
            enqueueSnackbar(errMsg,
              {
                variant: 'error',
                autoHideDuration: 3000,
              });
          });
      } else {
        enqueueSnackbar('The ID is duplicated',
          {
            variant: 'error',
            autoHideDuration: 3000,
          });
      }
    } else {
      const errMsg = 'There is no updated data.';
      enqueueSnackbar(errMsg,
        {
          variant: 'warning',
          autoHideDuration: 3000,
        });
    }
    tableRef.current.hotInstance.loadData(originArray);
    setProducts(originArray);
    tableRef.current.hotInstance.render();
  };

  const handleShow = (index, value) => {
    const showPlugin = tableRef.current.hotInstance.getPlugin('hiddenColumns');
    if (value) {
      showPlugin.hideColumn(index);
    } else {
      showPlugin.showColumn(index);
    }
    tableRef.current.hotInstance.render();
  };
  return (
    <PerfectScrollbar
      options={
        {
          suppressScrollX: true,
          minScrollbarLength: 50,
        }
      }
    >
      <div className="product-details">
        <CustomSection title="Export and Save" key="export_save">
          <ExportDataSection
            onExportCsv={handleExportCsv}
            onExportStr={handleExportStr}
            onSaveData={handleSaveData}
          />
        </CustomSection>
        <CustomSection title="Show Setting" key="show_setting">
          <ShowFields fields={headers} onChange={handleShow} />
        </CustomSection>
      </div>
    </PerfectScrollbar>
  );
}

ProductsDetail.propTypes = {
  headers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  originProducts: PropTypes.array.isRequired,
  tableRef: PropTypes.object.isRequired,
  updateProducts: PropTypes.func.isRequired,
  setProducts: PropTypes.func.isRequired,
};
const mapStateToProps = store => ({
  headers: store.productsData.headers,
  numbers: store.productsData.numbers,
  products: store.productsData.products,
  originProducts: store.productsData.originProducts,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  updateProducts,
  setProducts,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductsDetail);
