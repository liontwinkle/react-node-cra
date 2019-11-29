import React, { useState, useEffect } from 'react';
import { changeNodeAtPath, removeNodeAtPath } from 'react-sortable-tree';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import Popover from '@material-ui/core/Popover';
import MoreIcon from '@material-ui/icons/MoreVert';

import { fetchAttributes } from 'redux/actions/attribute';
import { createHistory, removeHistory } from 'redux/actions/history';
import { createCategory, removeCategory, updateCategory } from 'redux/actions/categories';
import SetLinkDlg from 'components/elements/SetLinkDlg';
import SetTemplateDlg from 'components/elements/SetTemplateDlg';
import { CustomConfirmDlg, IconButton } from 'components/elements/index';
import { confirmMessage, getNodeKey, getSubItems } from 'utils';
import { addNewRuleHistory } from 'utils/ruleManagement';
import { validateTemplate } from 'utils/propertyManagement';
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
  updateCategory,
  createHistory,
  removeCategory,
  removeHistory,
  fetchAttributes,
  propertyField,
  editable,
  client,
  categories,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const handleMenuClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const [rootItems, setRootItems] = useState([]);
  const [initFlag, setInitFlag] = useState(false);

  useEffect(() => {
    if (categories.length > 0) {
      const items = categories.filter((item) => (item._id !== node.item._id));
      setRootItems(items);
      setInitFlag(true);
    }
  }, [categories, initFlag, setInitFlag, setRootItems, node]);

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
      createCategory({ name: '', parent_id: node.item._id })
        .then((category) => {
          fetchAttributes(client.id, 'attributes')
            .then(() => {
              addNewRuleHistory(createHistory, category, category.parent_id,
                'Create Node', 'Add Child Node - New Category', 'virtual');
              confirmMessage(enqueueSnackbar, 'New category has been created successfully.', 'success');
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
      removeCategory(node.item._id)
        .then(() => {
          fetchAttributes(client.id, 'attributes')
            .then(() => {
              const deleteHistory = history.filter((historyItem) => (historyItem.itemId === node.item._id));
              if (deleteHistory.length > 0) {
                removeHistory(node.item._id)
                  .then(() => {
                    if (node.item.parent_id !== null) {
                      createHistory({
                        label: `Delete Child Node ${node.item.name}`,
                        itemId: node.item.parent_id,
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

  const updateCategoryExtraInfomation = (data) => () => {
    let errList = [];
    if (data.template) {
      errList = validateTemplate(propertyField.propertyFields, data);
    }

    if (errList.length === 0) {
      updateCategory(node.item._id, data)
        .then(() => {
          confirmMessage(enqueueSnackbar, 'Updating the Category is okay.', 'success');
        })
        .catch(() => {
          confirmMessage(enqueueSnackbar, 'Error in setting the template.', 'error');
        });
    } else {
      confirmMessage(enqueueSnackbar, `The template is invalid in ${errList.join(',')}`, 'error');
    }
    handleClose();
  };
  const [deleteDlgOpen, setDeleteDlgOpen] = useState(null);
  const [openDialog, setOpenDialog] = useState({
    relate: false,
    template: false,
  });
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

  const handleDialog = (type, value) => () => {
    const newState = {
      ...openDialog,
      [type]: value,
    };
    setOpenDialog(newState);
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
        <NodeButton
          editable={editable}
          handleRemove={handleRemove}
          handleEdit={handleEdit}
          handleAdd={handleAdd}
          handleRelate={handleDialog('relate', true)}
          handleTemplate={handleDialog('template', true)}
          rootNode={node.item.parent_id === null}
        />
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
      {openDialog.relate && (
        <SetLinkDlg
          handleSetLink={updateCategoryExtraInfomation}
          rootItems={rootItems}
          handleClose={handleDialog('relate', false)}
          open={openDialog.relate}
          linkedId={node.item.linkedId || ''}
          msg="Please select the linked Node."
        />
      )}
      {openDialog.template && (
        <SetTemplateDlg
          handleSetTemplate={updateCategoryExtraInfomation}
          handleClose={handleDialog('template', false)}
          msg="Please set the template."
          template={node.item.template || {}}
          propertyField={propertyField}
          open={openDialog.template}
        />
      )}
    </div>
  );
}

NodeMenu.propTypes = {
  editable: PropTypes.bool.isRequired,
  isCreating: PropTypes.bool.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  isFetchAttributes: PropTypes.bool.isRequired,
  node: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  propertyField: PropTypes.object.isRequired,
  path: PropTypes.array.isRequired,
  history: PropTypes.array.isRequired,
  treeData: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  setTreeData: PropTypes.func.isRequired,
  createCategory: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
  removeCategory: PropTypes.func.isRequired,
  removeHistory: PropTypes.func.isRequired,
  fetchAttributes: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  client: store.clientsData.client,
  isCreating: store.categoriesData.isCreating,
  isFetchAttributes: store.attributesData.isFetchingList,
  isDeleting: store.categoriesData.isDeleting,
  propertyField: store.propertyFieldsData.propertyField,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createCategory,
  updateCategory,
  createHistory,
  removeCategory,
  removeHistory,
  fetchAttributes,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NodeMenu);
