import React from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';

function DetailView({
  headers,
  detail,
  pointX,
  pointY,
  close,
}) {
  return (
    <div
      className="info-product"
      style={{
        top: `${pointY}px`,
        left: `${pointX}px`,
      }}
      onMouseLeave={close}
    >
      {
        <PerfectScrollbar>
          <div className="info-product-container">
            <table>
              <tbody>
                {headers.map(itemKey => (
                  <tr key={itemKey}>
                    <td>
                      {`${itemKey} `}
                    </td>
                    <td>
                    :
                    </td>
                    <td>
                      {`${detail[itemKey]}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PerfectScrollbar>}
    </div>
  );
}

DetailView.propTypes = {
  headers: PropTypes.array.isRequired,
  detail: PropTypes.object.isRequired,
  pointX: PropTypes.number.isRequired,
  pointY: PropTypes.number.isRequired,
  close: PropTypes.func.isRequired,
};

export default DetailView;
