import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FilePond } from 'react-filepond';

const UploadDlg = ({ onChangeData, clientType }) => (
  <Fragment>
    <label>{`The Data of ${clientType}`}</label>
    <FilePond onupdatefiles={onChangeData} />
  </Fragment>
);

UploadDlg.propTypes = {
  onChangeData: PropTypes.func.isRequired,
  clientType: PropTypes.string.isRequired,
};

export default UploadDlg;
