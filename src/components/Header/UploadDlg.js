import React from 'react';
import PropTypes from 'prop-types';
import { FilePond } from 'react-filepond';

const UploadDlg = ({ onChangeData, clientType }) => (
  <>
    <label>{`The Data of ${clientType}`}</label>
    <FilePond onupdatefiles={onChangeData} />
  </>
);

UploadDlg.propTypes = {
  onChangeData: PropTypes.func.isRequired,
  clientType: PropTypes.string.isRequired,
};

export default UploadDlg;
