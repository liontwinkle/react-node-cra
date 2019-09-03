import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const ExportDataSection = ({ onExportCsv, onExportStr, onSaveData }) => (
  <div className="export-button">
    <button id="export-csv" onClick={onExportCsv}>
      Export to a .csv file
    </button>
    <button id="export-json" onClick={onExportStr}>
      Export to string
    </button>
    <button id="update_db" onClick={onSaveData}>
      Update Database
    </button>
  </div>
);

ExportDataSection.propTypes = {
  onExportCsv: PropTypes.func.isRequired,
  onExportStr: PropTypes.func.isRequired,
  onSaveData: PropTypes.func.isRequired,
};

export default ExportDataSection;
