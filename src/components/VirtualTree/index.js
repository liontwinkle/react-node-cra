import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SortableTree, { changeNodeAtPath } from 'react-sortable-tree';
import { useSnackbar } from 'notistack';
import _find from 'lodash/find';

import { confirmMessage, getNodeKey } from 'utils';
import { updateCategory, setCategory } from 'redux/actions/categories';
import TreeNodeMenu from './NodeMenu';

import './style.scss';

function VirtualSortableTree(props) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    categories,
    category,
    treeData,
    setTreeData,
    updateCategory,
    setCategory,
    clientType,
  } = props;

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
      const category = _find(categories, { id: node.item.id });

      if (category && category.name !== node.title) {
        updateCategory(node.item.id, { name: node.title })
          .then(() => {
            confirmMessage(enqueueSnackbar, 'Category name has been updated successfully.', 'success');
            handleConfirm(node, path);
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

  const handleClick = node => () => {
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
    const currentParentNode = data.nextParentNode;
    const movedNodeItemName = node.item.name;
    const currentParentItemName = (currentParentNode) ? currentParentNode.item.name : 'root';
    const currentParentItemId = (currentParentNode) ? currentParentNode.item._id : '';

    updateCategory(node.item.id, { parentId: currentParentItemId })
      .then(() => {
        const string = `${movedNodeItemName}has been updated as children of ${currentParentItemName}`;
        confirmMessage(enqueueSnackbar, string, 'success');
        handleConfirm(node, path);
      })
      .catch(() => {
        confirmMessage(enqueueSnackbar, 'Error in adding category.', 'error');
        handleConfirm(node, path, category.name);
      });
  };

  const isSelected = node => (category && category.id) === node.item.id;
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
              path={path}
              setTreeData={setTreeData}
              editable={editable}
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
  categories: PropTypes.array.isRequired,
  category: PropTypes.object,
  clientType: PropTypes.object.isRequired,
  treeData: PropTypes.array.isRequired,
  setTreeData: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
  setCategory: PropTypes.func.isRequired,
};

VirtualSortableTree.defaultProps = {
  category: null,
};

const mapStateToProps = store => ({
  categories: store.categoriesData.categories,
  category: store.categoriesData.category,
  clientType: store.clientsData.type,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateCategory,
  setCategory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VirtualSortableTree);
