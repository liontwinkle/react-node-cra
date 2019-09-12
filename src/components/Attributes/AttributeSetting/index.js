import React, { Component } from 'react';
import {
  CustomSection,
  CustomSelectWithLabel,
} from 'components/elements';
import './style.scss';

const attrKey = [
  { label: 'Color', key: 'color' },
  { label: 'Size', key: 'size' },
  { label: 'Type', key: 'type' },
];

// const attrGroup = [
//   { label: 'Color', key: 'color' },
//   { label: 'Size', key: 'size' },
//   { label: 'Type', key: 'type' },
// ];
//
// const categories = [
//   { label: 'VitaminA', key: 'vitamin_a' },
//   { label: 'VitaminB', key: 'vitamin_b' },
//   { label: 'VitaminC', key: 'vitamin_c' },
// ];

class AttributeSetting extends Component {
  state = {
    selectedKey: attrKey[0],
  };

  changeSelect = type => (value) => {
    this.setState({
      [type]: value,
    });
  };

  render() {
    const {
      selectedKey,
    } = this.state;
    return (
      <div className="mg-attr-setting-container d-flex">
        <CustomSection title="Setting Attribute" key="setting_attribute">
          <div className="mg-select-section">
            <CustomSelectWithLabel
              label={attrKey.label}
              inline
              value={selectedKey}
              items={attrKey || []}
              onChange={this.changeSelect('selectedKey')}
              key={attrKey.key}
            />
          </div>
        </CustomSection>
      </div>
    );
  }
}

export default AttributeSetting;
