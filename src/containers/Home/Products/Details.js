import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { CustomSection } from 'components/elements';
import ExportDataSection from 'components/ProductDetail/exportData';
import './style.scss';
import ShowFields from 'components/ProductDetail/showFields';
import { getProducts } from '../../../utils';

function ProductsDetail(props) {
  const {
    headers,
    products,
    originProducts,
    tableRef,
  } = props;
  const handleExportCsv = () => {
    tableRef.current.hotInstance.getPlugin('exportFile').downloadFile('csv', { filename: 'CSV Export File' });
  };

  const handleExportStr = () => {
    console.log(tableRef.current.hotInstance.getPlugin('exportFile').exportAsString('csv'));
  };

  const handleSaveData = () => {
    // const currentData = tableRef.current.hotInstance.getData();
    // let diffNum = 0;
    // console.log('current Data>>>', currentData);// fixme
    // currentData.forEach((item, key) => {
    //   const compare = Object.values(products[key]);
    //   const diffFilter = _.remove(_.differenceWith(item, compare), null);
    //   if (diffFilter.length > 0) {
    //     diffNum++;
    //   }
    // });
    // console.log('diff_num>>>', diffNum);// fixme
    // console.log(products);
    const diffArray = [];
    console.log('current>>>', products);// fixme
    console.log('original>>>', originProducts);// fixme
    const originArray = getProducts(originProducts).data;
    products.forEach((item, key) => {
      const original = Object.values(originArray[key]);
      const current = Object.values(item);
      const diff = _.remove(_.difference(original, current), null);
      if (diff.length > 0) diffArray.push(item);
      console.log('difference>>>>', diff);// fixme
    });
    console.log('difference>>>>', diffArray);// fixme
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
};
const mapStateToProps = store => ({
  headers: store.productsData.headers,
  numbers: store.productsData.numbers,
  products: store.productsData.products,
  originProducts: store.productsData.originProducts,
});
export default connect(
  mapStateToProps,
)(ProductsDetail);
