import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AddIcon from '@material-ui/icons/Add';
import ArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Tooltip } from 'react-tippy';
import { useSnackbar } from 'notistack';

import AttributeNode from 'components/Attributes/AttributeTree';
import { IconButton } from 'components/elements';

import { confirmMessage } from 'utils';
import { createAttribute, updateNodeData } from 'redux/actions/attribute';

function AttributeTree({
  createAttribute,
  attributes,
  nodeData,
  updateNodeData,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const addRootCategory = () => {
    createAttribute({ name: 'New Group' })
      .then(() => {
        confirmMessage(enqueueSnackbar, 'New group has been created successfully.', 'success');
      })
      .catch(() => {
        confirmMessage(enqueueSnackbar, 'Error in adding group.', 'error');
      });
  };

  const setNodeData = (data) => {
    updateNodeData(data);
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
  attributes: PropTypes.array.isRequired,
  nodeData: PropTypes.array.isRequired,
  createAttribute: PropTypes.func.isRequired,
  updateNodeData: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  attributes: store.attributesData.attributes,
  nodeData: store.attributesData.nodes,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  createAttribute,
  updateNodeData,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AttributeTree);
