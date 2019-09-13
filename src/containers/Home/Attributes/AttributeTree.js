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
import { createAttribute } from 'redux/actions/attribute';

function AttributeTree({
  createAttribute,
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
    console.log('#comment : click to create new group.'); // fixme
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

AttributeTree.propTypes = {
  createAttribute: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  createAttribute,
}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(AttributeTree);
