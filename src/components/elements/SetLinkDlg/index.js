import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import { CustomSelectWithLabel } from '../index';

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
  const [newLinkedId, setNewLinkedId] = useState(linkedId);
  useEffect(() => {
    const items = [];
    rootItems.forEach((item) => {
      items.push({
        label: item.name,
        key: item.id,
      });
    });
    setItemList(items);
  }, [setItemList, rootItems]);

  const changeSelect = (e) => {
    console.log('#### DEBUG Event: ', e); // fixme
    setNewLinkedId(e.key);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {msg}
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <span>
          <CustomSelectWithLabel
            label="Related Category"
            inline
            value={itemList[0]}
            items={itemList || []}
            onChange={(e) => changeSelect(e)}
          />
        </span>
      </DialogContent>

      <DialogActions className={classes.dialogAction}>
        <button
          className="mg-button secondary"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          className="mg-button primary"
          onClick={handleSetLink(newLinkedId)}
        >
          {confirmLabel}
        </button>
      </DialogActions>
    </Dialog>
  );
}

SetLinkDlg.propTypes = {
  open: PropTypes.bool.isRequired,
  msg: PropTypes.string.isRequired,
  linkedId: PropTypes.string,
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
