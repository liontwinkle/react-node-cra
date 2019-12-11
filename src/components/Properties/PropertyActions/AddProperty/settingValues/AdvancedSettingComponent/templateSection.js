import React from 'react';
import PropTypes from 'prop-types';
import { CustomSearchFilter } from 'components/elements';

const TemplateSection = ({
  type,
  propertyField,
  propertyFieldData,
  handleChangeTemplate,
}) => (
  <>
    {
      (type === 'string'
        || type === 'text'
        || type === 'urlpath'
        || type === 'richtext'
        || type === 'monaco')
      && (
        <CustomSearchFilter
          className="mb-3"
          searchItems={propertyField.propertyFields.map((item) => (item.key))}
          placeholder="Input search filter"
          label="Template"
          inline={false}
          value={propertyFieldData.template}
          onChange={handleChangeTemplate}
        />
      )
    }
  </>
);

TemplateSection.propTypes = {
  type: PropTypes.string.isRequired,
  propertyField: PropTypes.object.isRequired,
  propertyFieldData: PropTypes.object.isRequired,
  handleChangeTemplate: PropTypes.func.isRequired,
};

export default TemplateSection;
