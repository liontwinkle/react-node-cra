import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { confirmMessage } from 'utils/index';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { fetchAttributes, updateAttribute } from 'redux/actions/attribute';
import CheckboxTree from 'react-checkbox-tree-enhanced';

function Association({
  category,
  nodes,
  attributes,
  updateAttribute,
  fetchAttributes,
  client,
  associationAttributes,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    if (category) {
      const updateChecked = [];
      attributes.forEach((attrItem) => {
        if (attrItem.appear.find(appearItem => (appearItem === category._id))) {
          updateChecked.push(attrItem._id);
        }
      });
      console.log('update Checked>>>', updateChecked); // fixme
      setChecked(updateChecked);
    }
  }, [category, attributes, setChecked]);


  const handleExpanded = (expanded) => {
    setExpanded(expanded);
  };
  const handleAttributeChange = (checked, nodeTarget) => {
    console.log(associationAttributes);// fixme
    console.log('target>>>', nodeTarget); // fixme
    console.log('checked>>>', checked); // fixme

    const targetAppear = attributes.filter(attrItem => (attrItem._id === nodeTarget.value))[0];
    console.log('checked Attr>>>>', targetAppear); // fixme

    let checkGrp = false;
    let appearData = [];
    const groupAttr = attributes.filter(attrItem => (attrItem._id === targetAppear.groupId));
    let updateFlag = true;
    if (groupAttr.length > 0) {
      updateFlag = !(groupAttr[0].appear.find(arrItem => (arrItem === category._id)));
    }

    if (updateFlag) {
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
        updateAttribute(targetAppear._id, { appear: appearData })
          .then(() => {
            fetchAttributes(client.id, 'attributes');
          });
      }
    } else {
      confirmMessage(
        enqueueSnackbar,
        'This attribute could not be changed since the group is selected.',
        'info',
      );
    }
  };

  return (
    <div className="mg-properties-container d-flex">
      <div className="mg-properties-content">
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
      </div>
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
