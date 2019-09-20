import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addNodeUnderParent, changeNodeAtPath, removeNodeAtPath } from 'react-sortable-tree';
import { bindActionCreators } from 'redux';
import { createAttribute, removeAttribute } from 'redux/actions/attribute';
import { useSnackbar } from 'notistack';

import Popover from '@material-ui/core/Popover';
import MoreIcon from '@material-ui/icons/MoreVert';

import { confirmMessage, getNodeKey } from 'utils';
import { CustomConfirmDlg, IconButton } from 'components/elements';
import connect from 'react-redux/es/connect/connect';

function NodeMenu({
  treeData,
  node,
  path,
  setTreeData,
  createAttribute,
  removeAttribute,
  checkNameDuplicate,
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

  const handleEdit = () => {
    if (checkNameDuplicate(node.item.name, node.item.groupId) < 2) {
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
    } else {
      confirmMessage(enqueueSnackbar, 'The attribute name is duplicated', 'info');
    }
    handleClose();
  };

  const open = Boolean(anchorEl);

  const handleAdd = () => {
    if (checkNameDuplicate('New Attribute', node.item.id) === 0) {
      createAttribute({
        name: 'New Attribute',
        groupId: node.item.id,
      })
        .then((attribute) => {
          confirmMessage(enqueueSnackbar, 'New Attribute has been created successfully.', 'success');
          setTreeData(
            addNodeUnderParent({
              treeData,
              parentKey: path[path.length - 1],
              expandParent: true,
              getNodeKey,
              newNode: {
                title: attribute.name,
                editable: false,
                item: attribute,
              },
            }).treeData,
          );
        })
        .catch(() => {
          confirmMessage(enqueueSnackbar, 'Error in adding attribute.', 'error');
        });
    } else {
      confirmMessage(enqueueSnackbar, 'The attribute name is duplicated', 'info');
    }
    handleClose();
  };

  const deleteItem = () => {
    const removeId = node.item.id;
    removeAttribute(removeId)
      .then(() => {
        confirmMessage(enqueueSnackbar, 'The attribute has been deleted successfully.', 'success');
        setTreeData(
          removeNodeAtPath({
            treeData,
            path,
            getNodeKey,
          }),
        );
      })
      .catch(() => {
        confirmMessage(enqueueSnackbar, 'Error in deleting attribute.', 'error');
      });
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
              Add Attribute
              </button>
            )
          }

          <button className="mg-button transparent" onClick={handleEdit}>
            Edit
          </button>

          <button className="mg-button transparent" onClick={handleRemove}>
            Delete
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
  createAttribute: PropTypes.func.isRequired,
  removeAttribute: PropTypes.func.isRequired,
  checkNameDuplicate: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  createAttribute,
  removeAttribute,
}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(NodeMenu);
