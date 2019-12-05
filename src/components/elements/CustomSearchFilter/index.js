import React, { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import Popper from '@material-ui/core/Popper';

import { getFilterItem } from 'utils/propertyManagement';
import CustomInput from '../CustomInput';

import './style.scss';

function CustomSearchFilter({
  className,
  placeholder,
  value,
  label,
  disabled,
  searchItems,
  onChange,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [wrapperRef, setWrapperRef] = useState(null);
  const [searched, setSearched] = useState([]);
  const [searching, setSearching] = useState(false);
  const [chunkIndex, setChunkIndex] = useState(0);

  const getWrapperRef = (ref) => {
    setWrapperRef(ref);
  };

  const clearSearchResult = () => {
    setSearching(false);
    setSearched([]);
  };

  const handleChange = (event = null) => {
    const currentValue = event.target.value;
    onChange(currentValue);
    const lastLetter = currentValue[currentValue.length - 1];

    if (lastLetter === '$') {
      setSearching(true);
      setSearched(searchItems);
      setChunkIndex(currentValue.length);
    }

    if (lastLetter === ' ' || !lastLetter) {
      clearSearchResult();
    } else if (searching) {
      const filtered = getFilterItem(searchItems, currentValue.substr(chunkIndex));
      setSearched(filtered);
    }

    if (searched.length > 0) {
      setAnchorEl((event && event.currentTarget));
    } else {
      setAnchorEl(null);
    }
  };

  const changeValue = (propertyKey) => () => {
    if (!disabled) {
      const updateValue = `${value.substr(0, chunkIndex)}${propertyKey}`;
      clearSearchResult();
      onChange(updateValue);
    }
  };

  const isOpened = Boolean(anchorEl);
  const id = isOpened ? 'mg-popper' : undefined;

  const maxHeight = 400;
  const height = Math.min(maxHeight, searched.length * 30 + 1);

  let width = 0;
  if (wrapperRef) {
    ({ width } = wrapperRef.getBoundingClientRect());
  }

  return (
    <div
      className={`mg-search-filter ${className}`}
    >
      <CustomInput
        label={label}
        aria-describedby={id}
        inline
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        type="text"
        getWrapper={getWrapperRef}
      />

      <Popper
        id={id}
        open={isOpened}
        anchorEl={anchorEl}
        transition
      >
        <ul
          className={`mg-search-filter-list${isOpened ? ' active' : ''}`}
          style={{ width, height, bottom: '0' }}
        >
          <PerfectScrollbar
            options={{
              suppressScrollX: true,
              minScrollbarLength: 50,
            }}
          >
            {searched.map((item, index) => (
              <li
                key={index.toString()}
                className="mg-search-filter-item"
                onClick={changeValue(item)}
              >
                {item}
              </li>
            ))}
          </PerfectScrollbar>
        </ul>
      </Popper>
    </div>
  );
}

CustomSearchFilter.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  searchItems: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

CustomSearchFilter.defaultProps = {
  className: '',
  placeholder: '',
  value: '',
  label: '',
  disabled: false,
};

export default CustomSearchFilter;
