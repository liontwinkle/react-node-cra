import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { CustomSection } from 'components/elements';
import ExportDataSection from 'components/ProductDetail/exportData';
import './style.scss';
import CalcAverage from 'components/ProductDetail/calcAverage';
import ShowFields from 'components/ProductDetail/showFields';

function ProductsDetail(props) {
  const {
    headers,
    numbers,
    tableRef,
  } = props;

  // const hot = new Handsontable();
  const [numfield, setNumberField] = useState({
    key: '',
    label: '',
  });

  const handleAverage = (numberfield) => {
    setNumberField(numberfield);
    tableRef.current.calculateAverage(numberfield.label);
  };

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
        <CustomSection title="Calculation Average" key="calc_averag  e">
          <CalcAverage value={numfield} onChange={handleAverage} numberFields={numbers} />
        </CustomSection>
        <CustomSection title="Show Setting" key="show_setting">
          <ShowFields fields={headers} />
        </CustomSection>
      </div>
    </PerfectScrollbar>
  );
}

ProductsDetail.propTypes = {
  headers: PropTypes.array.isRequired,
  numbers: PropTypes.array.isRequired,
  tableRef: PropTypes.object.isRequired,
};
const mapStateToProps = store => ({
  headers: store.productsData.headers,
  numbers: store.productsData.numbers,
});
export default connect(
  mapStateToProps,
)(ProductsDetail);
