import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from 'components/elements';
import { inlineDefaultWidth } from 'utils/constants';
import './style.scss';


function CustomImageDisplay({
  id,
  className,
  label,
  labelAlignment,
  inline,
  inlineWidth,
  hint,
  value,
  name,
  handleEditImage,
}) {
  return (
    <div className={`mg-display-control ${className}`}>
      {label && !inline && (
        <label htmlFor={id} className="mg-display-label">
          {label}
        </label>
      )}

      <div className="mg-display-wrapper">
        {label && inline && (
          <label
            htmlFor={id}
            className={`mg-display-label inline ${labelAlignment}`}
            style={{ minWidth: inlineWidth }}
          >
            {label}
          </label>
        )}

        <div className={`mg-display-image ${value ? '' : 'non-user'}`}>
          {
            value && (
              <img src={value} alt="User" />
            )
          }
          <div className={`mg-display-tooltip-section ${value ? '' : 'non-section'}`}>
            <IconButton className="mg-display-image-edit">
              <EditIcon style={{ fontSize: 20 }} onClick={handleEditImage} />
            </IconButton>
            <div className="mg-display-name">
              <span>{name}</span>
            </div>
          </div>
        </div>
      </div>
      {hint && (
        <div className="mg-input-hint">{hint}</div>
      )}
    </div>
  );
}

CustomImageDisplay.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  className: PropTypes.string,
  label: PropTypes.string,
  labelAlignment: PropTypes.string,
  hint: PropTypes.string,
  name: PropTypes.string,
  inline: PropTypes.bool,
  inlineWidth: PropTypes.string,
  value: PropTypes.any,
  handleEditImage: PropTypes.func.isRequired,
};

CustomImageDisplay.defaultProps = {
  id: uuidv4(),
  className: '',
  label: '',
  labelAlignment: '',
  inline: false,
  inlineWidth: inlineDefaultWidth,
  hint: '',
  value: '',
  name: '',
};

export default CustomImageDisplay;
