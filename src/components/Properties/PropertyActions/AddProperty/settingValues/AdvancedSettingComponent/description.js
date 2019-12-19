import React from 'react';
import PropTypes from 'prop-types';

import { hints } from 'utils/constants';

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
            {hints.default}
          </span>
          {
            type !== 'array' && type !== 'toggle' && (
              <span>
                <b>Template: </b>
                {hints.template}
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
          {hints.image}
        </span>
      )
    }
    <span>
      <b>Section: </b>
      {hints.section}
    </span>
  </>
);

AdvancedDescription.propTypes = {
  type: PropTypes.string.isRequired,
};

export default AdvancedDescription;
