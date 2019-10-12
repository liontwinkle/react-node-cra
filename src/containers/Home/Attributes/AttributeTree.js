import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { createAttribute, updateNodeData } from 'redux/actions/attribute';
import { createHistory } from 'redux/actions/history';
import { useSnackbar } from 'notistack';

import AddIcon from '@material-ui/icons/Add';
import ArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import { AttributeNode } from 'components/Attributes';
import { IconButton } from 'components/elements';
import { confirmMessage } from 'utils';

function AttributeTree({
  isCreating,
  createAttribute,
  createHistory,
  attributes,
  nodeData,
  updateNodeData,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const addRootCategory = () => {
    const filterGroup = attributes.filter(attrItem => (attrItem.groupId === '' && attrItem.name === 'New Group'));
    const flag = (filterGroup.length === 0);
    if (flag && !isCreating) {
      createAttribute({ name: 'New Group' })
        .then((attribute) => {
          createHistory({
            label: 'Create Node',
            itemId: attribute._id,
            type: 'attributes',
          });
          confirmMessage(enqueueSnackbar, 'New group has been created successfully.', 'success');
        })
        .catch(() => {
          confirmMessage(enqueueSnackbar, 'Error in adding group.', 'error');
        });
    } else {
      confirmMessage(enqueueSnackbar, 'Group name is duplicated.', 'info');
    }
  };

  const setNodeData = (data) => { updateNodeData(data); };

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
        {
          attributes && attributes.length > 0 && (
            <AttributeNode nodeData={nodeData} setNodeData={setNodeData} />
          )
        }
      </div>
    </div>
  );
}

AttributeTree.propTypes = {
  isCreating: PropTypes.bool.isRequired,
  attributes: PropTypes.array.isRequired,
  nodeData: PropTypes.array.isRequired,
  createAttribute: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
  updateNodeData: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  attributes: store.attributesData.attributes,
  isCreating: store.attributesData.isCreating,
  nodeData: store.attributesData.nodes,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  createAttribute,
  createHistory,
  updateNodeData,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AttributeTree);
