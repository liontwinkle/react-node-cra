import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { CustomSection } from 'components/elements';
import ExportDataSection from 'components/ProductDetail/exportData';
import './style.scss';
import ShowFields from 'components/ProductDetail/showFields';

function ProductsDetail(props) {
  const {
    headers,
    tableRef,
  } = props;
  const handleExportCsv = () => {
    console.log(tableRef);// fixme
    console.log('csv');// fixme

    tableRef.current.hotInstance.getPlugin('exportFile').downloadFile('csv', { filename: 'CSV Export File' });
  };

  const handleExportStr = () => {
    console.log('str');
    console.log(tableRef.current.hotInstance.getPlugin('exportFile').exportAsString('csv'));
  };

  const handleSaveData = () => {
    console.log(tableRef.current.hotInstance.getData());
  };

  const handleShow = (index, value) => {
    console.log(value, 'Sdfsdf', index); // fixme
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
      options={{
        suppressScrollX: true,
        minScrollbarLength: 50,
      }}
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
  tableRef: PropTypes.object.isRequired,
};
const mapStateToProps = store => ({
  headers: store.productsData.headers,
  numbers: store.productsData.numbers,
});
export default connect(
  mapStateToProps,
)(ProductsDetail);
