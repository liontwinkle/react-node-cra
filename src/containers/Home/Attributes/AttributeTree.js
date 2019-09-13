import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import ArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Tooltip } from 'react-tippy';

import AttributeNode from 'components/Attributes/AttributeTree';
import { IconButton } from 'components/elements';

function AttributeTree() {
  const addRootCategory = () => {
    console.log('click the root category.'); // fixme
  };

  return (
    <div className="app-tree-container d-flex flex-column">
      <div className="tree-header d-flex align-items-center justify-content-between">
        <Tooltip
          title="Create New Attribute Group"
          position="right"
          arrow
        >
          <IconButton onClick={addRootCategory}>
            <AddIcon />
          </IconButton>
        </Tooltip>

        <div className="icon-button-group">
          <IconButton>
            <ArrowLeftIcon />
          </IconButton>

          <IconButton>
            <ArrowRightIcon />
          </IconButton>
        </div>
      </div>

      <div className="tree-content">
        <AttributeNode />
      </div>
    </div>
  );
}

export default AttributeTree;
