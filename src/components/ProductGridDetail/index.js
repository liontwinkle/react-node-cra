import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { updateProductsField } from 'redux/actions/productsFields';
import { CustomSection } from 'components/elements';
import ShowFields from 'components/ProductDetail/ShowFields';

import './style.scss';

function ProductsGridDetail({
  headers,
  productsField,
  updateProductsField,
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
          newFieldData[item] = {
            data: true,
            grid: true,
          };
        } else if (newFieldData[item].data === undefined) {
          newFieldData[item] = {
            data: true,
            grid: newFieldData[item].grid,
          };
        } else if (newFieldData[item].grid === undefined) {
          newFieldData[item] = {
            data: newFieldData[item].data,
            grid: true,
          };
        }
        if (key === index) {
          newFieldData[item].grid = value;
        }
      });
      updateProductsField(newFieldData);
    }
  };

  const handleAllUpdate = (type) => {
    console.log('#DEBUG: UPDATING FLAG ', isUpdating); // fixme
    if (!isUpdating) {
      const time2 = performance.now();
      const value = (type === 'checked');
      const updateData = JSON.parse(JSON.stringify(fieldData));
      headers.forEach((headerItem) => {
        if ((updateData[headerItem] === undefined)
          || (updateData[headerItem].data === undefined)) {
          updateData[headerItem] = {
            data: true,
            grid: value,
          };
        } else {
          updateData[headerItem] = {
            data: fieldData[headerItem].grid,
            grid: value,
          };
        }
      });
      setFieldData(updateData);
      console.log('# DEBUG RUNNING TIME BEFORE SEND API: ', performance.now() - time2);
      updateProductsField(updateData)
        .then(() => {
          console.log('# DEBUG RUNNING TIME GETTING RESP: ', performance.now() - time2);
        });
    }
  };


  return (
    <PerfectScrollbar>
      <div className="product-details">
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
  updateProductsField: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  headers: store.productsData.data.headers,
  isUpdating: store.productsFieldsData.isUpdating,
  isFetchingList: store.productsData.isFetchingList,
  productsField: store.productsFieldsData.productsField,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateProductsField,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductsGridDetail);
