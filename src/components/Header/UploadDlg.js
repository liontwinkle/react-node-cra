import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FilePond } from 'react-filepond';

const UploadDlg = ({ onChangeData, onChangeKey, clientType }) => (
  <Fragment>
    <label>{`The Data of ${clientType}`}</label>
    <FilePond onupdatefiles={onChangeData} />
    {
      clientType !== 'products'
        && (
          <Fragment>
            <label>The Data of the Property Fields</label>
            <FilePond onupdatefiles={onChangeKey} />
          </Fragment>
        )
    }
  </Fragment>
);

UploadDlg.propTypes = {
  onChangeData: PropTypes.func.isRequired,
  onChangeKey: PropTypes.func.isRequired,
  clientType: PropTypes.string.isRequired,
};

export default UploadDlg;
