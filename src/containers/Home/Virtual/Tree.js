import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import ArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Tooltip } from 'react-tippy';
import { useSnackbar } from 'notistack';

import { getCategoryTree } from 'utils';
import { createCategory } from 'redux/actions/categories';
import VirtualSortableTree from 'components/VirtualTree';
import { IconButton } from 'components/elements';

function Tree(props) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    isFetchingList,
    categories,
    createCategory,
  } = props;

  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    if (!isFetchingList) {
      console.log('category>>>', getCategoryTree(categories));// fixme

      setTreeData(getCategoryTree(categories));
    }
  }, [categories, isFetchingList]);

  const addRootCategory = () => {
    createCategory({ name: 'New Category' })
      .then((category) => {
        enqueueSnackbar('New category has been created successfully.', { variant: 'success' });
        setTreeData(
          treeData.concat({
            title: category.name,
            editable: false,
            item: category,
          }),
        );
      })
      .catch(() => {
        enqueueSnackbar('Error in adding category.', { variant: 'error' });
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
  isFetchingList: PropTypes.bool.isRequired,
  categories: PropTypes.array.isRequired,
  createCategory: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  isFetchingList: store.categoriesData.isFetchingList,
  categories: store.categoriesData.categories,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  createCategory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tree);
