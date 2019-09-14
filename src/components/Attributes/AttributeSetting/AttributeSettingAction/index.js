import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { bindActionCreators } from 'redux';

import { useSnackbar } from 'notistack';
import SaveIcon from '@material-ui/icons/Save';

import { updateAttribute } from 'redux/actions/attribute';
import { IconButton } from 'components/elements';
import { confirmMessage } from 'utils';

function AttributeSettingAction({
  categoryList,
  attribute,
  updateAttribute,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const saveProperties = () => {
    const appear = categoryList.map(categoryItem => (categoryItem.key));
    updateAttribute(attribute._id, { appear })
      .then(() => {
        confirmMessage(enqueueSnackbar, 'Attribute has been updated successfully.', 'success');
      })
      .catch(() => {
        confirmMessage(enqueueSnackbar, 'Error in adding attribute.', 'error');
      });
  };

  return (
    <div className="mg-attributes-actions d-flex flex-column align-items-center">
      <Tooltip
        title="Save Attributes"
        position="left"
        arrow
      >
        <IconButton disabled={false} onClick={saveProperties}>
          <SaveIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
    </div>
  );
}

AttributeSettingAction.propTypes = {
  categoryList: PropTypes.array.isRequired,
  attribute: PropTypes.object.isRequired,
  updateAttribute: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  updateAttribute,
}, dispatch);
export default connect(
  null,
  mapDispatchToProps,
)(AttributeSettingAction);
