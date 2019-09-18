import React, { useState } from 'react';

import DetailTable from 'components/DetailTable';
import NewRules from 'components/Virtual/RulesNew';
import Properties from 'components/Virtual/Properties';
import { CustomTab } from 'components/elements';
import Association from 'components/Virtual/Association';

const tabs = [
  { value: 'detail', label: 'Detail View' },
  { value: 'properties', label: 'Properties' },
  { value: 'association', label: 'Association' },
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
        {tab === 'association' && <Association />}
        {tab === 'rules' && <NewRules />}
      </div>
    </div>
  );
}

export default Content;
