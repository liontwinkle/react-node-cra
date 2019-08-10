import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import ArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Tooltip } from 'react-tippy';
import { useSnackbar } from 'notistack';

import {
  createCategory,
  updateTreeData,
} from 'redux/actions/categories';
import VirtualSortableTree from 'components/VirtualTree';
import { IconButton } from 'components/elements';

function Tree(props) {
  const { enqueueSnackbar } = useSnackbar();
  const {
    categories,
    createCategory,
    updateTreeData,
    treeData,
  } = props;

  const setTreeData = (data) => {
    updateTreeData(data);
  };

  const addRootCategory = () => {
    createCategory({ name: 'New Category' })
      .then(() => {
        enqueueSnackbar('New category has been created successfully.', { variant: 'success', autoHideDuration: 1000 });
      })
      .catch(() => {
        enqueueSnackbar('Error in adding category.', { variant: 'error', autoHideDuration: 1000 });
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
};

const mapStateToProps = store => ({
  categories: store.categoriesData.categories,
  treeData: store.categoriesData.trees,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  createCategory,
  updateTreeData,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tree);
