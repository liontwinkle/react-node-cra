import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MaterialTable from 'material-table';
import PerfectScrollbar from 'react-perfect-scrollbar';
import _union from 'lodash/union';
import { convertDateFormat } from 'utils';
import { tableIcons } from 'utils/constants';

import './style.scss';

function DetailTable({
  category, attribute, history, type, categories, attributes,
}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (history) {
      const item = (type === 'virtual') ? category : attribute;
      const items = (type === 'virtual') ? categories : attributes;
      const parentId = item ? item.id : '';
      const displayHistory = history.filter(historyItem => (historyItem.itemId === parentId));
      const childrenItems = items.filter(c => c.parentId === parentId);
      let historyData = displayHistory.map(c => ({
        action: c.label,
        createdAt: convertDateFormat(item.createdAt),
        updatedAt: convertDateFormat(c.updatedAt),
      }));
      childrenItems.forEach((cItem) => {
        historyData = _union(historyData,
          history.filter(historyItem => (historyItem.itemId === cItem.id)).map(c => ({
            action: c.label,
            createdAt: convertDateFormat(cItem.createdAt),
            updatedAt: convertDateFormat(c.updatedAt),
          })));
      });
      setData(historyData);
    }
  }, [attribute, attributes, categories, category, history, type]);


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
  categories: PropTypes.array.isRequired,
  category: PropTypes.object,
  attribute: PropTypes.object,
  attributes: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
};

DetailTable.defaultProps = {
  category: null,
  attribute: null,
};

const mapStateToProps = store => ({
  category: store.categoriesData.category,
  categories: store.categoriesData.categories,
  attributes: store.attributesData.attributes,
  attribute: store.attributesData.attribute,
  history: store.historyData.history,
});

export default connect(mapStateToProps)(DetailTable);
