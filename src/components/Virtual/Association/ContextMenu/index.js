import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';

import _intersection from 'lodash/intersection';
import { setUnionRules, getRules } from 'utils/ruleManagement';
import { confirmMessage, getPreFilterData } from 'utils';
import PreviewProducts from 'components/Virtual/RulesNew/RulesAction/PreviewProducts';
import EditAttribute from '../editAttribute';

import './style.scss';


function ContextMenu({
  open,
  handleClose,
  info,
  menuItem,
  attributes,
  attribute,
  category,
  products,
  valueDetails,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [prefilterData, setPrefilterData] = useState([]);
  const [displayData, setDisplayData] = useState(false);
  const [displayEdit, setDisplayEdit] = useState(false);
  const [isActive, setActive] = useState(false);

  const handleClick = useCallback((event) => {
    const target = document.getElementsByClassName('context-menu-container');
    const infX = info.positionX;
    const sufX = infX + target[0].clientWidth;
    const infY = info.positionY;
    const sufY = infY + target[0].clientHeight;
    if (event.clientX < infX || event.clientX > sufX || event.clientY < infY || event.clientY > sufY) {
      if (!displayEdit && !displayData) { handleClose(); }
    }
  }, [displayData, displayEdit, handleClose, info.positionX, info.positionY]);
  const getAttributeProducts = useCallback(() => {
    let filterAttribute = [];
    if (attribute.groupId === 'null') {
      filterAttribute = attributes.filter((attributeItem) => (
        attributeItem.groupId === attribute.attributeId.toString()));
      filterAttribute.push(attribute);
    } else {
      filterAttribute.push(attribute);
    }
    const srcAttributeRules = setUnionRules(filterAttribute);
    const attributeRules = getRules(srcAttributeRules, valueDetails);
    return getPreFilterData(attributeRules.editRules, products);
  }, [attribute, attributes, products, valueDetails]);

  const FilterProducts = useCallback(() => {
    const attributeProducts = getAttributeProducts();
    const categoriesRules = getRules(category.rules, valueDetails);
    const categoriesData = getPreFilterData(categoriesRules.editRules, products);
    return _intersection(attributeProducts, categoriesData);
  }, [category.rules, getAttributeProducts, products, valueDetails]);

  useEffect(() => {
    if (!isActive) {
      setPrefilterData(FilterProducts());
      setActive(true);
    }
    window.addEventListener('click', handleClick);
    return () => { window.removeEventListener('click', handleClick); };
  }, [FilterProducts, handleClick, isActive, setPrefilterData]);

  const handleMenuItem = (type) => () => {
    if (type === 'match') {
      if (prefilterData.length > 0) {
        setDisplayData(true);
      } else {
        confirmMessage(enqueueSnackbar, 'Matching data is not exist', 'info');
      }
    } else {
      setDisplayEdit(true);
    }
  };

  const handlePreviewClose = (type) => () => {
    if (type === 'match') {
      setDisplayData(false);
    } else {
      setDisplayEdit(false);
    }
    handleClose();
  };
  return (
    open
    && (
      <div
        className="context-menu-container"
        style={{ top: `${info.positionY}px`, left: `${info.positionX}px` }}
      >
        <ul>
          {
            menuItem.map((item) => (
              <li key={item.key} onClick={handleMenuItem(item.key)}>
                {
                  (item.key !== 'match') ? item.label : `${item.label}(${prefilterData.length})`
                }
              </li>
            ))
          }
        </ul>
        {
          displayData
          && (
            <PreviewProducts
              open={displayData}
              handleClose={handlePreviewClose('match')}
              filterProducts={prefilterData}
            />
          )
        }
        {
          displayEdit && (
            <EditAttribute open={displayEdit} handleClose={handlePreviewClose('edit')} attribute={attribute} />
          )
        }
      </div>
    )
  );
}

ContextMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  info: PropTypes.object.isRequired,
  attribute: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  menuItem: PropTypes.array.isRequired,
  attributes: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  valueDetails: PropTypes.array.isRequired,
};

const mapStateToProps = (store) => ({
  attribute: store.attributesData.attribute,
});

export default connect(
  mapStateToProps,
)(ContextMenu);
