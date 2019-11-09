import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';

import isEqual from 'lodash/isEqual';
import { withSnackbar } from 'notistack';

import { sortByOrder } from 'utils';
import { updateProperties, sectionRender } from 'utils/propertyManagement';
import { CustomSection } from 'components/elements';
import PropertyActions from './PropertyActions';
import AddSelectItems from './PropertyActions/AddSelectItems';
import EditSelectItems from './PropertyActions/EditSelectItems';
import EditImageSection from './PropertyActions/EditImageSection';

import './style.scss';

class Properties extends Component {
  constructor(props) {
    super(props);
    this.state = {
      properties: {},
      sections: [],
      isUpdating: false,
      noSectionPropertyFields: [],
      selectKey: '',
      imageKey: '',
      imageValue: '',
      isOpenSelItemModal: false,
      isOpenSelItemEditModal: false,
      isOpenEditImage: false,
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

  changeInput = (field) => (e) => {
    e.persist();
    this.setState((prevState) => ({
      properties: {
        ...prevState.properties,
        [field]: e.target.value,
      },
    }));
  };

  changeArrayInput = (field) => (e) => {
    e.persist();
    this.setState((prevState) => ({
      properties: {
        ...prevState.properties,
        [field]: e.target.value,
      },
    }));
  };

  changeSelect = (field) => (value) => {
    this.setState((prevState) => ({
      properties: {
        ...prevState.properties,
        [field]: value.key,
      },
    }));
  };

  changeMonaco = (field) => (newValue) => {
    this.setState((prevState) => ({
      properties: {
        ...prevState.properties,
        [field]: newValue,
      },
    }));
  };

  toggleSwitch = (field) => () => {
    this.setState((prevState) => ({
      properties: {
        ...prevState.properties,
        [field]: !prevState.properties[field],
      },
    }));
  };

  handleSelItemToggle = (type) => (key) => {
    this.setState((prevState) => ({
      [type]: !prevState[type],
      selectKey: key,
    }));
  };

  handleEditImage = (key) => {
    this.setState((prevState) => ({
      isOpenEditImage: !prevState.isOpenEditImage,
      imageKey: key || '',
    }));
  };

  renderSectionFields = (section) => {
    const { propertyFields } = this.props.propertyField;
    return sectionRender(
      propertyFields, this.state, section,
      this.changeInput, this.changeSelect, this.changeArrayInput,
      this.handleSelItemToggle, this.handleEditImage, this.toggleSwitch, this.changeMonaco,
    );
  };

  render() {
    const {
      properties,
      sections,
      isOpenSelItemModal,
      isOpenSelItemEditModal,
      isOpenEditImage,
      selectKey,
      imageKey,
      noSectionPropertyFields,
    } = this.state;

    const { propertyFields } = this.props.propertyField;
    return (
      <div className="mg-properties-container d-flex">
        <div className="mg-properties-content">
          <PerfectScrollbar options={{ suppressScrollX: true, minScrollbarLength: 50 }}>
            {sections.map((section) => (
              <CustomSection title={section.label} key={section.key}>
                {this.renderSectionFields(section)}
              </CustomSection>
            ))}
            {noSectionPropertyFields.length > 0
                && (
                  <CustomSection title="No Section" key="no_section">
                    {this.renderSectionFields(null)}
                  </CustomSection>
                )}
          </PerfectScrollbar>
          {isOpenSelItemModal && (
            <AddSelectItems
              selectKey={selectKey}
              open={isOpenSelItemModal}
              handleClose={this.handleSelItemToggle('isOpenSelItemModal')}
            />
          )}
          {isOpenSelItemEditModal && (
            <EditSelectItems
              selectKey={selectKey}
              open={isOpenSelItemEditModal}
              handleClose={this.handleSelItemToggle('isOpenSelItemEditModal')}
              objectItem={this.props.objectItem}
              updateObject={this.props.updateObject}
            />
          )}
          {isOpenEditImage && (
            <EditImageSection
              open={isOpenEditImage}
              fields={propertyFields}
              sections={sections}
              imageKey={imageKey}
              objectItem={this.props.objectItem}
              handleClose={this.handleEditImage}
              updateObject={this.props.updateObject}
              isObjectUpdating={this.props.isObjectUpdating}
            />
          )}
        </div>
        <PropertyActions
          properties={properties}
          fields={propertyFields}
          uploadImage={this.state.uploadImage}
          sections={sections}
          isObjectUpdating={this.props.isObjectUpdating}
          updateObject={this.props.updateObject}
          objectItem={this.props.objectItem}
        />
      </div>
    );
  }
}

Properties.propTypes = {
  objectItem: PropTypes.object.isRequired,
  propertyField: PropTypes.object.isRequired,
  isObjectUpdating: PropTypes.bool.isRequired,
  updateObject: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  propertyField: store.propertyFieldsData.propertyField,
  isUpdating: store.propertyFieldsData.isUpdating,
});

export default connect(
  mapStateToProps,
)(withSnackbar(Properties));
