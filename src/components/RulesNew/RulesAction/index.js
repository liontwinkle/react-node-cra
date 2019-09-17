import React, { useState } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { useSnackbar } from 'notistack';
import { Tooltip } from 'react-tippy';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Filter';

import { IconButton } from 'components/elements';
import { getPreFilterData } from 'utils';
import AddNewRule from './AddNewRule';
import EditRules from './EditRules';
import PreviewProducts from './PreviewProducts';
import PreviewGrid from './PreviewGrid';

import './style.scss';

function RulesAction({
  rules,
  newRules,
  products,
  productViewType,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState({
    add_rule: false,
    edit_rules: false,
    preview_products: false,
  });

  const [previewProducts, setProducts] = useState([]);

  const filterProducts = () => {
    const filterProduct = getPreFilterData(rules, products);
    setProducts(filterProduct);
    return filterProduct.length;
  };

  const handleToggle = field => () => {
    let displayLength = 0;

    if (field === 'preview_products') {
      displayLength = filterProducts();
    }

    if (displayLength === 0 && field === 'preview_products') {
      enqueueSnackbar('No Products match this rule.', {
        variant: 'info',
        autoHideDuration: 4000,
      });
    } else {
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
        title="Preview Products for All Rules"
        position="left"
        arrow
      >
        <IconButton>
          <SaveIcon style={{ fontSize: 20 }} onClick={handleToggle('preview_products')} />
        </IconButton>
      </Tooltip>

      {open.add_rule && (
        <AddNewRule open={open.add_rule} handleClose={handleToggle('add_rule')} rules={newRules} />
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
  products: PropTypes.array.isRequired,
  productViewType: PropTypes.object.isRequired,
};

const mapStateToProps = store => ({
  products: store.categoriesData.preProducts,
  productViewType: store.clientsData.productViewType,

});

export default connect(
  mapStateToProps,
)(RulesAction);
