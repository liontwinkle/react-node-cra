import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { CustomSection } from 'components/elements';
import ExportDataSection from 'components/ProductDetail/exportData';
import DisplaySetting from 'components/ProductDetail/displaySetting';
import './style.scss';
import ShowFields from 'components/ProductDetail/showFields';
import { bindActionCreators } from 'redux';
import { updateProducts, setProducts } from 'redux/actions/products';
import { updateProductsField } from 'redux/actions/productsFields';
import { useSnackbar } from 'notistack';
import { getProducts } from '../../../utils';

function ProductsDetail(props) {
  const {
    headers,
    products,
    originProducts,
    tableRef,
    updateProducts,
    setProducts,
    productsField,
    updateProductsField,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [fieldData, setFieldData] = useState(productsField);
  const [displayFlag, setDisplayFlag] = useState({
    nullType: false,
    strType: false,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      const tableObj = tableRef.current;
      if (tableObj !== null) {
        clearInterval(interval);
        const showPlugin = tableObj.hotInstance.getPlugin('hiddenColumns');
        const hiddenColumns = [];
        headers.forEach((item, key) => {
          if (!fieldData[item] && (fieldData[item] !== undefined)) hiddenColumns.push(key);
        });
        showPlugin.hideColumns(hiddenColumns);
        tableObj.hotInstance.render();
      }
    }, 1000);
  }, [fieldData, headers, tableRef]);
  const handleExportCsv = () => {
    tableRef.current.hotInstance.getPlugin('exportFile').downloadFile('csv', { filename: 'CSV Export File' });
  };

  const handleExportStr = () => {
    console.log(tableRef.current.hotInstance.getPlugin('exportFile').exportAsString('csv'));
  };

  const handleSaveData = () => {
    const diffArray = [];
    const originArray = getProducts(originProducts).data;
    products.forEach((item, key) => {
      const original = Object.values(originArray[key]);
      const current = Object.values(item);
      const diffres = _.isEqual(original.sort(), current.sort());
      if (!diffres) diffArray.push(item);
    });
    if (diffArray.length > 0) {
      let duplicateFlag = false;
      diffArray.forEach((item) => {
        const duplicate = _.filter(products, { _id: item._id });
        if (duplicate.length > 1) duplicateFlag = true;
      });
      if (!duplicateFlag) {
        updateProducts(diffArray)
          .then(() => {
            enqueueSnackbar('The data is saved successfly.',
              {
                variant: 'success',
                autoHideDuration: 1500,
              });
          })
          .catch(() => {
            const errMsg = 'Error is detected to save the table data1';
            enqueueSnackbar(errMsg,
              {
                variant: 'error',
                autoHideDuration: 3000,
              });
          });
      } else {
        enqueueSnackbar('The ID is duplicated',
          {
            variant: 'error',
            autoHideDuration: 3000,
          });
      }
    } else {
      const errMsg = 'There is no updated data.';
      enqueueSnackbar(errMsg,
        {
          variant: 'warning',
          autoHideDuration: 3000,
        });
    }
    tableRef.current.hotInstance.loadData(originArray);
    setProducts(originArray);
    tableRef.current.hotInstance.render();
  };


  const handleShow = (index, value) => {
    const showPlugin = tableRef.current.hotInstance.getPlugin('hiddenColumns');
    if (value) {
      showPlugin.showColumn(index);
    } else {
      showPlugin.hideColumn(index);
    }
    tableRef.current.hotInstance.render();
    const newFieldData = fieldData;
    headers.forEach((item, key) => {
      if (key !== index) {
        newFieldData[item] = (newFieldData[item] === undefined) ? true : newFieldData[item];
      } else {
        newFieldData[item] = value;
      }
    });
    updateProductsField(newFieldData)
      .then(() => {
        setFieldData(newFieldData);
      })
      .catch(() => {
        enqueueSnackbar('Fields fetching error.',
          {
            variant: 'warning',
            autoHideDuration: 3000,
          });
      });
  };

  const setEmpty = (updateData, type) => {
    const updatedData = [];
    updateData.forEach((item) => {
      const keys = Object.keys(item);
      const values = Object.values(item);
      const subData = {};
      values.forEach((subItem, subKey) => {
        if (subItem === 'null' || subItem === null || subItem === '') {
          if (type === 'strType') {
            subData[keys[subKey]] = '""';
          } else if (type === 'nullType') {
            subData[keys[subKey]] = '';
          }
        } else {
          subData[keys[subKey]] = subItem;
        }
      });
      updatedData.push(subData);
    });
    return updatedData;
  };
  const toggleSwitch = field => () => {
    let updateData = products;
    const newDisplaySetting = {
      ...displayFlag,
      [field]: !displayFlag[field],
    };
    setDisplayFlag(newDisplaySetting);
    if (newDisplaySetting.nullType) {
      updateData = setEmpty(updateData, 'nullType');
    }

    if (newDisplaySetting.strType) {
      updateData = setEmpty(updateData, 'strType');
    }
    tableRef.current.hotInstance.loadData(updateData);
    tableRef.current.hotInstance.render();
    // tableRef.current.hotInstance.loadData(originArray);
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
        <CustomSection title="Display Setting" key="display_setting">
          <DisplaySetting
            nullType={displayFlag.nullType}
            strType={displayFlag.strType}
            onChangeHandle={toggleSwitch}
          />
        </CustomSection>
        <CustomSection title="Show Column Setting" key="show_setting">
          <ShowFields
            fields={headers}
            chkValue={fieldData}
            onChange={handleShow}
          />
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
  updateProducts: PropTypes.func.isRequired,
  setProducts: PropTypes.func.isRequired,
  productsField: PropTypes.object.isRequired,
  updateProductsField: PropTypes.func.isRequired,
};
const mapStateToProps = store => ({
  headers: store.productsData.headers,
  numbers: store.productsData.numbers,
  products: store.productsData.products,
  productsField: store.productsFieldsData.productsField,
  originProducts: store.productsData.originProducts,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  updateProducts,
  setProducts,
  updateProductsField,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductsDetail);
