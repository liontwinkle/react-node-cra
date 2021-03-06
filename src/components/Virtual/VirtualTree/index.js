import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SortableTree, { changeNodeAtPath } from 'react-sortable-tree';
import { bindActionCreators } from 'redux';
import { useSnackbar } from 'notistack';
import _find from 'lodash/find';

import { confirmMessage, getNodeKey } from 'utils/index';
import { addNewRuleHistory } from 'utils/ruleManagement';
import { updateCategory, setCategory } from 'redux/actions/categories';
import { createHistory } from 'redux/actions/history';
import TreeNodeMenu from './NodeMenu';

import './style.scss';

function VirtualSortableTree({
  isUpdating,
  isCreating,
  categories,
  history,
  category,
  treeData,
  setTreeData,
  updateCategory,
  setCategory,
  clientType,
  createHistory,
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

    setTreeData(
      changeNodeAtPath({
        treeData,
        path,
        getNodeKey,
        newNode,
      }),
    );
  };

  const handleBlur = (node, path) => () => {
    if (node.editable) {
      const category = _find(categories, { _id: node.item._id });
      const parent = _find(categories, { _id: node.item.parent_id });
      const parentId = (parent) ? parent._id : null;
      if (!isUpdating && !isCreating && category && category.name !== node.title) {
        updateCategory(node.item._id, { name: node.title })
          .then(() => {
            addNewRuleHistory(createHistory, category, parentId,
              `Name is changed as ${node.title}`,
              `The Child ${category.name} Name is changed as ${node.title}`,
              'virtual');
            confirmMessage(enqueueSnackbar, 'Category name has been updated successfully.', 'success');
          })
          .catch(() => {
            confirmMessage(enqueueSnackbar, 'Error in adding category.', 'error');
            handleConfirm(node, path, category.name);
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
    setTreeData(
      changeNodeAtPath({
        treeData,
        path,
        getNodeKey,
        newNode: {
          ...node,
          title: e.target.value,
        },
      }),
    );
  };

  const handleClick = (node) => () => {
    if (!node.editable) {
      setCategory(node.item);
    }
  };

  const handleDoubleClick = (node, path) => () => {
    setTreeData(
      changeNodeAtPath({
        treeData,
        path,
        getNodeKey,
        newNode: {
          ...node,
          editable: true,
        },
      }),
    );
  };

  const handleMoveTree = (data) => {
    const { node, path } = data;
    const currentParentItemName = (data.nextParentNode) ? data.nextParentNode.item.name : 'root';
    const currentParentItemId = (data.nextParentNode) ? data.nextParentNode.item._id : null;

    if (!isUpdating && !isCreating) {
      updateCategory(node.item._id, { parent_id: currentParentItemId })
        .then(() => {
          const msg = currentParentItemId !== 0 ? `Be a Child of ${currentParentItemName}` : 'Be a root\'s child';
          addNewRuleHistory(createHistory, category, node.item.parent_id,
            msg,
            `Move Child Node ${node.item.name}`,
            'virtual');
          const string = `${node.item.name}has been updated as children of ${currentParentItemName}`;
          confirmMessage(enqueueSnackbar, string, 'success');
          handleConfirm(node, path);
        })
        .catch(() => {
          confirmMessage(enqueueSnackbar, 'Error in adding category.', 'error');
          handleConfirm(node, path, category.name);
        });
    }
  };

  const isSelected = (node) => (category && category._id) === node.item._id;
  const editable = (clientType.key === 'virtual');

  return (
    <SortableTree
      treeData={treeData}
      onChange={setTreeData}
      onMoveNode={handleMoveTree}
      canDrag
      generateNodeProps={({ node, path }) => ({
        className: isSelected(node) ? 'selected' : '',
        buttons: editable
          ? [
            <TreeNodeMenu
              treeData={treeData}
              node={node}
              categories={categories}
              path={path}
              setTreeData={setTreeData}
              editable={editable}
              history={history}
            />,
          ] : [],
        title: (
          <input
            className={`tree-node-input${node.editable ? ' editable' : ''}`}
            readOnly={!node.editable}
            onDoubleClick={editable ? handleDoubleClick(node, path) : null}
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

VirtualSortableTree.propTypes = {
  isUpdating: PropTypes.bool.isRequired,
  isCreating: PropTypes.bool.isRequired,
  category: PropTypes.object,
  clientType: PropTypes.object.isRequired,
  history: PropTypes.array.isRequired,
  treeData: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  setTreeData: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
  setCategory: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
};

VirtualSortableTree.defaultProps = {
  category: null,
};

const mapStateToProps = (store) => ({
  isUpdating: store.categoriesData.isUpdating,
  categories: store.categoriesData.categories,
  category: store.categoriesData.category,
  clientType: store.clientsData.type,
  history: store.historyData.history,
  isCreating: store.historyData.isCreating,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateCategory,
  setCategory,
  createHistory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VirtualSortableTree);
