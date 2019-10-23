import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import { addNodeUnderParent, changeNodeAtPath, removeNodeAtPath } from 'react-sortable-tree';
import Popover from '@material-ui/core/Popover';
import MoreIcon from '@material-ui/icons/MoreVert';

import { createCategory, removeCategory } from 'redux/actions/categories';
import { fetchAttributes } from 'redux/actions/attribute';
import { createHistory, removeHistory } from 'redux/actions/history';
import { CustomConfirmDlg, IconButton } from 'components/elements/index';
import { confirmMessage, getNodeKey, getSubItems } from 'utils';
import { addNewRuleHistory } from 'utils/ruleManagement';
import NodeButton from './NodeButton';

function NodeMenu({
  treeData,
  history,
  node,
  path,
  isCreating,
  isFetchAttributes,
  isDeleting,
  setTreeData,
  createCategory,
  createHistory,
  removeCategory,
  removeHistory,
  fetchAttributes,
  editable,
  client,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const handleMenuClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleAdd = () => {
    if (!isCreating && !isFetchAttributes) {
      createCategory({ name: 'New Category', parentId: node.item.categoryId })
        .then((category) => {
          fetchAttributes(client.id, 'attributes')
            .then(() => {
              addNewRuleHistory(createHistory, category, category.parentId,
                'Create Node', 'Add Child Node - New Category', 'virtual');
              confirmMessage(enqueueSnackbar, 'New category has been created successfully.', 'success');
              setTreeData(
                addNodeUnderParent({
                  treeData,
                  parentKey: path[path.length - 1],
                  expandParent: true,
                  getNodeKey,
                  newNode: {
                    title: category.name,
                    editable: false,
                    item: category,
                  },
                }).treeData,
              );
            });
        })
        .catch(() => {
          confirmMessage(enqueueSnackbar, 'Error in adding category.', 'error');
        });
      handleClose();
    }
  };

  const handleEdit = () => {
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
    handleClose();
  };

  const deleteItem = () => {
    if (!isDeleting && !isFetchAttributes) {
      removeCategory(node.item.id)
        .then(() => {
          fetchAttributes(client.id, 'attributes')
            .then(() => {
              const deleteHistory = history.filter(historyItem => (historyItem.itemId === node.item.id));
              if (deleteHistory.length > 0) {
                removeHistory(node.item.id)
                  .then(() => {
                    if (node.item.parentId !== '') {
                      createHistory({
                        label: `Delete Child Node ${node.item.name}`,
                        itemId: node.item.parentId,
                        type: 'virtual',
                      });
                    }
                  });
              }
              confirmMessage(enqueueSnackbar, 'The category has been deleted successfully.', 'success');
              setTreeData(
                removeNodeAtPath({
                  treeData,
                  path,
                  getNodeKey,
                }),
              );
            });
        })
        .catch(() => {
          confirmMessage(enqueueSnackbar, 'Error in deleting category.', 'error');
        });
    }
  };

  const [deleteDlgOpen, setDeleteDlgOpen] = useState(null);
  const [subCategoryNumber, setSubCategoryNumber] = useState(null);

  const handleDelete = () => {
    deleteItem();
    setDeleteDlgOpen(false);
  };
  const handleDeleteDlgClose = () => {
    setDeleteDlgOpen(false);
  };
  const handleRemove = () => {
    const childNum = getSubItems(node);
    setSubCategoryNumber(childNum);
    setDeleteDlgOpen(true);
    handleClose();
  };

  return (
    <div
      className="tree-node-menu"
      onClick={handleMenuClick}
    >
      <IconButton onClick={handleClick}>
        <MoreIcon />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <NodeButton editable={editable} handleRemove={handleRemove} handleEdit={handleEdit} handleAdd={handleAdd} />
      </Popover>

      {deleteDlgOpen && (
        <CustomConfirmDlg
          open={deleteDlgOpen}
          subCategoryNumber={subCategoryNumber}
          msg="Are you sure you want to delete this category?"
          handleDelete={handleDelete}
          handleClose={handleDeleteDlgClose}
        />
      )}
    </div>
  );
}

NodeMenu.propTypes = {
  treeData: PropTypes.array.isRequired,
  history: PropTypes.array.isRequired,
  node: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  path: PropTypes.array.isRequired,
  editable: PropTypes.bool.isRequired,
  isCreating: PropTypes.bool.isRequired,
  isFetchAttributes: PropTypes.bool.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  setTreeData: PropTypes.func.isRequired,
  createCategory: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
  removeCategory: PropTypes.func.isRequired,
  removeHistory: PropTypes.func.isRequired,
  fetchAttributes: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  client: store.clientsData.client,
  isCreating: store.categoriesData.isCreating,
  isFetchAttributes: store.attributesData.isFetchingList,
  isDeleting: store.categoriesData.isDeleting,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  createCategory,
  createHistory,
  removeCategory,
  removeHistory,
  fetchAttributes,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NodeMenu);
