import React, { useState } from 'react';
import { connect } from 'react-redux';
import { changeNodeAtPath, removeNodeAtPath } from 'react-sortable-tree';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import Popover from '@material-ui/core/Popover';
import MoreIcon from '@material-ui/icons/MoreVert';

import { createAttribute, removeAttribute, updateAttribute } from 'redux/actions/attribute';
import { createHistory, removeHistory } from 'redux/actions/history';
import { confirmMessage, getNodeKey, getSubItems } from 'utils';
import { addNewRuleHistory } from 'utils/ruleManagement';
import { CustomConfirmDlg, IconButton } from 'components/elements';
import SetTemplateDlg from 'components/elements/SetTemplateDlg';
import NodeButton from './NodeButton';
import { validateTemplate } from '../../../utils/propertyManagement';

function NodeMenu({
  isCreating,
  isDeleting,
  treeData,
  attributes,
  history,
  node,
  path,
  propertyField,
  setTreeData,
  updateAttribute,
  createAttribute,
  createHistory,
  removeAttribute,
  removeHistory,
  checkNameDuplicate,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const handleMenuClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => { setAnchorEl(event.currentTarget); };

  const handleClose = () => { setAnchorEl(null); };

  const handleEdit = () => {
    if (checkNameDuplicate(attributes, node.item.name, node.item.group_id) < 2) {
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
    if (!isCreating && checkNameDuplicate(attributes, '', node.item._id) === 0) {
      createAttribute({ name: '', group_id: node.item._id, appear: node.item.appear })
        .then((attribute) => {
          addNewRuleHistory(
            createHistory,
            attribute, node.item._id,
            'Create Node', 'Add Child Node- New Attribute', 'attributes',
          );
          confirmMessage(enqueueSnackbar, 'New Attribute has been created successfully.', 'success');
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
    if (!isDeleting) {
      removeAttribute(removeId)
        .then(() => {
          const deleteHistory = history.filter((historyItem) => (historyItem.itemId === node.item.id));
          if (deleteHistory.length > 0) {
            removeHistory(removeId)
              .then(() => {
                if (node.item.groupId !== 'null') {
                  createHistory({
                    label: `Delete Child Node ${node.item.name}`,
                    itemId: node.item.groupId,
                    type: 'attributes',
                  });
                }
              });
          }
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
    }
  };

  const [deleteDlgOpen, setDeleteDlgOpen] = useState(null);
  const [templateDlgOpen, setTemplateDlgOpen] = useState(false);
  const [subCategoryNumber, setSubCategoryNumber] = useState(null);

  const handleDelete = () => {
    deleteItem();
    setDeleteDlgOpen(false);
  };
  const handleDeleteDlgClose = () => { setDeleteDlgOpen(false); };

  const handleRemove = () => {
    const childNum = getSubItems(node);
    setSubCategoryNumber(childNum);
    setDeleteDlgOpen(true);
    handleClose();
  };

  const handleTemplateDlg = (value) => () => {
    setTemplateDlgOpen(value);
    if (!value) {
      handleClose();
    }
  };

  const setTemplate = (data) => () => {
    const errList = [];
    if (data.template) {
      validateTemplate(propertyField.propertyFields, data);
    }
    if (errList.length === 0) {
      updateAttribute(node.item.id, data)
        .then(() => {
          confirmMessage(enqueueSnackbar, 'Updating the Attribute is okay.', 'success');
          handleTemplateDlg(false);
        })
        .catch(() => {
          confirmMessage(enqueueSnackbar, 'Error in setting the template.', 'error');
        });
    } else {
      confirmMessage(enqueueSnackbar, `The template is invalid in ${errList.join(',')}`, 'error');
    }
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
        <NodeButton
          handleAdd={handleAdd}
          handleRemove={handleRemove}
          path={path}
          handleEdit={handleEdit}
          handleTemplate={handleTemplateDlg(true)}
        />
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
      {templateDlgOpen && (
        <SetTemplateDlg
          handleClose={handleTemplateDlg(false)}
          open={templateDlgOpen}
          msg="Please set the base template."
          template={node.item.template || {}}
          handleSetTemplate={setTemplate}
          propertyField={propertyField}
        />
      )}
    </div>
  );
}

NodeMenu.propTypes = {
  isCreating: PropTypes.bool.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  treeData: PropTypes.array.isRequired,
  attributes: PropTypes.array.isRequired,
  history: PropTypes.array.isRequired,
  node: PropTypes.object.isRequired,
  propertyField: PropTypes.object.isRequired,
  path: PropTypes.array.isRequired,
  setTreeData: PropTypes.func.isRequired,
  createAttribute: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
  removeAttribute: PropTypes.func.isRequired,
  removeHistory: PropTypes.func.isRequired,
  updateAttribute: PropTypes.func.isRequired,
  checkNameDuplicate: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createAttribute,
  createHistory,
  removeAttribute,
  removeHistory,
  updateAttribute,
}, dispatch);

const mapStateToProps = (store) => ({
  attributes: store.attributesData.attributes,
  propertyField: store.propertyFieldsData.propertyField,
  history: store.historyData.history,
  isUpdating: store.attributesData.isUpdating,
  isCreating: store.attributesData.isCreating,
  isDeleting: store.attributesData.isDeleting,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NodeMenu);
