import React from 'react';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { tableIcons } from 'utils/constants';
import PropTypes from 'prop-types';

const CustomMaterialTableModal = ({
  open,
  handleClose,
  msg,
  options,
  tableData,
  handleAdd,
  handleUpdate,
  handleDelete,
  onOrderChange,
  onChangeRowsPerPage,
  className,
  title,
}) => (
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">
      {title}
    </DialogTitle>

    <DialogContent className={className}>
      <MaterialTable
        title=""
        icons={tableIcons}
        columns={tableData.columns}
        data={tableData.data}
        editable={{
          onRowAdd: handleAdd,
          onRowUpdate: handleUpdate,
          onRowDelete: handleDelete,
        }}
        options={options}
        onOrderChange={onOrderChange}
        onChangeRowsPerPage={onChangeRowsPerPage}
        localization={{
          body: {
            editRow: {
              deleteText: msg,
            },
          },
        }}
      />
    </DialogContent>
  </Dialog>
);

CustomMaterialTableModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  msg: PropTypes.string,
  className: PropTypes.string,
  options: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  onOrderChange: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
};

CustomMaterialTableModal.defaultProps = {
  msg: 'Are you  sure to delete this row?',
  onOrderChange: null,
  onChangeRowsPerPage: null,
  className: '',
  title: '',
};
export default CustomMaterialTableModal;
