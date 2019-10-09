import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CheckboxTree from 'react-checkbox-tree-enhanced';

import _union from 'lodash/union';
import _difference from 'lodash/difference';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { fetchAttributes, updateAttribute, setAttribute } from 'redux/actions/attribute';
import { fetchProducts } from 'redux/actions/products';
import { setHandler } from 'utils';
import { getNewAppearData, getAllChildData } from 'utils/attributeManagement';
import Loader from 'components/Loader';
import ContextMenu from './ContextMenu';

import './style.scss';

function Association({
  category,
  categories,
  nodes,
  attributes,
  products,
  valueDetails,
  fetchProducts,
  updateAttribute,
  fetchAttributes,
  setAttribute,
  client,
  associationAttributes,
  isFetchingList,
}) {
  const menuItem = [
    { label: 'EDIT ATTRIBUTE', key: 'edit' },
    { label: 'MATCHED PRODUCTS', key: 'match' },
  ];
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [context, setContext] = useState([]);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [info, setInfo] = useState({
    label: '',
    id: '',
    positionX: 0,
    positionY: 0,
  });
  const handleClose = () => {
    setDisplayMenu(false);
  };
  const handleClick = useCallback((event) => {
    handleClose();
    event.preventDefault();
    const strId = event.path[2].id.split('-');
    const attributeId = strId[strId.length - 1];
    const attribute = attributes.find(attributeItem => (attributeItem._id === attributeId));
    setAttribute(attribute);
    setInfo({
      label: event.target.innerText,
      id: attributeId,
      positionX: event.clientX,
      positionY: event.clientY + 10,
    });
    setDisplayMenu(true);
  }, [attributes, setAttribute, setDisplayMenu, setInfo]);

  useEffect(() => {
    if (category) {
      const updateChecked = [];
      attributes.forEach((attrItem) => {
        if (attrItem.appear.find(appearItem => (appearItem === category._id))) {
          updateChecked.push(attrItem._id);
        }
      });
      setChecked(updateChecked);
    }
    if (products.length === 0 && !isFetchingList) { fetchProducts(); }
    if (context.length > 0) { setHandler(context, handleClick); }
    setContext(document.getElementsByClassName('rct-title'));
  }, [category, attributes, setChecked, context, products, fetchProducts, handleClick, isFetchingList]);


  const handleExpanded = (expanded) => {
    setExpanded(expanded);
    setTimeout(() => {
      const newContext = document.getElementsByClassName('rct-title');
      setContext(newContext);
      setHandler(newContext, handleClick);
    }, 0);
  };

  const handleAttributeChange = (checked, nodeTarget) => {
    const targetAppear = attributes.filter(attrItem => (attrItem._id === nodeTarget.value))[0];

    let checkGrp = false;
    let appearData = [];
    const willCheckedCategory = getNewAppearData(categories, targetAppear.appear, category);
    const allChildData = getAllChildData(categories, category);
    willCheckedCategory.push(category._id);
    const updateNewAppear = _union(willCheckedCategory, allChildData);

    if (nodeTarget.checked) {
      appearData = _union(targetAppear.appear, updateNewAppear);
      if (targetAppear.groupId) {
        const includeCategoryList = attributes.filter(
          attrItem => (!!attrItem.appear.find(
            (arrItem => (arrItem === category._id)),
          ) && (attrItem.groupId === targetAppear.groupId)),
        );
        const groupList = attributes.filter(attrItem => (attrItem.groupId === targetAppear.groupId));
        if (includeCategoryList.length === groupList.length - 1) {
          checkGrp = true;
        }
      }
    } else {
      appearData = _difference(targetAppear.appear, updateNewAppear);
    }

    if (checkGrp) {
      const groupAdd = attributes.filter(attrItem => (attrItem._id === targetAppear.groupId))[0];
      const groupAddAppear = groupAdd.appear;
      groupAddAppear.push(category._id);
      updateAttribute(targetAppear.groupId, { appear: groupAddAppear })
        .then(() => { fetchAttributes(client.id, 'attributes'); });
    } else {
      updateAttribute(targetAppear._id, { appear: appearData, checked: nodeTarget.checked })
        .then(() => { fetchAttributes(client.id, 'attributes'); });
    }
  };

  return (
    products.length > 0
      ? (
        <div className="mg-attributes-container d-flex">
          <PerfectScrollbar
            options={{ suppressScrollX: true, minScrollbarLength: 50 }}
          >
            {
              nodes.length > 0
            && (
              <CheckboxTree
                nodes={associationAttributes}
                checked={checked}
                expanded={expanded}
                onCheck={handleAttributeChange}
                onExpand={handleExpanded}
                nativeCheckboxes
                showNodeIcon={false}
                icons={{
                  expandClose: <AddIcon />,
                  expandOpen: <RemoveIcon />,
                }}
              />
            )
            }
          </PerfectScrollbar>
          {
            displayMenu
          && (
            <ContextMenu
              handleClose={handleClose}
              open={displayMenu}
              info={info}
              menuItem={menuItem}
              products={products}
              valueDetails={valueDetails}
              attributes={attributes}
              category={category}
            />
          )
          }
        </div>
      ) : (
        <div className="loader">
          <Loader size="small" color="dark" />
        </div>
      )
  );
}

Association.propTypes = {
  category: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired,
  isFetchingList: PropTypes.bool.isRequired,
  attributes: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  valueDetails: PropTypes.array.isRequired,
  associationAttributes: PropTypes.array.isRequired,
  client: PropTypes.object.isRequired,
  updateAttribute: PropTypes.func.isRequired,
  fetchAttributes: PropTypes.func.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  setAttribute: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  nodes: store.attributesData.nodes,
  attributes: store.attributesData.attributes,
  products: store.productsData.data.products,
  isFetchingList: store.productsData.isFetchingList,
  valueDetails: store.productsData.data.valueDetails,
  associationAttributes: store.attributesData.associations,
  category: store.categoriesData.category,
  categories: store.categoriesData.categories,
  client: store.clientsData.client,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateAttribute,
  fetchAttributes,
  fetchProducts,
  setAttribute,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Association);
