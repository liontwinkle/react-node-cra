import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';

import _intersection from 'lodash/intersection';
import { setUnionRules } from 'utils/ruleManagement';
import { confirmMessage, getPreFilterData, getRules } from 'utils';
import PreviewProducts from 'components/Virtual/RulesNew/RulesAction/PreviewProducts';


import './style.scss';
import EditAttribute from '../editAttribute';


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
  const handleClick = (event) => {
    console.log(displayEdit); // fixme
    const target = document.getElementsByClassName('context-menu-container');
    const currentX = event.clientX;
    const currentY = event.clientY;
    const infX = info.positionX;
    const sufX = infX + target[0].clientWidth;
    const infY = info.positionY;
    const sufY = infY + target[0].clientHeight;
    if (currentX < infX || currentX > sufX || currentY < infY || currentY > sufY) {
      if (!displayEdit && !displayData) {
        handleClose();
      }
    }
  };
  const getAttributeProducts = () => {
    let filterAttribute = [];
    if (attribute.groupId === '') {
      filterAttribute = attributes.filter(attributeItem => (attributeItem.groupId === attribute._id));
      filterAttribute.push(attribute);
    } else {
      filterAttribute.push(attribute);
    }
    const srcAttributeRules = setUnionRules(filterAttribute);
    const attributeRules = getRules(srcAttributeRules, valueDetails);
    return getPreFilterData(attributeRules.editRules, products);
  };

  const FilterProducts = () => {
    const attributeProducts = getAttributeProducts();
    const categoriesRules = getRules(category.newRules, valueDetails);
    const categoriesData = getPreFilterData(categoriesRules.editRules, products);
    return _intersection(attributeProducts, categoriesData);
  };

  useEffect(() => {
    if (!isActive) {
      setPrefilterData(FilterProducts());
      setActive(true);
    }
    window.addEventListener('click', handleClick);
    return () => { window.removeEventListener('click', handleClick); };
  }, [FilterProducts, handleClick, isActive, setPrefilterData]);

  const handleMenuItem = type => () => {
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

  const handlePreviewClose = type => () => {
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
        style={{
          top: `${info.positionY}px`,
          left: `${info.positionX}px`,
        }}
      >
        <ul>
          {
            menuItem.map(item => (
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
  menuItem: PropTypes.array.isRequired,
  attributes: PropTypes.array.isRequired,
  attribute: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  valueDetails: PropTypes.array.isRequired,
};

const mapStateToProps = store => ({
  attribute: store.attributesData.attribute,
});

export default connect(
  mapStateToProps,
)(ContextMenu);
