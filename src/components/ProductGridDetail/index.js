import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { updateProductsField, setSizeSet } from 'redux/actions/productsFields';
import { CustomInput, CustomSection } from 'components/elements';
import ShowFields from 'components/ProductDetail/ShowFields';

import './style.scss';

function ProductsGridDetail({
  headers,
  hoverSize,
  productsField,
  updateProductsField,
  setSizeSet,
  isUpdating,
  isFetchingList,
}) {
  const [fieldData, setFieldData] = useState(productsField);
  const handleShow = (index, value) => {
    if (!isUpdating) {
      const newFieldData = fieldData;
      headers.forEach((item, key) => {
        if (
          newFieldData[item] === undefined
          || (newFieldData[item].data === undefined
          && newFieldData[item].grid === undefined)
        ) {
          newFieldData[item] = { data: true, grid: true };
        } else if (newFieldData[item].data === undefined) {
          newFieldData[item] = { data: true, grid: newFieldData[item].grid };
        } else if (newFieldData[item].grid === undefined) {
          newFieldData[item] = { data: newFieldData[item].data, grid: true };
        }
        if (key === index) { newFieldData[item].grid = value; }
      });
      updateProductsField(newFieldData);
    }
  };

  const handleAllUpdate = (type) => {
    if (!isUpdating) {
      const value = (type === 'checked');
      const updateData = JSON.parse(JSON.stringify(fieldData));
      headers.forEach((headerItem) => {
        if ((updateData[headerItem] === undefined)
          || (updateData[headerItem].data === undefined)) {
          updateData[headerItem] = { data: true, grid: value };
        } else {
          updateData[headerItem] = { data: fieldData[headerItem].grid, grid: value };
        }
      });
      setFieldData(updateData);
      updateProductsField(updateData);
    }
  };

  const handleSizeInput = (type) => (event) => {
    const size = JSON.parse(JSON.stringify(hoverSize));
    size[type] = event.target.value;
    setSizeSet(size);
  };
  return (
    <PerfectScrollbar>
      <div className="product-details">
        <CustomSection title="Setting Hover Size" key="show_setting_size">
          <CustomInput
            className="mb-3"
            label="Hover Width(px)"
            key="width"
            inline
            value={hoverSize.width}
            onChange={handleSizeInput('width')}
          />
          <CustomInput
            className="mb-3"
            label="Hover Height(px)"
            key="height"
            inline
            value={hoverSize.height}
            onChange={handleSizeInput('height')}
          />
        </CustomSection>
        <CustomSection title="Show Fields Setting on Hover" key="show_setting">
          {
            !isFetchingList
              ? (
                <ShowFields
                  type="grid"
                  fields={headers}
                  chkValue={fieldData}
                  onChange={handleShow}
                  onUpdate={handleAllUpdate}
                />
              ) : null
          }
        </CustomSection>
      </div>
    </PerfectScrollbar>
  );
}

ProductsGridDetail.propTypes = {
  headers: PropTypes.array.isRequired,
  isFetchingList: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  productsField: PropTypes.object.isRequired,
  hoverSize: PropTypes.object.isRequired,
  updateProductsField: PropTypes.func.isRequired,
  setSizeSet: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  headers: store.productsData.data.headers,
  isUpdating: store.productsFieldsData.isUpdating,
  isFetchingList: store.productsData.isFetchingList,
  productsField: store.productsFieldsData.productsField,
  hoverSize: store.productsFieldsData.hoverSize,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateProductsField,
  setSizeSet,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductsGridDetail);
