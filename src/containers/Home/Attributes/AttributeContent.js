import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AttributeSetting from 'components/Attributes/AttributeSetting';
import AttributePreview from 'components/Attributes/AttributePreview';
import { CustomTab } from 'components/elements';

const tabs = [
  { value: 'setting', label: 'Setting' },
  { value: 'preview', label: 'Preview' },
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
        {tab === 'setting' && attribute && <AttributeSetting />}
        {tab === 'preview' && <AttributePreview />}
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
