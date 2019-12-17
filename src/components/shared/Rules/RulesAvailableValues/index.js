import React from 'react';
import PropTypes from 'prop-types';
import CustomModalDialog from 'components/elements/CustomModalDialog';

const RulesAvailableValues = ({
  handleClose,
  open,
}) => (
  <CustomModalDialog
    handleClose={handleClose}
    open={open}
    title="Show Unique Values"
  >
    <span>Modal</span>
  </CustomModalDialog>
);

RulesAvailableValues.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default RulesAvailableValues;
