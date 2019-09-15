import React, { useState } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { useSnackbar } from 'notistack';
import { Tooltip } from 'react-tippy';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Filter';

import { IconButton } from 'components/elements';
import AddNewRule from './AddNewRule';
import EditRules from './EditRules';
import PreviewProducts from './PreviewProducts';
import {
  RuleEngine, AddSets, DiffSets, formatDifference,
} from '../RuleEngine';


import './style.scss';
import PreviewGrid from './PreviewGrid';

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

  const getProducts = (field, match, value, basis) => {
    const rule = RuleEngine[match](value);
    const returnValue = {
      includes: [],
      excludes: [],
    };
    let includeIndex = 0;
    let excludeIndex = 0;

    products.forEach((productItem) => {
      if (rule.test(productItem[field])) {
        if (basis === 'include') {
          returnValue.includes[includeIndex] = productItem;
          includeIndex++;
        } else {
          returnValue.excludes[excludeIndex] = productItem;
          excludeIndex++;
        }
      }
    });
    return returnValue;
  };

  const getAllmatched = (match, value, basis) => {
    const returnValue = {
      includes: [],
      excludes: [],
    };
    let includeIndex = 0;
    let excludeIndex = 0;
    const rule = RuleEngine[match](value);


    products.forEach((proItem) => {
      const values = Object.values(proItem);
      if (values.filter(item => (rule.test(item))).length > 0) {
        if (basis === 'include') {
          returnValue.includes[includeIndex] = proItem;
          includeIndex++;
        } else {
          returnValue.excludes[excludeIndex] = proItem;
          excludeIndex++;
        }
      }
    });
    return returnValue;
  };

  const filterProducts = () => {
    formatDifference();
    let filterResult = new Set();

    rules.forEach((item) => {
      const field = item.detail;
      const { match, value, basis } = item;
      if (field === '*') {
        filterResult = getAllmatched(match, value, basis);
      } else {
        filterResult = getProducts(field, match, value, basis);
      }
      AddSets(filterResult.includes, 'includes');
      AddSets(filterResult.excludes, 'excludes');
    });

    const filterProducts = Array.from(DiffSets());
    setProducts(filterProducts);
    return filterProducts.length;
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
