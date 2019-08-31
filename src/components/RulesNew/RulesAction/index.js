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
  } = props;
  const [open, setOpen] = useState({
    add_rule: false,
    edit_rules: false,
    preview_products: false,
  });

  // const [previewProducts, setProducts] = useState([]);
  const getProducts = (field, match, value, store) => {
    console.log(field, ',', match, ',', value, ',>>>>> \n', store);// fixme
  };
  const filterProducts = () => {
    const filterProducts = [];
    rules.forEach((item) => {
      const field = item.detail;
      const { match } = item;
      const { value } = item;
      getProducts(field, match, value, filterProducts);
    });
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
        <PreviewProducts open={open.preview_products} handleClose={handleToggle('preview_products')} rules={rules} />
      )}
    </div>
  );
}

RulesAction.propTypes = {
  rules: PropTypes.array.isRequired,
  newRules: PropTypes.array.isRequired,
};

const mapStateToProps = store => ({
  products: store.productsData.products,
});

export default connect(
  mapStateToProps,
)(RulesAction);
