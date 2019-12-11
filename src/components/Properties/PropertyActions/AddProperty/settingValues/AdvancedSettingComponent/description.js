import React from 'react';
import PropTypes from 'prop-types';

const AdvancedDescription = ({ type }) => (
  <>
    {
      (type === 'string'
      || type === 'text'
      || type === 'richtext'
      || type === 'monaco'
      || type === 'urlpath'
      || type === 'array'
      || type === 'toggle') && (
        <>
          <span>
            <b>Default: </b>
            This is default value of the properties based on String type.
          </span>
          {
            type !== 'array' && type !== 'toggle' && (
              <span>
                <b>Template: </b>
              This value is only for String type value. Once type $, you can choose the properties.
              </span>
            )
          }
        </>
      )
    }
    {
      type === 'image' && (
        <span>
          <b>Image: </b>
          You can upload your media. The name is empty string default.
        </span>
      )
    }
    <span>
      <b>Section: </b>
      You can select Section that includes new property.
    </span>
  </>
);

AdvancedDescription.propTypes = {
  type: PropTypes.string.isRequired,
};

export default AdvancedDescription;
