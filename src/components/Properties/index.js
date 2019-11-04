import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';

import isEqual from 'lodash/isEqual';
import { withSnackbar } from 'notistack';

import { sortByOrder } from 'utils';
import { initProperties, updateProperties, sectionRender } from 'utils/propertyManagement';
import { CustomSection } from 'components/elements';
import PropertyActions from './PropertyActions';
import AddSelectItems from './PropertyActions/AddSelectItems';
import EditSelectItems from './PropertyActions/EditSelectItems';

import './style.scss';
import EditImageSection from './PropertyActions/EditImageSection';

class Properties extends Component {
  state = {
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

  componentDidMount() {
    const { propertyField, objectItem } = this.props;
    const nonSection = (propertyField.propertyFields)
      ? propertyField.propertyFields.filter(item => item.section === null) : [];
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
      if (objectItem.id === prevProps.objectItem.id) {
        this.updateState({
          properties: initProperties(properties, objectItem.properties),
        });
      } else {
        this.updateState({
          properties: objectItem.properties || {},
        });
      }
    }
    if (!isEqual(propertyField.propertyFields, prevProps.propertyField.propertyFields)) {
      const nonSection = propertyField.propertyFields.filter(item => item.section === null);
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

  changeInput = field => (e) => {
    e.persist();
    this.setState(prevState => ({
      properties: {
        ...prevState.properties,
        [field]: e.target.value,
      },
    }));
  };

  changeArrayInput = field => (e) => {
    e.persist();
    this.setState(prevState => ({
      properties: {
        ...prevState.properties,
        [field]: e.target.value,
      },
    }));
  };

  changeSelect = field => (value) => {
    this.setState(prevState => ({
      properties: {
        ...prevState.properties,
        [field]: value.key,
      },
    }));
  };

  changeMonaco = field => (newValue) => {
    this.setState(prevState => ({
      properties: {
        ...prevState.properties,
        [field]: newValue,
      },
    }));
  };

  toggleSwitch = field => () => {
    this.setState(prevState => ({
      properties: {
        ...prevState.properties,
        [field]: !prevState.properties[field],
      },
    }));
  };

  handleSelItemToggle = type => (key) => {
    this.setState(prevState => ({
      [type]: !prevState[type],
      selectKey: key,
    }));
  };

  handleEditImage = (key, value) => {
    console.log('#### DEBUG KEY, VALUE: ', key, value); // fixme
    this.setState(prevState => ({
      isOpenEditImage: !prevState.isOpenEditImage,
      imageKey: key || '',
      imageValue: value || '',
    }));
  };

  handleChangeImage = type => (data) => {
    if (data.length > 0) {
      const { file, fileType } = data[0];
      if (fileType && fileType.indexOf('image/') === 0) {
        if (file) {
          const reader = new FileReader();
          reader.addEventListener(
            'load',
            () => {
              this.setState(prevState => ({
                ...prevState.properties,
                [type]: file,
                uploadImage: reader.result,
              }));
            },
            false,
          );
          reader.readAsDataURL(file);
        }
      }
    }
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
      // imageValue,
      noSectionPropertyFields,
    } = this.state;

    const { propertyFields } = this.props.propertyField;
    return (
      <div className="mg-properties-container d-flex">
        <div className="mg-properties-content">
          <PerfectScrollbar options={{ suppressScrollX: true, minScrollbarLength: 50 }}>
            {sections.map(section => (
              <CustomSection title={section.label} key={section.key}>
                {this.renderSectionFields(section)}
              </CustomSection>
            ))}
            {noSectionPropertyFields.length > 0
                && (
                  <CustomSection title="No Section" key="no_section">
                    {this.renderSectionFields(null)}
                  </CustomSection>
                )
            }
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
              key={imageKey}
              // value={imageValue}
              objectItem={this.props.objectItem}
              handleClose={this.handleEditImage}
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
  isObjectUpdating: PropTypes.bool.isRequired,
  updateObject: PropTypes.func.isRequired,
  propertyField: PropTypes.object.isRequired,
};

const mapStateToProps = store => ({
  propertyField: store.propertyFieldsData.propertyField,
  isUpdating: store.propertyFieldsData.isUpdating,
});

export default connect(
  mapStateToProps,
)(withSnackbar(Properties));
