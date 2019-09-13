import React, { useState } from 'react';

import AttributeSetting from 'components/Attributes/AttributeSetting';
import AttributePreview from 'components/Attributes/AttributePreview';
import { CustomTab } from 'components/elements';

const tabs = [
  { value: 'setting', label: 'Setting' },
  { value: 'preview', label: 'Preview' },
];

function AttributeContent() {
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
        {tab === 'setting' && <AttributeSetting groupFg />}
        {tab === 'preview' && <AttributePreview />}
      </div>
    </div>
  );
}

export default AttributeContent;
