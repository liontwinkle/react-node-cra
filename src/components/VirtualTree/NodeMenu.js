import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  addNodeUnderParent,
  changeNodeAtPath,
  removeNodeAtPath,
} from 'react-sortable-tree';
import Popover from '@material-ui/core/Popover';
import MoreIcon from '@material-ui/icons/MoreVert';
import { useSnackbar } from 'notistack';

import { getNodeKey } from 'utils';
import { createCategory, removeCategory } from 'redux/actions/categories';
import { IconButton } from 'components/elements';
import DeleteConfirmDlg from './DeleteConfirmDlg';

function NodeMenu(props) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    treeData,
    node,
    path,
    setTreeData,
    createCategory,
    removeCategory,
  } = props;

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
    createCategory({
      name: 'New Category',
      parentId: node.item.id,
    })
      .then((category) => {
        enqueueSnackbar('New category has been created successfully.',
          {
            variant: 'success',
            autoHideDuration: 1000,
          });
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
        enqueueSnackbar('Error in adding category.',
          {
            variant: 'error',
            autoHideDuration: 1000,
          });
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
        enqueueSnackbar('The category has been deleted successfully.',
          {
            variant: 'success',
            autoHideDuration: 1000,
          });
        setTreeData(
          removeNodeAtPath({
            treeData,
            path,
            getNodeKey,
          }),
        );
      })
      .catch(() => {
        enqueueSnackbar('Error in deleting category.',
          {
            variant: 'error',
            autoHideDuration: 1000,
          });
      });
  };
  const [deleteDlgOpen, setDeleteDlgOpen] = useState(null);
  const [subCategoryNumber, setSubCategoryNumber] = useState(null);
  const handleDeleteDlgClose = (type) => {
    setDeleteDlgOpen(false);
    if (type === 'yes') {
      deleteItem();
    }
  };
  const getSubItems = (nodeData) => {
    let childLength = 0;
    const { children } = nodeData;
    if (children) {
      childLength = children.length;
      children.forEach((item) => {
        childLength += getSubItems(item);
      });
    }
    return childLength;
  };
  const handleRemove = () => {
    const childNum = getSubItems(node) + 1;
    setSubCategoryNumber(childNum);
    setDeleteDlgOpen(true);
    handleClose();
  };

  return (
    <div className="tree-node-menu" onClick={handleMenuClick}>
      <IconButton onClick={handleClick}>
        <MoreIcon />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className="d-flex flex-column">
          <button className="mg-button transparent" onClick={handleAdd}>
            Add Child
          </button>
          <button className="mg-button transparent" onClick={handleEdit}>
            Edit Category
          </button>
          <button className="mg-button transparent" onClick={handleRemove}>
            Delete Category
          </button>
        </div>
      </Popover>
      {deleteDlgOpen && (
        <DeleteConfirmDlg
          open={deleteDlgOpen}
          subCategoryNumber={subCategoryNumber}
          handleClose={type => handleDeleteDlgClose(type)}
        />
      )}
    </div>
  );
}

NodeMenu.propTypes = {
  treeData: PropTypes.array.isRequired,
  node: PropTypes.object.isRequired,
  path: PropTypes.array.isRequired,
  setTreeData: PropTypes.func.isRequired,
  createCategory: PropTypes.func.isRequired,
  removeCategory: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  createCategory,
  removeCategory,
}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(NodeMenu);
