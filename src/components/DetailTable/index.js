import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import MaterialTable from 'material-table';

import { tableIcons, detailTableColumns } from 'utils/constants';
import { convertDateFormat } from 'utils';

import './style.scss';

function DetailTable({
  category, attribute, history, type, historyStr,
}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (historyStr !== '') {
      const item = (type === 'virtual') ? category : attribute;
      const parentId = item ? item._id : null;
      const displayHistory = history.filter((historyItem) => (historyItem.itemId === parentId.toString()));
      setData(displayHistory.map((c) => ({
        action: c.label,
        createdAt: convertDateFormat(item.createdAt),
        updatedAt: convertDateFormat(c.updatedAt),
      })));
    }
  }, [attribute, category, history, type, historyStr]);

  return (
    <div className="mg-detail-table">
      <PerfectScrollbar
        options={{ minScrollbarLength: 50, suppressScrollX: true }}
      >
        <MaterialTable
          icons={tableIcons}
          columns={detailTableColumns}
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
  historyStr: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  category: PropTypes.object,
  attribute: PropTypes.object,
};

DetailTable.defaultProps = {
  category: null,
  attribute: null,
};

const mapStateToProps = (store) => ({
  history: store.historyData.history,
  historyStr: store.historyData.historyStr,
  category: store.categoriesData.category,
  attribute: store.attributesData.attribute,
});

export default connect(mapStateToProps)(DetailTable);
