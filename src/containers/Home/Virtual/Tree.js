import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import { useSnackbar } from 'notistack';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createCategory, updateTreeData } from 'redux/actions/categories';
import { createHistory } from 'redux/actions/history';

import AddIcon from '@material-ui/icons/Add';
import ArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import VirtualSortableTree from 'components/Virtual/VirtualTree';
import { IconButton } from 'components/elements';
import { confirmMessage } from 'utils';

function Tree(props) {
  const { enqueueSnackbar } = useSnackbar();
  const {
    categories,
    createCategory,
    updateTreeData,
    createHistory,
    treeData,
  } = props;

  const setTreeData = (data) => {
    updateTreeData(data);
  };

  const addRootCategory = () => {
    createCategory({ name: 'New Category' })
      .then((category) => {
        createHistory({
          label: 'Create Node',
          itemId: category._id,
          type: 'virtual',
        });
        confirmMessage(enqueueSnackbar, 'New category has been created successfully.', 'success');
      })
      .catch(() => {
        confirmMessage(enqueueSnackbar, 'Error in adding category.', 'error');
      });
  };

  return (
    <div className="app-tree-container d-flex flex-column">
      <div className="tree-header d-flex align-items-center justify-content-between">
        <Tooltip
          title="Add Category"
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
        {categories && categories.length > 0 && (
          <VirtualSortableTree treeData={treeData} setTreeData={setTreeData} />
        )}
      </div>
    </div>
  );
}

Tree.propTypes = {
  categories: PropTypes.array.isRequired,
  treeData: PropTypes.array.isRequired,
  createCategory: PropTypes.func.isRequired,
  updateTreeData: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  categories: store.categoriesData.categories,
  treeData: store.categoriesData.trees,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  createCategory,
  createHistory,
  updateTreeData,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tree);
