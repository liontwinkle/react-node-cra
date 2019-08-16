import React from 'react';
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
        <CustomSection title="Show Setting" key="show_setting">
          <ShowFields fields={headers} />
        </CustomSection>
        <CustomSection title="Calculation Average" key="calc_average">
          <CalcAverage />
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
