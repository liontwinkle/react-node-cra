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
    const caseInsensitiveMatch = new RegExp(`${value}`, 'i');
    const caseSensitiveMatch = new RegExp(`${value}`);
    const returnValue = [];
    let index = 0;

    products.forEach((productItem) => {
      switch (match) {
        case ':=':
          if (productItem[field] === value) {
            returnValue[index] = productItem;
            index++;
          }
          break;
        case '::':
          if (caseInsensitiveMatch.test(productItem[field])) {
            returnValue[index] = productItem;
            index++;
          }
          break;
        case ':':
          if (caseSensitiveMatch.test(productItem[field])) {
            returnValue[index] = productItem;
            index++;
          }
          break;
        case ':<=':
          if (typeof productItem[field] === 'number') {
            if (productItem[field] <= value) {
              returnValue[index] = productItem;
              index++;
            }
          }
          break;
        case ':>=':
          if (typeof productItem[field] === 'number') {
            if (productItem[field] >= value) {
              returnValue[index] = productItem;
              index++;
            }
          }
          break;
        case ':<':
          if (typeof productItem[field] === 'number') {
            if (productItem[field] < value) {
              returnValue[index] = productItem;
              index++;
            }
          }
          break;
        case ':>':
          if (typeof productItem[field] === 'number') {
            if (productItem[field] > value) {
              returnValue[index] = productItem;
              index++;
            }
          }
          break;
        case ':==':
          if (typeof productItem[field] === 'number') {
            if (productItem[field] === value) {
              returnValue[index] = productItem;
              index++;
            }
          }
          break;
        default:
          break;
      }
    });

    return returnValue;
  };

  const getAllmatched = (match, value) => {
    const caseInsensitiveMatch = new RegExp(`${value}`, 'i');
    const caseSensitiveMatch = new RegExp(`${value}`);
    let checkValue = [];
    const returnValue = [];
    let index = 0;
    products.forEach((proItem) => {
      const values = Object.values(proItem);
      switch (match) {
        case ':=':
          if (values.filter(item => (item === value)).length > 0) {
            returnValue[index] = proItem;
            index++;
          }
          break;
        case '::':
          if (values.filter(item => caseInsensitiveMatch.test(item)).length > 0) {
            returnValue[index] = proItem;
            index++;
          }
          break;
        case ':':
          if (values.filter(item => caseSensitiveMatch.test(item)).length > 0) {
            returnValue[index] = proItem;
            index++;
          }
          break;
        case ':<=':
          checkValue = values.filter((item) => {
            if (typeof item === 'number') {
              return item <= value;
            }
            return false;
          });
          if (checkValue.length > 0) {
            returnValue[index] = proItem;
            index++;
          }
          break;
        case ':>=':
          checkValue = values.filter((item) => {
            if (typeof item === 'number') {
              return item >= value;
            }
            return false;
          });
          if (checkValue.length > 0) {
            returnValue[index] = proItem;
            index++;
          }
          break;
        case ':<':
          checkValue = values.filter((item) => {
            if (typeof item === 'number') {
              return item < value;
            }
            return false;
          });
          if (checkValue.length > 0) {
            returnValue[index] = proItem;
            index++;
          }
          break;
        case ':>':
          checkValue = values.filter((item) => {
            if (typeof item === 'number') {
              return item > value;
            }
            return false;
          });
          if (checkValue.length > 0) {
            returnValue[index] = proItem;
            index++;
          }
          break;
        case ':==':
          checkValue = values.filter((item) => {
            if (typeof item === 'number') {
              return item === value;
            }
            return false;
          });
          if (checkValue.length > 0) {
            returnValue[index] = proItem;
            index++;
          }
          break;
        default:
          break;
      }
    });
    return returnValue;
  };

  const filterProducts = () => {
    let filterProducts = [];
    rules.forEach((item) => {
      const field = item.detail;
      const { match } = item;
      const { value } = item;
      if (field === '*') {
        filterProducts = [...filterProducts, ...getAllmatched(match, value)];
      } else {
        filterProducts = [...filterProducts, ...getProducts(field, match, value)];
      }
    });
    setProducts(filterProducts.filter((e, i) => filterProducts.indexOf(e) >= i));

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
