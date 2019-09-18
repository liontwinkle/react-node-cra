import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AttributeSetting from 'components/Attributes/AttributeSetting';
import AttributeRules from 'components/Attributes/AttributeRules';
// import AttributePreview from 'components/Attributes/AttributePreview';
import { CustomTab } from 'components/elements';
import AttributeProperties from '../../../components/Attributes/AttributeProperties';

const tabs = [
  { value: 'association', label: 'Association' },
  { value: 'properties', label: 'Properties' },
  { value: 'rules', label: 'Rules' },
];

function AttributeContent({
  attribute,
}) {
  const [tab, setTab] = useState('setting');

  const handleClick = value => () => {
    setTab(value);
  };

  return (
    <div className="attribute-container">
      <CustomTab
        tabs={tabs}
        value={tab}
        onClick={handleClick}
      />

      <div className="attribute-content">
        {tab === 'association' && attribute && <AttributeSetting />}
        {tab === 'properties' && attribute && <AttributeProperties />}
        {tab === 'rules' && <AttributeRules />}
      </div>
    </div>
  );
}

AttributeContent.propTypes = {
  attribute: PropTypes.object,
};

AttributeContent.defaultProps = {
  attribute: null,
};

const mapStateToProps = store => ({
  attribute: store.attributesData.attribute,
});

export default connect(mapStateToProps)(AttributeContent);
