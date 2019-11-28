import React, { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import $ from 'jquery';
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import './style.scss';
import CustomInput from '../CustomInput';

function CustomSelect(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event = null) => {
    console.log('### EVENT: ', event); // fixme
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

  const [currentValue, setCurrentValue] = useState(props.placeholder);
  const [editable, setEditable] = useState(false);
  const [searchedItems, setSearchedItems] = useState([]);

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
    const { value, items } = props;

    let current;
    const isValueString = typeof value === 'string';
    if (isValueString) {
      current = items.find((item) => item.key === value);
    } else {
      current = value;
    }
    if (current && current !== currentValue && !editable) {
      setCurrentValue(current.label);
    }

    if (!editable) {
      setSearchedItems(items);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [props, handleClickOutside, currentValue, editable]);

  const handleInput = (event) => {
    console.log('### DEBUG LABEL: ', event.target.value); // fixme
    const inputVal = event.target.value;
    setEditable(true);
    let searchResult = [];
    props.items.forEach((item) => {
      if (item.label.includes(inputVal)) {
        searchResult.push(item);
      }
    });
    if (!inputVal) {
      searchResult = props.items;
    }
    setSearchedItems(searchResult);
    setCurrentValue(inputVal);
    console.log($('button.mg-select-current').data());
    handleClick($('button.mg-select-current').get(0));
  };

  const changeValue = (value) => () => {
    console.log('### DEBUG VAL: ', value); // fixme
    if (!props.disabled) {
      setEditable(false);
      props.onChange(value);
      handleClick();
    }
  };

  const {
    className,
    value,
    items,
  } = props;


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
        <CustomInput
          className="mg-select-input-section"
          value={currentValue}
          onChange={handleInput}
          type="text"
        />
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
            {searchedItems.map((item) => (
              <li
                key={item.key}
                className={`mg-select-item${(currentValue && currentValue.key) === item.key ? ' active' : ''}`}
                onClick={changeValue((typeof value === 'string') ? item.key : item)}
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
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

CustomSelect.defaultProps = {
  className: '',
  placeholder: '',
  value: null,
  disabled: false,
};

export default CustomSelect;
