import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CheckboxTree from 'react-checkbox-tree-enhanced';

import _union from 'lodash/union';
import _difference from 'lodash/difference';
import { fetchAttributes, updateAttribute, setAttribute } from 'redux/actions/attribute';
import { fetchProducts } from 'redux/actions/products';
import { setHandler } from 'utils';
import { getNewAppearData, getAllChildData } from 'utils/attributeManagement';
import Loader from 'components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ContextMenu from './ContextMenu';

import './style.scss';

function Association({
  isUpdating,
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
  const [gotProducts, setGotProducts] = useState(false);
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
    const attribute = attributes.find((attributeItem) => (attributeItem._id === attributeId));
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
        if (attrItem.appear && attrItem.appear.find((appearItem) => (appearItem === category._id))) {
          updateChecked.push(attrItem._id);
        }
      });
      setChecked(updateChecked);
    }
    if (!gotProducts && products.length === 0 && !isFetchingList) {
      fetchProducts().then(() => { setGotProducts(true); });
    }
    if (context.length > 0) { setHandler(context, handleClick); }
    setContext(document.getElementsByClassName('rct-title'));
  }, [category, attributes, products, fetchProducts,
    setChecked, setGotProducts, context, handleClick,
    isFetchingList, gotProducts]);


  const handleExpanded = (expanded) => {
    setExpanded(expanded);
    setTimeout(() => {
      const newContext = document.getElementsByClassName('rct-title');
      setContext(newContext);
      setHandler(newContext, handleClick);
    }, 0);
  };

  const handleAttributeChange = (checked, nodeTarget) => {
    if (!isUpdating) {
      const targetAppear = attributes.filter((attrItem) => (attrItem._id === nodeTarget.value))[0];
      let checkGrp = false;
      let appearData = [];
      const willCheckedCategory = getNewAppearData(categories, targetAppear.appear, category);
      const allChildData = getAllChildData(categories, category);
      willCheckedCategory.push(category._id);
      const updateNewAppear = _union(willCheckedCategory, allChildData);

      if (nodeTarget.checked) {
        appearData = _union(targetAppear.appear, updateNewAppear);
        if (targetAppear.group_id !== null) {
          const includeCategoryList = attributes.filter(
            (attrItem) => (!!attrItem.appear.find(
              ((arrItem) => (arrItem === category._id)),
            ) && (attrItem.group_id === targetAppear.group_id)),
          );
          const groupList = attributes.filter((attrItem) => (attrItem.group_id === targetAppear.group_id));
          if (includeCategoryList.length === groupList.length - 1) {
            checkGrp = true;
          }
        }
      } else {
        appearData = _difference(targetAppear.appear, updateNewAppear);
      }

      if (checkGrp) {
        const groupAdd = attributes.filter((attrItem) => (attrItem._id === targetAppear.group_id))[0];
        const groupAddAppear = groupAdd.appear;
        groupAddAppear.push(category._id);
        const updateItemId = attributes.find((item) => (item._id === targetAppear.group_id))._id;
        updateAttribute(updateItemId, { appear: groupAddAppear })
          .then(() => { fetchAttributes(client.id, 'attributes'); });
      } else {
        updateAttribute(targetAppear._id, { appear: appearData, checked: nodeTarget.checked })
          .then(() => { fetchAttributes(client.id, 'attributes'); });
      }
    }
  };

  return (
    products.length > 0 || gotProducts
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
                showNodeIcon={false}
                icons={{
                  check: <FontAwesomeIcon className="rct-icon rct-icon-check" icon="check-square" />,
                  uncheck: <FontAwesomeIcon className="rct-icon rct-icon-uncheck" icon={['far', 'square']} />,
                  halfCheck: <FontAwesomeIcon className="rct-icon rct-icon-half-check" icon="check-square" />,
                  expandClose: <FontAwesomeIcon
                    className="rct-icon rct-icon-expand-close"
                    icon={['far', 'plus-square']}
                  />,
                  expandOpen: <FontAwesomeIcon
                    className="rct-icon rct-icon-expand-open"
                    icon={['far', 'minus-square']}
                  />,
                  expandAll: <FontAwesomeIcon className="rct-icon rct-icon-expand-all" icon={['far', 'plus-square']} />,
                  collapseAll: <FontAwesomeIcon
                    className="rct-icon rct-icon-collapse-all"
                    icon={['far', 'minus-square']}
                  />,
                  parentClose: <FontAwesomeIcon className="rct-icon rct-icon-parent-close" icon="folder" />,
                  parentOpen: <FontAwesomeIcon className="rct-icon rct-icon-parent-open" icon="folder-open" />,
                  leaf: <FontAwesomeIcon className="rct-icon rct-icon-leaf-close" icon="file" />,
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
  isUpdating: PropTypes.bool.isRequired,
  isFetchingList: PropTypes.bool.isRequired,
  client: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired,
  attributes: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  valueDetails: PropTypes.array.isRequired,
  associationAttributes: PropTypes.array.isRequired,
  updateAttribute: PropTypes.func.isRequired,
  fetchAttributes: PropTypes.func.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  setAttribute: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  nodes: store.attributesData.nodes,
  attributes: store.attributesData.attributes,
  isUpdating: store.attributesData.isUpdating,
  products: store.productsData.data.products,
  isFetchingList: store.productsData.isFetchingList,
  valueDetails: store.productsData.data.valueDetails,
  associationAttributes: store.attributesData.associations,
  category: store.categoriesData.category,
  categories: store.categoriesData.categories,
  client: store.clientsData.client,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateAttribute,
  fetchAttributes,
  fetchProducts,
  setAttribute,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Association);
