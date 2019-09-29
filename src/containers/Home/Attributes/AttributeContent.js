import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { AttributeSetting, AttributeRules, AttributeProperties } from 'components/Attributes';
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
        {tab === 'categories' && attribute && <AttributeSetting />}
        {tab === 'properties' && attribute && <AttributeProperties />}
        {tab === 'rules' && <AttributeRules />}
        {tab === 'history' && <DetailTable type="attributes" />}
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
