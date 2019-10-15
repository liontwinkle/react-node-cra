import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import SortableTree, { changeNodeAtPath } from 'react-sortable-tree';
import { useSnackbar } from 'notistack';
import _find from 'lodash/find';

import { updateAttribute, setAttribute } from 'redux/actions/attribute';
import { createHistory } from 'redux/actions/history';
import { confirmMessage, getNodeKey } from 'utils';
import { checkNameDuplicate } from 'utils/attributeManagement';
import { addNewRuleHistory } from 'utils/ruleManagement';
import NodeMenu from './NodeMenu';

import './style.scss';

function AttributeNode({
  nodeData,
  history,
  setNodeData,
  isUpdating,
  isDeleting,
  isCreating,
  attributes,
  attribute,
  updateAttribute,
  createHistory,
  setAttribute,
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

  const handleClick = node => () => {
    if (!node.editable) { setAttribute(node.item); }
  };

  const handleBlur = (node, path) => () => {
    if (node.editable) {
      const attribute = _find(attributes, { id: node.item.id });

      if (attribute && attribute.name !== node.title && !isUpdating && !isCreating) {
        if (checkNameDuplicate(attributes, node.title, node.item.groupId) === 0) {
          updateAttribute(node.item.id, { name: node.title })
            .then(() => {
              addNewRuleHistory(createHistory, node.item, node.item.groupId,
                `Name is changed as ${node.title}`,
                `The Child ${attribute.name} Name is changed as ${node.title}`,
                'attributes');
              confirmMessage(enqueueSnackbar, 'Attribute name has been updated successfully.', 'success');
              handleConfirm(node, path);
            })
            .catch(() => {
              confirmMessage(enqueueSnackbar, 'Error in adding category.', 'error');
              handleConfirm(node, path, attribute.name);
            });
        } else {
          confirmMessage(enqueueSnackbar, 'The attribute name is duplicated', 'info');
        }
      } else {
        handleConfirm(node, path);
      }
    }
  };

  const handleKeyDown = (node, path) => (e) => {
    if (e.key === 'Enter') { handleBlur(node, path)(); }
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
  const isSelected = node => (attribute && attribute.id) === node.item.id;

  return (
    <SortableTree
      treeData={nodeData}
      onChange={setNodeData}
      maxDepth={2}
      canDrag
      generateNodeProps={({ node, path }) => ({
        className: isSelected(node) ? 'selected' : '',
        buttons:
        [
          <NodeMenu
            treeData={nodeData}
            node={node}
            path={path}
            attributes={attributes}
            setTreeData={setNodeData}
            checkNameDuplicate={checkNameDuplicate}
            history={history}
            isCreating={isCreating}
            isDeleting={isDeleting}
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
        onClick: handleClick(node),
      })}
    />
  );
}

AttributeNode.propTypes = {
  nodeData: PropTypes.array.isRequired,
  history: PropTypes.array.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  isCreating: PropTypes.bool.isRequired,
  attributes: PropTypes.array.isRequired,
  attribute: PropTypes.object,
  setNodeData: PropTypes.func.isRequired,
  updateAttribute: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
  setAttribute: PropTypes.func.isRequired,
};

AttributeNode.defaultProps = {
  attribute: null,
};

const mapStateToProps = store => ({
  attributes: store.attributesData.attributes,
  history: store.historyData.history,
  attribute: store.attributesData.attribute,
  isUpdating: store.attributesData.isUpdating,
  isCreating: store.attributesData.isCreating,
  isDeleting: store.attributesData.isDeleting,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateAttribute,
  setAttribute,
  createHistory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AttributeNode);
