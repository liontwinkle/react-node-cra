import React, { useState } from 'react';
import SortableTree, { changeNodeAtPath } from 'react-sortable-tree';

import { getNodeKey } from 'utils/';
import NodeMenu from './NodeMenu';

import './style.scss';

function AttributeNode() {
  const [treeData, setTreeData] = useState([{
    title: 'Color',
    children: [{ title: 'black' }],
  }]);

  const handleConfirm = (node, path, title = null) => {
    let newNode = {
      ...node,
      editable: false,
    };

    if (title) {
      newNode = {
        ...newNode,
        title,
      };
    }

    setTreeData(
      changeNodeAtPath({
        treeData,
        path,
        getNodeKey,
        newNode,
      }),
    );
  };
  const handleBlur = (node, path) => () => {
    if (node.editable) {
      console.log('#DEBUG BLUR CHANGE: ', node, path); // fixme
      handleConfirm(node, path);
    }
  };
  const handleKeyDown = (node, path) => (e) => {
    if (e.key === 'Enter') {
      handleBlur(node, path)();
    }
  };

  const handleChange = (node, path) => (e) => {
    setTreeData(
      changeNodeAtPath({
        treeData,
        path,
        getNodeKey,
        newNode: {
          ...node,
          title: e.target.value,
        },
      }),
    );
  };

  const handleDoubleClick = (node, path) => () => {
    setTreeData(
      changeNodeAtPath({
        treeData,
        path,
        getNodeKey,
        newNode: {
          ...node,
          editable: true,
        },
      }),
    );
  };

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
        title: (
          <input
            className={`tree-node-input${node.editable ? ' editable' : ''}`}
            readOnly={!node.editable}
            onDoubleClick={handleDoubleClick(node, path)}
            value={node.title}
            onBlur={handleBlur(node, path)}
            onKeyDown={handleKeyDown(node, path)}
            onChange={handleChange(node, path)}
          />
        ),
      })}
    />
  );
}

export default AttributeNode;
