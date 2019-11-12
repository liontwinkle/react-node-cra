import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';

import isEqual from 'lodash/isEqual';
import { updateProperties } from 'utils/propertyManagement';
import { sortByOrder } from 'utils';
import TemplateSection from 'components/StaticTemplate/TemplateSection';

import './style.scss';

class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      properties: {},
      sections: [],
      noSectionPropertyFields: [],
    };
  }

  componentDidMount() {
    const { propertyField, objectItem } = this.props;
    const nonSection = (propertyField.propertyFields)
      ? propertyField.propertyFields.filter((item) => item.section === null) : [];
    this.setState({
      noSectionPropertyFields: nonSection || [],
      properties: objectItem.properties || {},
      sections: propertyField.sections || [],
    });
  }

  componentDidUpdate(prevProps) {
    const { objectItem, propertyField } = this.props;
    const { properties } = this.state;

    if (!isEqual(objectItem.properties, prevProps.objectItem.properties)) {
      this.updateState({
        properties: objectItem.properties || {},
      });
    }

    if (!isEqual(propertyField.propertyFields, prevProps.propertyField.propertyFields)) {
      const nonSection = propertyField.propertyFields.filter((item) => item.section === null);
      this.updateState({
        sections: propertyField.sections.sort(sortByOrder) || [],
        noSectionPropertyFields: nonSection,
        properties: updateProperties(propertyField.propertyFields, properties),
      });
    }

    if (!isEqual(propertyField.sections, prevProps.propertyField.sections)) {
      this.updateState({
        sections: propertyField.sections.sort(sortByOrder) || [],
      });
    }
  }

  updateState = (data) => {
    this.setState(data);
  };

  render() {
    const {
      // properties,
      sections,
      noSectionPropertyFields,
    } = this.state;
    return (
      <div className="preview-content-wrapper">
        <PerfectScrollbar options={{ suppressScrollX: true, minScrollbarLength: 50 }}>
          {
            sections.map((section) => (
              <TemplateSection title="No Section" key="no_section">
                {this.renderSectionFields(section)}
              </TemplateSection>
            ))
          }
          {noSectionPropertyFields.length > 0
          && (
            <TemplateSection title="No Section" key="no_section">
              {this.renderSectionFields(null)}
            </TemplateSection>
          )}
        </PerfectScrollbar>
      </div>
    );
  }
}

Preview.propTypes = {
  objectItem: PropTypes.object.isRequired,
  propertyField: PropTypes.object.isRequired,
};

const mapStateToProps = (store) => ({
  propertyField: store.propertyFieldsData.propertyField,
});

export default connect(
  mapStateToProps,
)(Preview);
