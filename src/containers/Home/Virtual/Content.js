import React, { useState } from 'react';

import DetailTable from 'components/DetailTable';
import NewRules from 'components/RulesNew';
import Properties from 'components/Properties';
import { CustomTab } from 'components/elements';

const tabs = [
  { value: 'detail', label: 'Detail View' },
  { value: 'properties', label: 'Properties' },
  { value: 'rules', label: 'Rules' },
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
        {tab === 'detail' && <DetailTable />}
        {tab === 'properties' && <Properties />}
        {tab === 'rules' && <NewRules />}
      </div>
    </div>
  );
}

export default Content;
