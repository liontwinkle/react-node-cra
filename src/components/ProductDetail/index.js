import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { bindActionCreators } from 'redux';
import { useSnackbar } from 'notistack';


import { confirmMessage } from 'utils';
import { updateProducts, setProducts } from 'redux/actions/products';
import { updateProductsField, setImageKey } from 'redux/actions/productsFields';
import { CustomSection } from 'components/elements';
import DisplaySetting from './DisplaySetting';
import ExportDataSection from './ExportDataSection';
import ShowFields from './ShowFields';

import './style.scss';
import SetImageKey from './setImageKey';

function ProductsDataDetail({
  headers,
  products,
  originProducts,
  isFetchingList,
  isUpdatingList,
  isUpdating,
  imageKey,
  tableRef,
  updateProducts,
  setImageKey,
  productsField,
  updated,
  updateProductsField,
  setProducts,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [fieldData, setFieldData] = useState(productsField);
  const [displayFlag, setDisplayFlag] = useState({
    nullType: false,
    strType: false,
  });
  const [updateFg, setUpdateFg] = useState(true);
  const [imageKeySet, setImageKeySet] = useState(imageKey);

  const handleExportCsv = () => {
    const fieldValues = Object.values(productsField);
    const fieldKeys = Object.keys(productsField);
    const checkStatus = [];
    fieldKeys.forEach((keyItem, key) => {
      checkStatus[keyItem] = fieldValues[key].data;
    });
    const updateData = [checkStatus, ...products];
    tableRef.current.hotInstance.loadData(updateData);
    tableRef.current.hotInstance
      .getPlugin('exportFile')
      .downloadFile('csv', { filename: 'CSV Export File' });
    tableRef.current.hotInstance.loadData(products.slice(0, 100));
  };

  const handleExportStr = () => {
    console.log(tableRef.current.hotInstance.getPlugin('exportFile')
      .exportAsString('csv'));
  };

  const handleSaveData = () => {
    if (!isUpdatingList && updated.length > 0) {
      updateProducts(updated)
        .then(() => { confirmMessage(enqueueSnackbar, 'The data is saved successfully.', 'success'); })
        .catch(() => {
          const errMsg = 'Error is detected to save the table data1.';
          confirmMessage(enqueueSnackbar, errMsg, 'error');
        });
    } else { confirmMessage(enqueueSnackbar, 'The Update data is not exist.', 'error'); }
  };


  const handleShow = (index, value) => {
    if (!isUpdating) {
      const newFieldData = JSON.parse(JSON.stringify(productsField));
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
        if (key === index) { newFieldData[item].data = value; }
      });
      setFieldData(newFieldData);
      setTimeout(() => { updateProductsField(newFieldData); }, 500);
    }
  };

  const handleAllUpdate = (type) => {
    if (!isUpdating) {
      const value = (type === 'checked');
      const updateFieldData = JSON.parse(JSON.stringify(productsField));
      headers.forEach((headerItem) => {
        if ((updateFieldData[headerItem] === undefined)
            || (updateFieldData[headerItem].grid === undefined)) {
          updateFieldData[headerItem] = { data: value, grid: true };
        } else {
          updateFieldData[headerItem] = { data: value, grid: fieldData[headerItem].grid };
        }
      });
      setFieldData(updateFieldData);
      setTimeout(() => { updateProductsField(updateFieldData); }, 500);
    }
  };

  const setEmpty = (updateData, type) => {
    const updatedData = [];
    updateData.forEach((item, key) => {
      const keys = Object.keys(item);
      const values = Object.values(item);
      const subData = {};

      values.forEach((subItem, subKey) => {
        if (type === 'strType' && subItem === '') {
          subData[keys[subKey]] = '""';
        } else if (type === 'nullType' && (subItem === 'null' || subItem === null)) {
          subData[keys[subKey]] = '';
        } else {
          subData[keys[subKey]] = subItem;
        }
      });
      updatedData[key] = subData;
    });
    return updatedData;
  };

  const toggleSwitch = (field) => () => {
    if (updateFg) {
      setUpdateFg(false);
      let updateData = JSON.parse(JSON.stringify(originProducts));
      const newDisplaySetting = {
        ...displayFlag,
        [field]: !displayFlag[field],
      };
      setDisplayFlag(newDisplaySetting);

      if (newDisplaySetting.nullType) {
        updateData = setEmpty(updateData, 'nullType');
      }

      if (!newDisplaySetting.strType) {
        updateData = setEmpty(updateData, 'strType');
      }
      setTimeout(() => {
        setUpdateFg(true);
        setProducts(updateData);
      }, 500);
    }
  };

  const handleImageKeyChange = (event) => {
    setImageKeySet(event.target.value);
  };

  const handleSaveImageKey = () => {
    const caseInsensitiveMatch = new ('http', 'i')();
    if (!isFetchingList && !isUpdating
      && products[0][imageKeySet]
      && caseInsensitiveMatch.test(products[0][imageKeySet])) {
      setImageKey(imageKeySet)
        .then(() => {
          confirmMessage(enqueueSnackbar, 'Success to save the Image Key', 'success');
        })
        .catch(() => {
          confirmMessage(enqueueSnackbar, 'Error to save the Image Key', 'error');
        });
    } else {
      confirmMessage(enqueueSnackbar, 'This field does ont include the Image URL', 'error');
    }
  };
  return (
    <PerfectScrollbar>
      {
        !isFetchingList
        && (
          <div className="product-details">
            <CustomSection title="Export and Save" key="export_save">
              <ExportDataSection
                onExportCsv={handleExportCsv}
                onExportStr={handleExportStr}
                onSaveData={handleSaveData}
              />
            </CustomSection>
            <CustomSection title="Display Setting" key="display_setting">
              <DisplaySetting
                nullType={displayFlag.nullType}
                strType={displayFlag.strType}
                onChangeHandle={toggleSwitch}
              />
            </CustomSection>
            <CustomSection title="Setting the ImageKey" key="image_key">
              <SetImageKey
                imageKeySet={imageKeySet}
                handleImageKeyChange={handleImageKeyChange}
                handleSaveImageKey={handleSaveImageKey}
              />
            </CustomSection>
            <CustomSection title="Visible Product Keys" key="show_setting">
              <ShowFields
                fields={headers}
                chkValue={fieldData}
                type="data"
                onChange={handleShow}
                onUpdate={handleAllUpdate}
              />
            </CustomSection>
          </div>
        )
      }
    </PerfectScrollbar>
  );
}

ProductsDataDetail.propTypes = {
  headers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  originProducts: PropTypes.array.isRequired,
  updated: PropTypes.array.isRequired,
  isFetchingList: PropTypes.bool.isRequired,
  isUpdatingList: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  imageKey: PropTypes.string.isRequired,
  tableRef: PropTypes.object.isRequired,
  productsField: PropTypes.object.isRequired,
  updateProducts: PropTypes.func.isRequired,
  setImageKey: PropTypes.func.isRequired,
  updateProductsField: PropTypes.func.isRequired,
  setProducts: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  headers: store.productsData.data.headers,
  products: store.productsData.data.products,
  updated: store.productsData.updatedData,
  isFetchingList: store.productsData.isFetchingList,
  isUpdatingList: store.productsData.isUpdatingList,
  originProducts: store.productsData.originProducts,
  isUpdating: store.productsFieldsData.isUpdating,
  productsField: store.productsFieldsData.productsField,
  imageKey: store.productsFieldsData.imageKey,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateProducts,
  setProducts,
  setImageKey,
  updateProductsField,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductsDataDetail);
