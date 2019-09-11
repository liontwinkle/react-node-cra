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
  RuleEngine, AddSets, getData, formatProductsData,
} from '../RuleEngine';


import './style.scss';

function RulesAction({ rules, newRules, products }) {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState({
    add_rule: false,
    edit_rules: false,
    preview_products: false,
  });

  const [previewProducts, setProducts] = useState([]);

  const getProducts = (field, match, value) => {
    console.log('-------- RulesTable.getProducts --------');
    console.log('Match:', match);
    console.log('Field (Key):', field);
    console.log('Value (Criteria):', value);

    const rule = RuleEngine[match](value);
    const returnValue = [];
    let index = 0;

    products.forEach((productItem) => {
      if (rule.test(productItem[field])) {
        console.log('================== Match: ================== ', match);
        console.log('Field (Key):', field);
        console.log('Value (Criteria):', value);
        console.log('MATCH!', productItem[field]);
        console.log('rule.test(productItem[field])', rule.test(productItem[field]));
        returnValue[index] = productItem;
        index++;
      }
    });
    return returnValue;
  };

  const getAllmatched = (match, value) => {
    console.log('-------- RulesTable.getAllmatched --------');
    const returnValue = [];
    let index = 0;
    const rule = RuleEngine[match](value);
    products.forEach((proItem) => {
      const values = Object.values(proItem);
      if (values.filter(item => (rule.test(item))).length > 0) {
        console.log('================== Match: ================== ', match);
        returnValue[index] = proItem;
        index++;
      }
    });
    return returnValue;
  };

  const filterProducts = () => {
    console.log('RulesAction.filterProducts');
    formatProductsData();
    let filterResult = new Set();
    rules.forEach((item) => {
      const field = item.detail;
      const { match } = item;
      const { value } = item;
      if (field === '*') {
        filterResult = getAllmatched(match, value);
      } else {
        filterResult = getProducts(field, match, value);
      }
      AddSets(filterResult); // fixme
    });
    const filterProducts = Array.from(getData().union);
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
        <PreviewProducts
          open={open.preview_products}
          handleClose={handleToggle('preview_products')}
          filterProducts={previewProducts}
        />
      )}
    </div>
  );
}

RulesAction.propTypes = {
  rules: PropTypes.array.isRequired,
  newRules: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
};

const mapStateToProps = store => ({
  products: store.productsData.data.products,
});

export default connect(
  mapStateToProps,
)(RulesAction);
