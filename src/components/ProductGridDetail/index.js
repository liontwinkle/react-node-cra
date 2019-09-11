import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSnackbar } from 'notistack';

import { confirmMessage } from 'utils';
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
  const { enqueueSnackbar } = useSnackbar();
  const [fieldData, setFieldData] = useState(productsField);

  const handleShow = (index, value) => {
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

    if (!isUpdating) {
      updateProductsField(newFieldData)
        .then(() => {
          setFieldData(newFieldData);
        })
        .catch(() => {
          confirmMessage(enqueueSnackbar, 'Fields fetching error.', 'error');
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
