import React from 'react';
import PropTypes from 'prop-types';
import CustomModalDialog from 'components/elements/CustomModalDialog';

import './style.scss';

const RulesAvailableValues = ({
  handleClose,
  open,
  tableData,
  showKey,
}) => (
  <CustomModalDialog
    handleClose={handleClose}
    open={open}
    title="Show Unique Values"
  >
    <table className="rule-available-list">
      <thead>
        <th>No</th>
        <th>{showKey}</th>
      </thead>
      <tbody>
        {
          tableData.map((item, index) => (
            <tr>
              <td>{parseInt(index + 1, 10)}</td>
              <td>{item}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </CustomModalDialog>
);

RulesAvailableValues.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  tableData: PropTypes.array.isRequired,
  showKey: PropTypes.string.isRequired,
};

export default RulesAvailableValues;
