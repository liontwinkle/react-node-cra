import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

import { CustomSection, CustomInput } from 'components/elements';
import PropertyActions from './PropertyActions';

import './style.scss';

class Properties extends Component {
  state = {
    name: '',
    properties: this.props.category.properties || {},
  };

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.category, nextProps.category)) {
      this.setState({
        properties: nextProps.category.properties || {},
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
    const { name, properties } = this.state;

    return (
      <div className="mg-properties-container d-flex">
        <div className="mg-properties-content">
          <CustomSection title="Title">
            <CustomInput
              label="Name"
              inline
              value={name}
              onChange={this.changeInput('name')}
            />
          </CustomSection>
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
