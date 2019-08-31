import React, { useState } from 'react';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Filter';

import { Tooltip } from 'react-tippy';

import { IconButton } from 'components/elements';
import './style.scss';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import AddNewRule from './AddNewRule';
import EditRules from './EditRules';
import PreviewProducts from './PreviewProducts';

function RulesAction(props) {
  const {
    rules,
    newRules,
    products,
  } = props;
  const [open, setOpen] = useState({
    add_rule: false,
    edit_rules: false,
    preview_products: false,
  });

  const [previewProducts, setProducts] = useState([]);

  const getProducts = (field, match, value, store) => {
    const caseItensitiveMatch = new RegExp(`${value}`, 'i');
    const caseSensitiveMatch = new RegExp(`${value}`);
    products.forEach((productItem) => {
      switch (match) {
        case ':=':
          if (productItem[field] === value) {
            store.push(productItem);
          }
          break;
        case '::':
          if (caseItensitiveMatch.test(productItem[field])) {
            store.push(productItem);
          }
          break;
        case ':':
          if (caseSensitiveMatch.test(productItem[field])) {
            store.push(productItem);
          }
          break;
        case ':<=':
          if (typeof productItem[field]) {
            const checkVal = parseInt(productItem[field], 10);
            if (checkVal <= value) {
              store.push(productItem);
            }
          }
          break;
        case ':>=':
          if (typeof productItem[field]) {
            const checkVal = parseInt(productItem[field], 10);
            if (checkVal >= value) {
              store.push(productItem);
            }
          }
          break;
        case ':<':
          if (typeof productItem[field]) {
            const checkVal = parseInt(productItem[field], 10);
            if (checkVal < value) {
              store.push(productItem);
            }
          }
          break;
        case ':>':
          if (typeof productItem[field]) {
            const checkVal = parseInt(productItem[field], 10);
            if (checkVal > value) {
              store.push(productItem);
            }
          }
          break;
        case ':==':
          if (typeof productItem[field]) {
            const checkVal = parseInt(productItem[field], 10);
            if (checkVal === value) {
              store.push(productItem);
            }
          }
          break;
        default:
          break;
      }
    });
  };
  const filterProducts = () => {
    const filterProducts = [];
    rules.forEach((item) => {
      const field = item.detail;
      const { match } = item;
      const { value } = item;
      getProducts(field, match, value, filterProducts);
    });
    setProducts(filterProducts.filter((e, i) => filterProducts.indexOf(e) >= i));
  };

  const handleToggle = field => () => {
    if (field === 'preview_products') {
      filterProducts();
    }
    setOpen({
      ...open,
      [field]: !open[field],
    });
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
        title="Save Properties"
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
  products: store.productsData.products,
});

export default connect(
  mapStateToProps,
)(RulesAction);
