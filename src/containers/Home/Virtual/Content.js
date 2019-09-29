import React, { useState } from 'react';

import DetailTable from 'components/DetailTable';
import { CustomTab } from 'components/elements';
import { Association, NewRules, Properties } from 'components/Virtual/';

const tabs = [
  { value: 'properties', label: 'Properties' },
  { value: 'attributes', label: 'Attributes' },
  { value: 'rules', label: 'Rules' },
  { value: 'history', label: 'History' },
];

function Content() {
  const [tab, setTab] = useState('detail');

  const handleClick = value => () => {
    setTab(value);
  };

  return (
    <div className="virtual-container">
      <CustomTab
        tabs={tabs}
        value={tab}
        onClick={handleClick}
      />

      <div className="virtual-content">
        {tab === 'history' && <DetailTable type="virtual" />}
        {tab === 'properties' && <Properties />}
        {tab === 'attributes' && <Association />}
        {tab === 'rules' && <NewRules />}
      </div>
    </div>
  );
}

export default Content;
