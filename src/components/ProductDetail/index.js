import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSnackbar } from 'notistack';
import { Tooltip } from 'react-tippy';
import SaveIcon from '@material-ui/icons/Save';

import { confirmMessage } from 'utils';
import { updateProducts, setProducts } from 'redux/actions/products';
import { updateProductsField, setImageKey } from 'redux/actions/productsFields';
import { CustomInput, CustomSection, IconButton } from 'components/elements';
import DisplaySetting from './DisplaySetting';
import ExportDataSection from './ExportDataSection';
import ShowFields from './ShowFields';

import './style.scss';

function ProductsDataDetail({
  headers,
  products,
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
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [fieldData, setFieldData] = useState(productsField);
  const [displayFlag, setDisplayFlag] = useState({
    nullType: false,
    strType: false,
  });
  const [imageKeySet, setImageKeySet] = useState(imageKey);

  const handleExportCsv = () => {
    tableRef.current.hotInstance
      .getPlugin('exportFile')
      .downloadFile('csv', { filename: 'CSV Export File' });
  };

  const handleExportStr = () => {
    console.log(tableRef.current.hotInstance.getPlugin('exportFile')
      .exportAsString('csv'));
  };

  const handleSaveData = () => {
    if (!isUpdatingList && updated.length > 0) {
      updateProducts(updated)
        .then(() => {
          confirmMessage(enqueueSnackbar, 'The data is saved successfully.', 'success');
        })
        .catch(() => {
          const errMsg = 'Error is detected to save the table data1.';
          confirmMessage(enqueueSnackbar, errMsg, 'error');
        });
    } else {
      confirmMessage(enqueueSnackbar, 'The Update data is not exist.', 'error');
    }
  };


  const handleShow = (index, value) => {
    console.log('#DEBUG: UPDATING FLAG ', isUpdating); // fixme
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
          newFieldData[item].data = value;
        }
      });
      setFieldData(newFieldData);

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
          || (updateData[headerItem].grid === undefined)) {
          updateData[headerItem] = {
            data: value,
            grid: true,
          };
        } else {
          updateData[headerItem] = {
            data: value,
            grid: fieldData[headerItem].grid,
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

  const toggleSwitch = field => () => {
    if (!isUpdatingList) {
      let updateData = products;
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

      tableRef.current.hotInstance.loadData(updateData);
      tableRef.current.hotInstance.render();
    }
  };

  const handleImageKeyChange = (event) => {
    setImageKeySet(event.target.value);
  };

  const handleSaveImageKey = () => {
    const caseInsensitiveMatch = new RegExp('http', 'i');
    if (!isFetchingList
      && !isUpdating
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
              <div className="set_imageKey">
                <CustomInput
                  className="mb-3"
                  label="Image Key"
                  inline
                  value={imageKeySet}
                  onChange={handleImageKeyChange}
                />
                <Tooltip
                  title="Preview Products for Current Rule"
                  position="right"
                  arrow
                >
                  <IconButton>
                    <SaveIcon style={{ fontSize: 20 }} onClick={handleSaveImageKey} />
                  </IconButton>
                </Tooltip>
              </div>
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
  updated: PropTypes.array.isRequired,
  isFetchingList: PropTypes.bool.isRequired,
  isUpdatingList: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  imageKey: PropTypes.string.isRequired,
  tableRef: PropTypes.object.isRequired,
  updateProducts: PropTypes.func.isRequired,
  setImageKey: PropTypes.func.isRequired,
  productsField: PropTypes.object.isRequired,
  updateProductsField: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  headers: store.productsData.data.headers,
  products: store.productsData.data.products,
  updated: store.productsData.updatedData,
  isFetchingList: store.productsData.isFetchingList,
  isUpdatingList: store.productsData.isUpdatingList,
  isUpdating: store.productsFieldsData.isUpdating,
  productsField: store.productsFieldsData.productsField,
  originProducts: store.productsData.originProducts,
  imageKey: store.productsFieldsData.imageKey,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateProducts,
  setProducts,
  setImageKey,
  updateProductsField,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductsDataDetail);
