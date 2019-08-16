import React from 'react';
import './style.scss';

function CalcAverage() {
  return (
    <div className="export-button">
      <button id="export-csv">
        Export to a .csv file
      </button>
      <button id="export-json">
        Export to string
      </button>
      <button id="update_db">
        Update Database
      </button>
    </div>
  );
}

export default CalcAverage;
