import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MaterialTable from 'material-table';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { convertDateFormat } from 'utils';
import { tableIcons } from 'utils/constants';

import './style.scss';

function DetailTable({ categories, category }) {
  const parentId = category ? category.id : '';
  const childrenCategories = categories.filter(c => c.parentId === parentId);

  const tableData = {
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Created Date', field: 'createdAt' },
      { title: 'Updated Date', field: 'updatedAt' },
    ],
    data: childrenCategories.map(c => ({
      name: c.name,
      createdAt: convertDateFormat(c.createdAt),
      updatedAt: convertDateFormat(c.updatedAt),
    })),
  };

  return (
    <div className="mg-detail-table">
      <PerfectScrollbar
        options={{
          minScrollbarLength: 50,
          suppressScrollX: true,
        }}
      >
        <MaterialTable
          icons={tableIcons}
          columns={tableData.columns}
          data={tableData.data}
          options={{
            actionsColumnIndex: -1,
            paging: false,
            // search: false,
            // showTitle: false,
            toolbar: false,
          }}
        />
      </PerfectScrollbar>
    </div>
  );
}

DetailTable.propTypes = {
  categories: PropTypes.array.isRequired,
  category: PropTypes.object,
};

DetailTable.defaultProps = {
  category: null,
};

const mapStateToProps = store => ({
  categories: store.categoriesData.categories,
  category: store.categoriesData.category,
});

export default connect(mapStateToProps)(DetailTable);
