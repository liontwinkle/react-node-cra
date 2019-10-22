/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Popper from '@material-ui/core/Popper';
import './style.scss';
import { CustomInput } from '../index';

function CustomSearchFilter(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searched, setSearched] = useState([]);
  const {
    className,
    placeholder,
    value,
    label,
    searchItems,
  } = props;

  const [wrapperRef, setWrapperRef] = useState(null);
  const getWrapperRef = (ref) => {
    setWrapperRef(ref);
  };

  const [popperRef, setPopperRef] = useState(null);
  const getPopperRef = (ref) => {
    setPopperRef(ref);
  };


  const handleChange = (event = null) => {
    console.log(searchItems); // fixme
    // setAnchorEl(anchorEl ? null : (event && event.currentTarget));
    console.log('##### DEBUG EVENT: ', event.target.value); // fixme
  };

  const changeValue = value => () => {
    if (!props.disabled) {
      console.log('##### DEBUG VALUE: ', value); // fixme
      props.onChange(value);
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
      ref={getWrapperRef}
    >
      <CustomInput
        label={label}
        aria-describedby={id}
        inline
        value={value}
        onChange={handleChange}
        type="text"
      />

      <Popper
        id={id}
        open={isOpened}
        anchorEl={anchorEl}
        transition
      >
        <ul
          className={`mg-search-filter-list${isOpened ? ' active' : ''}`}
          ref={getPopperRef}
          style={{ width, height, bottom: '0' }}
        >
          <PerfectScrollbar
            options={{
              suppressScrollX: true,
              minScrollbarLength: 50,
            }}
          >
            {searched.map(item => (
              <li
                key={item.key}
                className="mg-search-filter-item"
                onClick={changeValue(item.key)}
              >
                {item.key}
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
  value: null,
  label: '',
  disabled: false,
};

export default CustomSearchFilter;
