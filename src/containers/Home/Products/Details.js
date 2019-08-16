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
  } = props;

  const numberHeaders = [
    { key: 'aa', label: 'AA' },
    { key: 'bb', label: 'BB' },
    { key: 'cc', label: 'CC' },
    { key: 'dd', label: 'DD' },
  ];// fixme

  const [numfield, setNumberField] = useState({
    key: '',
    label: '',
  });

  const handleAverage = (numberfield) => {
    setNumberField(numberfield);
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
          <ExportDataSection />
        </CustomSection>
        <CustomSection title="Calculation Average" key="calc_averag  e">
          <CalcAverage value={numfield} onChange={handleAverage} numberFields={numberHeaders} />
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
};
const mapStateToProps = store => ({
  headers: store.productsData.headers,
});
export default connect(
  mapStateToProps,
)(ProductsDetail);
