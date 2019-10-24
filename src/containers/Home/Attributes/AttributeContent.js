import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateAttribute } from 'redux/actions/attribute';


import { AttributeSetting, AttributeRules } from 'components/Attributes';
import Properties from 'components/Properties';
import { CustomTab } from 'components/elements';
import DetailTable from 'components/DetailTable';

const tabs = [
  { value: 'properties', label: 'Properties' },
  { value: 'categories', label: 'Categories' },
  { value: 'rules', label: 'Rules' },
  { value: 'history', label: 'History' },
];

function AttributeContent({
  attribute,
  isUpdating,
  updateAttribute,

}) {
  const [tab, setTab] = useState('properties');

  const handleClick = value => () => { setTab(value); };

  return (
    <div className="attribute-container">
      <CustomTab
        tabs={tabs}
        value={tab}
        onClick={handleClick}
      />

      <div className="attribute-content">
        {tab === 'categories' && attribute && <AttributeSetting />}
        {tab === 'properties' && attribute
        && (
          <Properties
            objectItem={attribute}
            updateObject={updateAttribute}
            isObjectUpdating={isUpdating}
          />
        )}
        {tab === 'rules' && <AttributeRules />}
        {tab === 'history' && <DetailTable type="attributes" />}
      </div>
    </div>
  );
}

AttributeContent.propTypes = {
  isUpdating: PropTypes.bool.isRequired,
  attribute: PropTypes.object,
  updateAttribute: PropTypes.func.isRequired,
};

AttributeContent.defaultProps = {
  attribute: null,
};

const mapStateToProps = store => ({
  isUpdating: store.attributesData.isUpdating,
  attribute: store.attributesData.attribute,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateAttribute,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AttributeContent);
