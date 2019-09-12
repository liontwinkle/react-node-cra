import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addNodeUnderParent, removeNodeAtPath } from 'react-sortable-tree';
import Popover from '@material-ui/core/Popover';
import MoreIcon from '@material-ui/icons/MoreVert';

import { getNodeKey } from 'utils';
import { CustomConfirmDlg, IconButton } from 'components/elements';

function NodeMenu({
  treeData,
  node,
  path,
  setTreeData,
}) {
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
    setTreeData(
      addNodeUnderParent({
        treeData,
        parentKey: path[path.length - 1],
        expandParent: true,
        getNodeKey,
        newNode: {
          title: 'New',
          editable: false,
          item: null,
        },
      }).treeData,
    );
    handleClose();
  };

  const deleteItem = () => {
    setTreeData(
      removeNodeAtPath({
        treeData,
        path,
        getNodeKey,
      }),
    );
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

  const getSubItems = ({ children }) => {
    let childLength = 0;

    if (children) {
      childLength = children.length;
      children.forEach((item) => {
        childLength += getSubItems(item);
      });
    }

    return childLength;
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
          {
            (path.length <= 1)
            && (
              <button className="mg-button transparent" onClick={handleAdd}>
              Add Child
              </button>
            )
          }

          <button className="mg-button transparent" onClick={handleRemove}>
            Delete Category
          </button>
        </div>
      </Popover>

      {deleteDlgOpen && (
        <CustomConfirmDlg
          open={deleteDlgOpen}
          subCategoryNumber={subCategoryNumber}
          msg="Are you sure you want to delete this attribute?"
          handleDelete={handleDelete}
          handleClose={handleDeleteDlgClose}
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
};

export default NodeMenu;
