import React, { useState } from 'react';

import DetailTable from 'components/DetailTable';
import Properties from 'components/Properties';
import { CustomTab } from 'components/elements';

const tabs = [
  { value: 'setting', label: 'Setting' },
  { value: 'preview', label: 'PreView' },
];

function AttributeContent() {
  const [tab, setTab] = useState('detail');

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
        {tab === 'setting' && <DetailTable />}
        {tab === 'preview' && <Properties />}
      </div>
    </div>
  );
}

export default AttributeContent;
