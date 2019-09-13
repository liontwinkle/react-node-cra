import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SortableTree, { changeNodeAtPath } from 'react-sortable-tree';
import { useSnackbar } from 'notistack';
import _find from 'lodash/find';

import { confirmMessage, getNodeKey } from 'utils/';
import { updateAttribute } from 'redux/actions/attribute';
import NodeMenu from './NodeMenu';

import './style.scss';

function AttributeNode({
  nodeData,
  setNodeData,
  attributes,
  updateAttribute,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const handleConfirm = (node, path, title = null) => {
    let newNode = {
      ...node,
      editable: false,
    };

    if (title) {
      newNode = {
        ...newNode,
        title,
      };
    }

    setNodeData(
      changeNodeAtPath({
        treeData: nodeData,
        path,
        getNodeKey,
        newNode,
      }),
    );
  };
  const handleBlur = (node, path) => () => {
    if (node.editable) {
      console.log('#DEBUG BLUR CHANGE: ', node, path); // fixme
      const attribute = _find(attributes, { id: node.item.id });
      console.log('#DEBUG BLUR UPDATE: ', attribute); // fixme

      if (attribute && attribute.name !== node.title) {
        updateAttribute(node.item.id, { name: node.title })
          .then(() => {
            confirmMessage(enqueueSnackbar, 'Category name has been updated successfully.', 'success');
            handleConfirm(node, path);
          })
          .catch(() => {
            confirmMessage(enqueueSnackbar, 'Error in adding category.', 'error');
            handleConfirm(node, path, attribute.name);
          });
      } else {
        handleConfirm(node, path);
      }
    }
  };

  const handleKeyDown = (node, path) => (e) => {
    if (e.key === 'Enter') {
      handleBlur(node, path)();
    }
  };

  const handleChange = (node, path) => (e) => {
    setNodeData(
      changeNodeAtPath({
        treeData: nodeData,
        path,
        getNodeKey,
        newNode: {
          ...node,
          title: e.target.value,
        },
      }),
    );
  };

  const handleDoubleClick = (node, path) => () => {
    setNodeData(
      changeNodeAtPath({
        treeData: nodeData,
        path,
        getNodeKey,
        newNode: {
          ...node,
          editable: true,
        },
      }),
    );
  };

  return (
    <SortableTree
      treeData={nodeData}
      onChange={setNodeData}
      maxDepth={2}
      canDrag
      generateNodeProps={({ node, path }) => ({
        className: 'selected',
        buttons:
          [
            <NodeMenu
              treeData={nodeData}
              node={node}
              path={path}
              setTreeData={setNodeData}
            />,
          ],
        title: (
          <input
            className={`tree-node-input${node.editable ? ' editable' : ''}`}
            readOnly={!node.editable}
            onDoubleClick={handleDoubleClick(node, path)}
            value={node.title}
            onBlur={handleBlur(node, path)}
            onKeyDown={handleKeyDown(node, path)}
            onChange={handleChange(node, path)}
          />
        ),
      })}
    />
  );
}

AttributeNode.propTypes = {
  nodeData: PropTypes.array.isRequired,
  setNodeData: PropTypes.func.isRequired,
  updateAttribute: PropTypes.func.isRequired,
  attributes: PropTypes.array.isRequired,
};

const mapStateToProps = store => ({
  attributes: store.attributesData.attributes,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateAttribute,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AttributeNode);
