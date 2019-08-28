// import React, { useState } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { useSnackbar } from 'notistack';

import { updateCategory } from 'redux/actions/categories';

import './style.scss';

function RulesTable(props) {
  // const { enqueueSnackbar } = useSnackbar();

  const {
    rules,
    // isUpdating,
    // category,
    // updateCategory,
  } = props;

  console.log('rules>>>', rules);// fixme
  // const [open, setOpen] = useState({ add: false, edit: false });
  // const handleToggle = field => () => {
  //   setOpen({
  //     ...open,
  //     [field]: !open[field],
  //   });
  // };
  //
  // const saveRules = () => {
  //   if (!isUpdating) {
  //     updateCategory(category.id, { rules })
  //       .then(() => {
  //         enqueueSnackbar('Rules has been updated successfully.', { variant: 'success', autoHideDuration: 1000 });
  //       })
  //       .catch(() => {
  //         enqueueSnackbar('Error in updating rules.',
  //           {
  //             variant: 'error',
  //             autoHideDuration: 4000,
  //           });
  //       });
  //   }
  // };

  return (
    <div className="mg-rule-actions d-flex flex-column align-items-center">
      <table>
        <thead>
          <th>Rule`s basis:</th>
          <th>Rule`s refer:</th>
          <th>Rule`s value:</th>
          <th>Rule`s scope:</th>
        </thead>
        <tbody>
          <tr>
            <td>
            First
            </td>
            <td>
            Second
            </td>
            <td>
            Third
            </td>
            <td>
            Forth
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

RulesTable.propTypes = {
  // isUpdating: PropTypes.bool.isRequired,
  // category: PropTypes.object.isRequired,
  rules: PropTypes.array.isRequired,
  // updateCategory: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  isUpdating: store.categoriesData.isUpdating,
  category: store.categoriesData.category,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateCategory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RulesTable);
