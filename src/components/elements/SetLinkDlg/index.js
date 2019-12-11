import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DialogActions, makeStyles } from '@material-ui/core';
import { CustomMultiSelect } from '../index';
import CustomModalDialog from '../CustomModalDialog';

import './style.scss';

const useStyles = makeStyles((theme) => ({
  dialogAction: {
    margin: theme.spacing(2),
  },
  dialogContent: {
    overflow: 'unset',
  },
}));

function SetLinkDlg({
  open,
  msg,
  confirmLabel,
  rootItems,
  handleSetLink,
  handleClose,
  linkedId,
}) {
  const classes = useStyles();

  const [itemList, setItemList] = useState([]);
  const [newLink, setNewLink] = useState(linkedId);
  useEffect(() => {
    const items = [];
    rootItems.forEach((item) => {
      items.push({
        label: item.name,
        value: item._id,
      });
    });
    setItemList(items);
  }, [setItemList, rootItems]);

  const changeSelect = (e) => {
    setNewLink(e);
  };
  return (
    <CustomModalDialog
      handleClose={handleClose}
      open={open}
      title={msg}
    >
      <span>
        <CustomMultiSelect
          className="mg-multi-select-container"
          label="Related Category"
          inline
          value={newLink}
          items={itemList || []}
          onChange={changeSelect}
        />
      </span>
      <DialogActions className={classes.dialogAction}>
        <button
          className="mg-button secondary"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          className="mg-button primary"
          onClick={handleSetLink({ linkedId: newLink })}
        >
          {confirmLabel}
        </button>
      </DialogActions>
    </CustomModalDialog>
  );
}

SetLinkDlg.propTypes = {
  open: PropTypes.bool.isRequired,
  msg: PropTypes.string.isRequired,
  linkedId: PropTypes.array,
  confirmLabel: PropTypes.string,
  rootItems: PropTypes.array.isRequired,
  handleSetLink: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

SetLinkDlg.defaultProps = {
  confirmLabel: 'Set Link',
  linkedId: '',
};

export default SetLinkDlg;
