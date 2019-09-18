import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';

import { confirmMessage } from 'utils';
import { CustomSection } from 'components/elements';
import CustomCheck from 'components/elements/CustomCheck';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { fetchAttributes, updateAttribute } from 'redux/actions/attribute';

function Association({
  category,
  nodes,
  attributes,
  updateAttribute,
  fetchAttributes,
  client,
}) {
  const { enqueueSnackbar } = useSnackbar();


  const handleAttributeChange = (appear, attr) => (state) => {
    let checkGrp = false;
    let appearData = [];
    const groupAttr = attributes.filter(attrItem => (attrItem._id === attr.groupId));
    let updateFlag = true;
    if (groupAttr.length > 0) {
      updateFlag = !(groupAttr[0].appear.find(arrItem => (arrItem === category._id)));
    }

    if (updateFlag) {
      if (state.target.checked) {
        appearData = [...appear, category._id];
        if (attr.groupId) {
          const includeCategoryList = attributes.filter(
            attrItem => (!!attrItem.appear.find(
              (arrItem => (arrItem === category._id)),
            ) && (attrItem.groupId === attr.groupId)),
          );
          const groupList = attributes.filter(attrItem => (attrItem.groupId === attr.groupId));
          if (includeCategoryList.length === groupList.length - 1) {
            checkGrp = true;
          }
        }
      } else {
        appearData = appear.filter(item => (item !== category._id));
      }
      if (checkGrp) {
        const groupAdd = attributes.filter(attrItem => (attrItem._id === attr.groupId))[0];
        const groupAddAppear = groupAdd.appear;
        groupAddAppear.push(category._id);
        updateAttribute(attr.groupId, { appear: groupAddAppear })
          .then(() => {
            fetchAttributes(client.id, 'attributes');
          });
      } else {
        updateAttribute(attr._id, { appear: appearData })
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

  const renderAttributes = () => {
    const res = [];
    nodes.forEach((nodeItem) => {
      res.push(
        <div key={nodeItem.item._id} className="attribute-item">
          <div className="group">
            <CustomCheck
              key={nodeItem.item._id}
              insertValue={
                !!(nodeItem.item.appear.find(appearItem => (appearItem === category._id)))
              }
              value={nodeItem.item.name}
              onChange={handleAttributeChange(nodeItem.item.appear, nodeItem.item)}
            />
          </div>
          {
            nodeItem.children.map(childItem => (
              <CustomCheck
                key={childItem.item._id}
                insertValue={
                  !!(childItem.item.appear.find(appearItem => (appearItem === category._id)))
                }
                value={childItem.item.name}
                onChange={handleAttributeChange(childItem.item.appear, childItem.item)}
              />
            ))
          }
        </div>,
      );
    });
    return res;
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
              <CustomSection title="Attributes" key="attributes">
                <div className="attribute-section">
                  {renderAttributes(null)}
                </div>
              </CustomSection>
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
  client: PropTypes.object.isRequired,
  updateAttribute: PropTypes.func.isRequired,
  fetchAttributes: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  nodes: store.attributesData.nodes,
  attributes: store.attributesData.attributes,
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
