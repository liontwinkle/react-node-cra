import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import './style.scss';

function CustomSelect(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event = null) => {
    setAnchorEl(anchorEl ? null : (event && event.currentTarget));
  };

  const [wrapperRef, setWrapperRef] = useState(null);
  const getWrapperRef = (ref) => {
    setWrapperRef(ref);
  };

  const [popperRef, setPopperRef] = useState(null);
  const getPopperRef = (ref) => {
    setPopperRef(ref);
  };

  const handleClickOutside = (event) => {
    if (
      anchorEl
      && popperRef && popperRef.contains && !popperRef.contains(event.target)
      && wrapperRef && wrapperRef.contains && !wrapperRef.contains(event.target)
    ) {
      handleClick();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const changeValue = value => () => {
    props.onChange(value);
    handleClick();
  };

  const {
    className,
    placeholder,
    value,
    items,
  } = props;

  let current;
  const isValueString = typeof value === 'string';
  if (isValueString) {
    current = items.find(item => item.key === value);
  } else {
    current = value;
  }

  const isOpened = Boolean(anchorEl);
  const id = isOpened ? 'mg-popper' : undefined;

  const maxHeight = 400;
  const height = Math.min(maxHeight, items.length * 30 + 1);

  let width = 0;
  if (wrapperRef) {
    ({ width } = wrapperRef.getBoundingClientRect());
  }

  return (
    <div
      className={`mg-select-control ${className}`}
      ref={getWrapperRef}
    >
      <Button
        className={`mg-select-current${isOpened ? ' active' : ''}`}
        aria-describedby={id}
        variant="outlined"
        onClick={handleClick}
      >
        {(current && current.label) || placeholder}

        <ArrowDropDownIcon />
      </Button>

      <Popper
        id={id}
        open={isOpened}
        anchorEl={anchorEl}
        transition
      >
        <ul
          className={`mg-select-list${isOpened ? ' active' : ''}`}
          ref={getPopperRef}
          style={{ width, height, bottom: '0' }}
        >
          <PerfectScrollbar
            options={{
              suppressScrollX: true,
              minScrollbarLength: 50,
            }}
          >
            {items.map(item => (
              <li
                key={item.key}
                className={`mg-select-item${(current && current.key) === item.key ? ' active' : ''}`}
                onClick={changeValue(isValueString ? item.key : item)}
              >
                {item.label}
              </li>
            ))}
          </PerfectScrollbar>
        </ul>
      </Popper>
    </div>
  );
}

CustomSelect.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

CustomSelect.defaultProps = {
  className: '',
  placeholder: '',
  value: null,
};

export default CustomSelect;
