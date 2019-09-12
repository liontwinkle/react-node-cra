import React, { useState } from 'react';
import SortableTree from 'react-sortable-tree';

import './style.scss';
import NodeMenu from './NodeMenu';

function AttributeNode() {
  const [treeData, setTreeData] = useState([{
    title: 'Color',
    children: [{ title: 'black' }],
  }]);

  return (
    <SortableTree
      treeData={treeData}
      onChange={treeData => setTreeData(treeData)}
      maxDepth={2}
      canDrag
      generateNodeProps={({ node, path }) => ({
        className: 'selected',
        buttons:
          [
            <NodeMenu
              treeData={treeData}
              node={node}
              path={path}
              setTreeData={setTreeData}
            />,
          ],
      })}
    />
  );
}

export default AttributeNode;
