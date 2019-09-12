import React, { useState } from 'react';
import SortableTree from 'react-sortable-tree';

import './style.scss';

function AttributeNode() {
  const [treeData, setTreeData] = useState([{
    title: 'Chicken',
    children: [{ title: 'Egg', children: [{ title: 'No' }] }],
  }]);

  return (
    <SortableTree
      treeData={treeData}
      onChange={treeData => setTreeData(treeData)}
      maxDepth={1}
    />
  );
}

export default AttributeNode;
