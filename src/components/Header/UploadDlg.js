import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FilePond } from 'react-filepond';

const UploadDlg = ({ onChangeData, onChangeKey }) => (
  <Fragment>
    <label>Data</label>
    <FilePond onupdatefiles={onChangeData} />
    <label>Data Keys</label>
    <FilePond onupdatefiles={onChangeKey} />
  </Fragment>
);

UploadDlg.propTypes = {
  onChangeData: PropTypes.func.isRequired,
  onChangeKey: PropTypes.func.isRequired,
};

export default UploadDlg;
