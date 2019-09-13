import React from 'react';
import PropTypes from 'prop-types';
import SaveIcon from '@material-ui/icons/Save';
import { Tooltip } from 'react-tippy';

import { IconButton } from 'components/elements';


function AttributeSettingAction({
  attributes,
  selectedGroup,
  groupFg,
}) {
  const saveProperties = () => {
    console.log('#DEBUG SAVE Attributes:', attributes); // fixme
    if (groupFg) {
      console.log('####### Update the Group update #############'); // fixme
    } else {
      console.log('####### Update the Attribute update #############'); // fixme
      console.log('#DEBUG SAVE Groups:', selectedGroup); // fixme
    }
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
  attributes: PropTypes.array.isRequired,
  selectedGroup: PropTypes.object.isRequired,
  groupFg: PropTypes.bool.isRequired,
};

export default AttributeSettingAction;
