import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MaterialTable from 'material-table';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { convertDateFormat } from 'utils';
import { tableIcons } from 'utils/constants';

import './style.scss';

function DetailTable({
  category, attribute, history, type,
}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (history) {
      const item = (type === 'virtual') ? category : attribute;
      const parentId = item ? item.id : '';
      const displayHistory = history.filter(historyItem => (historyItem.itemId === parentId));
      setData(displayHistory.map(c => ({
        action: c.label,
        createdAt: convertDateFormat(item.createdAt),
        updatedAt: convertDateFormat(c.updatedAt),
      })));
    }
  }, [attribute, category, history, type]);


  const columns = [
    { title: 'Action', field: 'action' },
    { title: 'Created Date', field: 'createdAt' },
    { title: 'Updated Date', field: 'updatedAt' },
  ];

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
          columns={columns}
          data={data}
          options={{
            actionsColumnIndex: -1,
            paging: false,
            toolbar: false,
          }}
        />
      </PerfectScrollbar>
    </div>
  );
}

DetailTable.propTypes = {
  history: PropTypes.array.isRequired,
  category: PropTypes.object,
  attribute: PropTypes.object,
  type: PropTypes.string.isRequired,
};

DetailTable.defaultProps = {
  category: null,
  attribute: null,
};

const mapStateToProps = store => ({
  category: store.categoriesData.category,
  attribute: store.attributesData.attribute,
  history: store.historyData.history,
});

export default connect(mapStateToProps)(DetailTable);
