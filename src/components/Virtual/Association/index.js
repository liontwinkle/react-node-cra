import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CheckboxTree from 'react-checkbox-tree-enhanced';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { fetchAttributes, updateAttribute } from 'redux/actions/attribute';

import './style.scss';
import ContextMenu from './ContextMenu';

function Association({
  category,
  nodes,
  attributes,
  updateAttribute,
  fetchAttributes,
  client,
  associationAttributes,
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
    positionX: 0,
    positionY: 0,
  });

  const handleClick = (event) => {
    event.preventDefault();
    setDisplayMenu(true);
    setInfo({
      label: event.target.innerText,
      positionX: event.clientX,
      positionY: event.clientY + 10,
    });
  };
  const handleClose = () => {
    setDisplayMenu(false);
  };
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
    if (context.length > 0) {
      const keys = Object.keys(context);
      keys.forEach((keyItem) => {
        context[keyItem].addEventListener('contextmenu', handleClick);
      });
      return () => keys.forEach((keyItem) => {
        context[keyItem].removeEventListener('contextmenu', handleClick);
      });
    }
    setContext(document.getElementsByClassName('rct-title'));
  }, [category, attributes, setChecked, context]);


  const handleExpanded = (expanded) => {
    setExpanded(expanded);
    setTimeout(() => {
      const newContext = document.getElementsByClassName('rct-title');
      setContext(newContext);
      const keys = Object.keys(newContext);
      keys.forEach((keyItem) => {
        newContext[keyItem].addEventListener('contextmenu', handleClick);
      });
      return () => keys.forEach((keyItem) => {
        newContext[keyItem].removeEventListener('contextmenu', handleClick);
      });
    }, 0);
  };

  const handleAttributeChange = (checked, nodeTarget) => {
    const targetAppear = attributes.filter(attrItem => (attrItem._id === nodeTarget.value))[0];

    let checkGrp = false;
    let appearData = [];
    if (nodeTarget.checked) {
      appearData = [...targetAppear.appear, category._id];
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
      appearData = targetAppear.appear.filter(item => (item !== category._id));
    }

    if (checkGrp) {
      const groupAdd = attributes.filter(attrItem => (attrItem._id === targetAppear.groupId))[0];
      const groupAddAppear = groupAdd.appear;
      groupAddAppear.push(category._id);
      updateAttribute(targetAppear.groupId, { appear: groupAddAppear })
        .then(() => {
          fetchAttributes(client.id, 'attributes');
        });
    } else {
      updateAttribute(targetAppear._id, { appear: appearData, checked: nodeTarget.checked })
        .then(() => {
          fetchAttributes(client.id, 'attributes');
        });
    }
  };

  return (
    <div className="mg-attributes-container d-flex">
      <PerfectScrollbar
        options={{
          suppressScrollX: true,
          minScrollbarLength: 50,
        }}
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
          && <ContextMenu handleClose={handleClose} open={displayMenu} info={info} menuItem={menuItem} />
      }
    </div>
  );
}

Association.propTypes = {
  category: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  attributes: PropTypes.array.isRequired,
  associationAttributes: PropTypes.array.isRequired,
  client: PropTypes.object.isRequired,
  updateAttribute: PropTypes.func.isRequired,
  fetchAttributes: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  nodes: store.attributesData.nodes,
  attributes: store.attributesData.attributes,
  associationAttributes: store.attributesData.associations,
  category: store.categoriesData.category,
  client: store.clientsData.client,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateAttribute,
  fetchAttributes,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Association);
