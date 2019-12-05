import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { Tooltip } from 'react-tippy';
import { useSnackbar } from 'notistack';
import _union from 'lodash/union';


import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import { getPreFilterData } from 'utils';
import { IconButton } from 'components/elements';
import PreviewProducts from 'components/elements/RulesTable/PreviewProducts';
import PreviewGrid from 'components/elements/RulesTable/PreviewGrid';
import AddNewRule from './AddNewRule';
import EditRules from './EditRules';

import './style.scss';

function RulesAction({
  rules,
  newRules,
  displayRules,
  universalRules,
  products,
  productViewType,
  matchRules,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState({
    add_rule: false,
    edit_rules: false,
    preview_products: false,
  });

  const [rulesData, setRulesData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [previewProducts, setProducts] = useState([]);

  useEffect(() => {
    if (displayRules && rulesData !== displayRules) {
      const recvRules = displayRules || [];
      setPreviewData(getPreFilterData(_union(recvRules, universalRules), products));
      setRulesData(displayRules);
    }
  }, [products, rulesData, displayRules, universalRules]);


  const handleToggle = (field) => () => {
    let displayData = [];
    if (field === 'preview_products') { displayData = previewData; }

    if (displayData.length === 0 && field === 'preview_products') {
      enqueueSnackbar('No Products match this rule.', { variant: 'info', autoHideDuration: 4000 });
    } else {
      setProducts(displayData);
      setOpen({
        ...open,
        [field]: !open[field],
      });
    }
  };

  return (
    <div className="mg-rules-actions d-flex flex-column align-items-center">
      <Tooltip
        title="Add New Rule"
        position="left"
        arrow
      >
        <IconButton onClick={handleToggle('add_rule')}>
          <AddIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <Tooltip
        title="Edit Rules"
        position="left"
        arrow
      >
        <IconButton onClick={handleToggle('edit_rules')}>
          <EditIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <div className="divider" />

      <Tooltip
        title={`Preview ${previewData.length} Products for All Rules`}
        position="left"
        arrow
      >
        <span onClick={handleToggle('preview_products')}>{previewData.length}</span>
      </Tooltip>

      {open.add_rule && (
        <AddNewRule
          open={open.add_rule}
          handleClose={handleToggle('add_rule')}
          rules={newRules}
          displayRules={matchRules}
        />
      )}

      {open.edit_rules && (
        <EditRules open={open.edit_rules} handleClose={handleToggle('edit_rules')} rules={rules} />
      )}

      {open.preview_products && (
        (productViewType.key === 'grid')
          ? (
            <PreviewGrid
              open={open.preview_products}
              handleClose={handleToggle('preview_products')}
              filterProducts={previewProducts}
            />
          )
          : (
            <PreviewProducts
              open={open.preview_products}
              handleClose={handleToggle('preview_products')}
              filterProducts={previewProducts}
            />
          )
      )}
    </div>
  );
}

RulesAction.propTypes = {
  rules: PropTypes.array.isRequired,
  newRules: PropTypes.array.isRequired,
  displayRules: PropTypes.array.isRequired,
  matchRules: PropTypes.array.isRequired,
  universalRules: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  productViewType: PropTypes.object.isRequired,
};

const mapStateToProps = (store) => ({
  products: store.productsData.data.products,
  productViewType: store.clientsData.productViewType,
});

export default connect(
  mapStateToProps,
)(RulesAction);
