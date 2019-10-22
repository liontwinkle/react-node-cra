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
import CustomSearchFilter from '../../elements/CustomSearchFilter';

class Properties extends Component {
  state = {
    properties: {},
    sections: [],
    isUpdating: false,
    noSectionPropertyFields: [],
    selectKey: '',
    isOpenSelItemModal: false,
    isOpenSelItemEditModal: false,
  };

  componentDidMount() {
    const { propertyField, category } = this.props;
    const nonSection = (propertyField.propertyFields)
      ? propertyField.propertyFields.filter(item => item.section === null) : [];
    this.setState({
      noSectionPropertyFields: nonSection || [],
      properties: category.properties || {},
      sections: propertyField.sections || [],
    });
  }

  componentDidUpdate(prevProps) {
    const { category, propertyField } = this.props;
    const { properties } = this.state;
    if (!isEqual(category.properties, prevProps.category.properties)) {
      if (category.id === prevProps.category.id) {
        this.updateState({
          updateProperties: initProperties(properties, category.properties),
        });
      } else {
        this.updateState({
          properties: category.properties || {},
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

  renderSectionFields = (section) => {
    const { propertyFields } = this.props.propertyField;
    return sectionRender(
      propertyFields, this.state, section,
      this.changeInput, this.changeSelect, this.changeArrayInput,
      this.handleSelItemToggle, this.toggleSwitch, this.changeMonaco, this.changeRichText,
    );
  };

  render() {
    const {
      properties,
      sections,
      isOpenSelItemModal,
      isOpenSelItemEditModal,
      selectKey,
      noSectionPropertyFields,
    } = this.state;

    const { propertyFields } = this.props.propertyField;
    console.log('#### DEBUG PROPERTIES: ', propertyFields); // fixme
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
            <CustomSearchFilter
              searchItems={propertyFields.map(item => (item.key))}
              placeholder="Input search filter"
              label="label"
            />
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
            />
          )}
        </div>
        <PropertyActions properties={properties} fields={propertyFields} />
      </div>
    );
  }
}

Properties.propTypes = {
  category: PropTypes.object.isRequired,
  propertyField: PropTypes.object.isRequired,
};

const mapStateToProps = store => ({
  category: store.categoriesData.category,
  propertyField: store.propertyFieldsData.propertyField,
  isUpdating: store.propertyFieldsData.isUpdating,
});

export default connect(
  mapStateToProps,
)(withSnackbar(Properties));
