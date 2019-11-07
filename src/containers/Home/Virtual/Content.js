import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { updateCategory } from 'redux/actions/categories';

import DetailTable from 'components/DetailTable';
import { CustomTab } from 'components/elements';
import { Association, NewRules } from 'components/Virtual/';
import Properties from 'components/Properties';

const tabs = [
  { value: 'properties', label: 'Properties' },
  { value: 'attributes', label: 'Attributes' },
  { value: 'rules', label: 'Rules' },
  { value: 'history', label: 'History' },
];

function Content({
  category,
  isUpdating,
  updateCategory,
}) {
  const [tab, setTab] = useState('properties');

  const handleClick = (value) => () => { setTab(value); };

  return (
    <div className="virtual-container">
      <CustomTab
        tabs={tabs}
        value={tab}
        onClick={handleClick}
      />

      <div className="virtual-content">
        {tab === 'history' && <DetailTable type="virtual" />}
        {tab === 'properties' && (
          <Properties
            objectItem={category}
            updateObject={updateCategory}
            isObjectUpdating={isUpdating}
          />
        )}
        {tab === 'attributes' && <Association />}
        {tab === 'rules' && <NewRules />}
      </div>
    </div>
  );
}

Content.propTypes = {
  isUpdating: PropTypes.bool.isRequired,
  category: PropTypes.object.isRequired,
  updateCategory: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  isUpdating: store.categoriesData.isUpdating,
  category: store.categoriesData.category,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateCategory,
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content);
