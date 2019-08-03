import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

import { sortByOrder } from 'utils';
import { CustomSection, CustomInput } from 'components/elements';
import PropertyActions from './PropertyActions';

import './style.scss';

class Properties extends Component {
  state = {
    name: '',
    properties: this.props.category.properties || {},
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

  renderFields = () => {};

  render() {
    const { name, properties, sections } = this.state;

    return (
      <div className="mg-properties-container d-flex">
        <div className="mg-properties-content">
          {sections.map(section => (
            <CustomSection title={section.label} key={section.key}>
              <CustomInput
                label="Name"
                inline
                value={name}
                onChange={this.changeInput('name')}
              />
            </CustomSection>
          ))}
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
