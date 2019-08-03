import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import isEqual from 'lodash/isEqual';

import { sortByOrder } from 'utils';
import { CustomInput, CustomSection, CustomToggle } from 'components/elements';
import PropertyActions from './PropertyActions';

import './style.scss';

class Properties extends Component {
  state = {
    properties: this.props.category.properties || {},
    property: {},
    sections: this.props.category.sections || [],
  };

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.category.properties, nextProps.category.properties)) {
      if (this.props.category.id === nextProps.category.id) {
        const properties = {};
        const keys = Object.keys(this.state.properties);
        const propKeys = Object.keys(nextProps.category.properties);

        keys.forEach((key) => {
          if (propKeys.indexOf(key) > -1) {
            properties[key] = this.state.properties[key];
          }
        });

        this.setState({ properties });
      } else {
        this.setState({
          properties: nextProps.category.properties || {},
        });
      }
    }

    if (!isEqual(this.props.category.sections, nextProps.category.sections)) {
      this.setState({
        sections: nextProps.category.sections.sort(sortByOrder) || [],
      });
    }
  }

  changeInput = field => (e) => {
    this.setState({
      [field]: e.target.value,
    });
  };

  toggleSwitch = field => () => {
    this.setState(prevState => ({
      [field]: !prevState[field],
    }));
  };

  renderSectionFields = (section) => {
    const res = [];
    const { property } = this.state;
    const { propertyFields } = this.props.category;

    propertyFields.forEach((p) => {
      if (p.section === section.key) {
        if (p.propertyType === 'input') {
          res.push(
            <CustomInput
              label={p.label}
              inline
              value={property[p.key]}
              onChange={this.changeInput(p.key)}
              key={p.key}
            />,
          );
        } else if (p.propertyType === 'select') {
          res.push(
            <CustomInput
              label={p.label}
              inline
              value={property[p.key]}
              onChange={this.changeInput(p.key)}
              key={p.key}
            />,
          );
        } else if (p.propertyType === 'toggle') {
          res.push(
            <CustomToggle
              label={p.label}
              value={property[p.key]}
              onToggle={this.toggleSwitch(p.key)}
              key={p.key}
            />,
          );
        }
      }
    });

    return res;
  };

  render() {
    const { properties, sections } = this.state;

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
          </PerfectScrollbar>
        </div>

        <PropertyActions properties={properties} />
      </div>
    );
  }
}

Properties.propTypes = {
  category: PropTypes.object.isRequired,
};

const mapStateToProps = store => ({
  category: store.categoriesData.category,
});

export default connect(mapStateToProps)(Properties);
