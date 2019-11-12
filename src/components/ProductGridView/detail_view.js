import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';

function DetailView({
  headers,
  productsField,
  detail,
  pointX,
  pointY,
  width,
  height,
  close,
}) {
  return (
    <div
      className="info-product"
      style={{
        top: `${pointY}px`,
        left: `${pointX}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
      onMouseLeave={close}
    >
      <PerfectScrollbar>
        <div className="info-product-container">
          <table>
            <tbody>
              {headers.map((itemKey) => (
                ((productsField[itemKey] === undefined)
                  || productsField[itemKey].grid === (undefined || true))
                  && detail[itemKey] !== undefined
                  ? (
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
                  ) : null
              ))}
            </tbody>
          </table>
        </div>
      </PerfectScrollbar>
    </div>
  );
}

DetailView.propTypes = {
  headers: PropTypes.array.isRequired,
  productsField: PropTypes.object.isRequired,
  detail: PropTypes.object.isRequired,
  pointX: PropTypes.number.isRequired,
  pointY: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  close: PropTypes.func.isRequired,
};

export default DetailView;
