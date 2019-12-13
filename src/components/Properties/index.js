import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';

import isEqual from 'lodash/isEqual';
import { withSnackbar } from 'notistack';

import { sortByOrder } from 'utils';
import { updateProperties, sectionRender, getRootParent } from 'utils/propertyManagement';
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
    if (propertyField) {
      const nonSection = (propertyField.propertyFields)
        ? propertyField.propertyFields.filter((item) => item.section === null) : [];
      this.setState({
        noSectionPropertyFields: nonSection || [],
        properties: objectItem.properties || {},
        sections: propertyField.sections || [],
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { objectItem, propertyField } = this.props;
    const { properties } = this.state;
    if (propertyField.propertyFields && !isEqual(objectItem.properties, prevProps.objectItem.properties)) {
      const updatedProperties = objectItem.properties || {};
      this.updateState({
        properties: updateProperties(propertyField.propertyFields, updatedProperties),
      });
    }
    if (propertyField.propertyFields
      && !isEqual(propertyField.propertyFields, prevProps.propertyField.propertyFields)) {
      const nonSection = propertyField.propertyFields.filter((item) => (!item.section));
      this.updateState({
        sections: propertyField.sections.sort(sortByOrder) || [],
        noSectionPropertyFields: nonSection,
        properties: updateProperties(propertyField.propertyFields, properties),
      });
    }

    if (propertyField.sections && !isEqual(propertyField.sections, prevProps.propertyField.sections)) {
      this.updateState({
        sections: propertyField.sections.sort(sortByOrder) || [],
      });
    }
  }

  updateState = (data) => {
    this.setState((prevState) => ({
      ...prevState,
      ...data,
    }));
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
    const { objectItem, attributes, categories } = this.props;
    const { propertyFields } = this.props.propertyField;
    const items = (objectItem.group_id) ? attributes : categories;
    const type = (objectItem.group_id) ? 'group_id' : 'parent_id';
    const rootParent = getRootParent(items, objectItem, type);
    const template = rootParent.template || {};
    if (propertyFields) {
      return sectionRender(
        propertyFields, template, this.state, section,
        this.changeInput, this.changeSelect, this.handleSelItemToggle,
        this.handleEditImage, this.toggleSwitch, this.changeMonaco,
      );
    }
    return null;
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

    const propertyFields = this.props.propertyField !== null ? this.props.propertyField.propertyFields : [];

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
        {
          propertyFields && (
            <PropertyActions
              properties={properties}
              fields={propertyFields}
              uploadImage={this.state.uploadImage}
              sections={sections}
              isObjectUpdating={this.props.isObjectUpdating}
              updateObject={this.props.updateObject}
              objectItem={this.props.objectItem}
            />
          )
        }
      </div>
    );
  }
}

Properties.propTypes = {
  objectItem: PropTypes.object.isRequired,
  propertyField: PropTypes.object.isRequired,
  isObjectUpdating: PropTypes.bool.isRequired,
  updateObject: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  attributes: PropTypes.array.isRequired,
};

const mapStateToProps = (store) => ({
  propertyField: store.propertyFieldsData.propertyField,
  isUpdating: store.propertyFieldsData.isUpdating,
  categories: store.categoriesData.categories,
  attributes: store.attributesData.attributes,
});

export default connect(
  mapStateToProps,
)(withSnackbar(Properties));
