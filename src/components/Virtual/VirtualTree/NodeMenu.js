import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addNodeUnderParent, changeNodeAtPath, removeNodeAtPath } from 'react-sortable-tree';
import Popover from '@material-ui/core/Popover';
import MoreIcon from '@material-ui/icons/MoreVert';
import { useSnackbar } from 'notistack';

import { confirmMessage, getNodeKey, getSubItems } from 'utils';
import { createCategory, removeCategory } from 'redux/actions/categories';
import { createHistory, removeHistory } from 'redux/actions/history';
import { CustomConfirmDlg, IconButton } from 'components/elements/index';
import { addNewRuleHistory } from 'utils/ruleManagement';

function NodeMenu({
  treeData,
  history,
  node,
  path,
  setTreeData,
  createCategory,
  createHistory,
  removeCategory,
  removeHistory,
  editable,
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
    createCategory({ name: 'New Category', parentId: node.item.id })
      .then((category) => {
        addNewRuleHistory(createHistory, category, category.parentId,
          'Create Node',
          'Add Child Node - New Category',
          'virtual');
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
      })
      .catch(() => {
        confirmMessage(enqueueSnackbar, 'Error in adding category.', 'error');
      });
    handleClose();
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
    const removeId = node.item.id;
    removeCategory(removeId)
      .then(() => {
        const deleteHistory = history.filter(historyItem => (historyItem.itemId === node.item.id));
        if (deleteHistory.length > 0) {
          removeHistory(removeId)
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
      })
      .catch(() => {
        confirmMessage(enqueueSnackbar, 'Error in deleting category.', 'error');
      });
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
        <div className="d-flex flex-column">
          <button className="mg-button transparent" onClick={handleAdd}>
            Add Child
          </button>

          {editable && (
            <button className="mg-button transparent" onClick={handleEdit}>
              Edit Category
            </button>
          )}

          <button className="mg-button transparent" onClick={handleRemove}>
            Delete Category
          </button>
        </div>
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
  path: PropTypes.array.isRequired,
  setTreeData: PropTypes.func.isRequired,
  createCategory: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
  removeCategory: PropTypes.func.isRequired,
  removeHistory: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  createCategory,
  createHistory,
  removeCategory,
  removeHistory,
}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(NodeMenu);
