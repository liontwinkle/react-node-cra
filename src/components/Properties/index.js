import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import isEqual from 'lodash/isEqual';
import { Tooltip } from 'react-tippy';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import { sortByOrder } from 'utils';
import {
  CustomInput,
  CustomText,
  CustomSection,
  CustomSelectWithLabel,
  CustomToggle,
  CustomArray,
  IconButton,
} from 'components/elements';
import PropertyActions from './PropertyActions';
import AddSelectItems from './PropertyActions/AddSelectItems';
import EditSelectItems from './PropertyActions/EditSelectItems';

import './style.scss';

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
    const nonSection = this.props.propertyField.propertyFields.filter(item => item.section === null);
    this.setState({
      noSectionPropertyFields: nonSection || [],
      properties: this.props.category.properties || {},
      sections: this.props.propertyField.sections || [],
    });
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.category.properties, prevProps.category.properties)) {
      if (this.props.category.id === prevProps.category.id) {
        const properties = {};
        const keys = Object.keys(this.state.properties);
        const propKeys = Object.keys(this.props.category.properties);

        keys.forEach((key) => {
          if (propKeys.indexOf(key) > -1) {
            properties[key] = this.state.properties[key];
          }
        });

        this.updateState({ properties });
      } else {
        this.updateState({
          properties: this.props.category.properties || {},
        });
      }
    }
    if (!isEqual(this.props.propertyField.propertyFields, prevProps.propertyField.propertyFields)) {
      const nextProperties = {};
      this.props.propertyField.propertyFields.forEach((item, key) => {
        if (this.state.properties[item.key] === item.default) {
          nextProperties[item.key] = this.props.propertyField.propertyFields[key].default;
        } else if (this.state.properties[item.key] === (item.default === 'true')) {
          nextProperties[item.key] = (this.props.propertyField.propertyFields[key].default === true);
        }
      });
      const nonSection = this.props.propertyField.propertyFields.filter(item => item.section === null);
      this.updateState({
        sections: this.props.propertyField.sections.sort(sortByOrder) || [],
        noSectionPropertyFields: nonSection,
        properties: nextProperties,
      });
    }

    if (!isEqual(this.props.propertyField.sections, this.props.propertyField.sections)) {
      this.updateState({
        sections: this.props.propertyField.sections.sort(sortByOrder) || [],
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
    const res = [];
    const { properties } = this.state;
    const { propertyFields } = this.props.propertyField;

    propertyFields.forEach((p) => {
      if ((section && (p.section === section.key))
        || ((section === null) && (p.section === null))) {
        let value = '';
        if (p.propertyType === 'string') {
          if (properties[p.key] === undefined) {
            value = p.default;
          } else {
            value = properties[p.key];
          }
          res.push(
            <CustomInput
              label={p.label}
              inline
              value={value}
              onChange={this.changeInput(p.key)}
              type="text"
              key={p.key}
            />,
          );
        } else if (p.propertyType === 'select') {
          const item = (p.items) ? p.items.filter(item => (item.key === properties[p.key]))[0] || {} : {};
          res.push(
            <div className="mg-select-section" key={p.key}>
              <CustomSelectWithLabel
                label={p.label}
                inline
                value={item}
                items={p.items || []}
                onChange={this.changeSelect(p.key)}
                key={p.key}
              />
              <Tooltip
                title="Edit Select Items"
                position="bottom"
                arrow
              >
                <IconButton
                  disabled={this.state.isUpdating}
                  onClick={() => this.handleSelItemToggle('isOpenSelItemEditModal')(p.key)}
                >
                  <EditIcon style={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Add Select Items"
                position="bottom"
                arrow
              >
                <IconButton
                  disabled={this.state.isUpdating}
                  onClick={() => this.handleSelItemToggle('isOpenSelItemModal')(p.key)}
                >
                  <AddIcon style={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            </div>,
          );
        } else if (p.propertyType === 'toggle') {
          let value = true;
          if (!properties[p.key]) {
            value = (p.default === 'true');
          } else {
            value = (properties[p.key] === 'true');
          }
          res.push(
            <CustomToggle
              label={p.label}
              value={value}
              onToggle={this.toggleSwitch(p.key)}
              key={p.key}
            />,
          );
        } else if (p.propertyType === 'text') {
          let value = '';
          if (properties[p.key] === undefined) {
            value = p.default;
          } else {
            value = properties[p.key];
          }
          res.push(
            <CustomText
              label={p.label}
              inline
              value={value}
              onChange={this.changeInput(p.key)}
              key={p.key}
            />,
          );
        } else if (p.propertyType === 'array') {
          let value = '';
          if (properties[p.key] === undefined) {
            value = p.default;
          } else if (Array.isArray(properties[p.key])) {
            value = JSON.stringify(properties[p.key]);
          } else {
            value = properties[p.key];
          }
          res.push(
            <CustomArray
              label={p.label}
              inline
              value={value}
              onChange={this.changeArrayInput(p.key)}
              key={p.key}
            />,
          );
        }
      }
    });

    return res;
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

    return (
      <div className="mg-properties-container d-flex">
        <div className="mg-properties-content">
          <PerfectScrollbar
            options={{
              suppressScrollX: true,
              minScrollbarLength: 50,
            }}
          >
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
              handleClose={
                this.handleSelItemToggle('isOpenSelItemModal')
              }
            />
          )}
          {isOpenSelItemEditModal && (
            <EditSelectItems
              selectKey={selectKey}
              open={isOpenSelItemEditModal}
              handleClose={
                this.handleSelItemToggle('isOpenSelItemEditModal')
              }
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

export default connect(mapStateToProps)(Properties);
