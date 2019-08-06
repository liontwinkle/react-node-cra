import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SortableTree, { changeNodeAtPath } from 'react-sortable-tree';
import { useSnackbar } from 'notistack';
import _find from 'lodash/find';

import { getNodeKey } from 'utils';
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
            enqueueSnackbar('Category name has been updated successfully.', { variant: 'success' });

            handleConfirm(node, path);
          })
          .catch(() => {
            enqueueSnackbar('Error in adding category.', { variant: 'error' });

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
    console.log('node>>>', node);
    console.log('path>>>', path);
    console.log('treedata>>', treeData);// fixme
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
    const { node } = data;
    const { path } = data;
    const currentParentNode = data.nextParentNode;
    const movedNodeItemName = node.item.name;
    const currentParentItemName = currentParentNode.item.name;
    const currentParentItemId = currentParentNode.item._id;

    updateCategory(node.item.id, { parentId: currentParentItemId })
      .then(() => {
        const string = `${movedNodeItemName}has been updated as children of ${currentParentItemName}`;
        enqueueSnackbar(string, { variant: 'success' });
        handleConfirm(node, path);
      })
      .catch(() => {
        enqueueSnackbar('Error in adding category.', { variant: 'error' });
        handleConfirm(node, path, category.name);
      });
  };

  const isSelected = node => (category && category.id) === node.item.id;

  return (
    <SortableTree
      treeData={treeData}
      onChange={setTreeData}
      onMoveNode={handleMoveTree}
      canDrag
      generateNodeProps={({ node, path }) => ({
        className: isSelected(node) ? 'selected' : '',
        buttons: [
          <TreeNodeMenu
            treeData={treeData}
            node={node}
            path={path}
            setTreeData={setTreeData}
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

VirtualSortableTree.propTypes = {
  categories: PropTypes.array.isRequired,
  category: PropTypes.object,
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
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateCategory,
  setCategory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VirtualSortableTree);
