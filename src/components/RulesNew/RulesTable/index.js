import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

function RulesTable(props) {
  const {
    rules,
  } = props;

  return (
    <div className="mg-rule-actions d-flex flex-column align-items-center">
      <table>
        <thead>
          <tr>
            <th>Rule`s Basis</th>
            <th>Rule`s Refer</th>
            <th>Search By Key</th>
            <th>Rule`s Value</th>
            <th>Rule`s Criteria</th>
            <th>Rule`s Scope</th>
          </tr>
        </thead>
        <tbody>
          {
            rules.map((item, key) => (
              <tr key={parseInt(key, 10)}>
                <td>
                  <label className="item">
                    {item.basis.label}
                  </label>
                </td>
                <td>
                  <label className="item">
                    {item.refer.label}
                  </label>
                </td>
                <td>
                  <label className="item">
                    {item.detail.label}
                  </label>
                </td>
                <td>
                  <label className="item">
                    {item.match.label}
                  </label>
                </td>
                <td>
                  <label className="item">
                    {item.value}
                  </label>
                </td>
                <td>
                  <label className="item">
                    {item.scope.label}
                  </label>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

RulesTable.propTypes = {
  rules: PropTypes.array.isRequired,
};

export default RulesTable;
