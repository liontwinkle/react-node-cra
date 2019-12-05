import React, { useEffect, useState, useCallback } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import useEventListener from './use-event-listenr';

import './style.scss';

function CustomSelect(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = useCallback((target = null) => (event = null) => {
    if (target === null) {
      setAnchorEl(anchorEl ? null : (event && event.currentTarget));
    } else {
      setAnchorEl(target);
    }
  }, [anchorEl]);

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

  const handleClickOutside = useCallback(
    (event) => {
      if (
        popperRef && popperRef.contains && !popperRef.contains(event.target)
      && wrapperRef && wrapperRef.contains && !wrapperRef.contains(event.target)
      ) {
        const { value, items, placeholder } = props;

        let current;
        const isValueString = typeof value === 'string';
        if (isValueString) {
          current = items.find((item) => item.key === value);
        } else {
          current = value;
        }
        setCurrentValue((current && current.label) || placeholder);
        setSearchedItems(items);
        handleClick(null)();
      }
    }, [handleClick, popperRef, props, wrapperRef],
  );

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
  }, [props, currentValue, editable]);

  useEventListener('mousedown', handleClickOutside);

  const handleInput = (event) => {
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
    const target = event.currentTarget.parentNode.parentNode;
    handleClick(target)();
  };

  const changeValue = (value) => () => {
    if (!props.disabled) {
      setEditable(false);
      props.onChange(value);
      handleClick(null)();
    }
  };

  const {
    className,
    value,
  } = props;


  const isOpened = Boolean(anchorEl);
  const id = isOpened ? 'mg-popper' : undefined;

  const maxHeight = 400;
  const height = Math.min(maxHeight, searchedItems.length * 30 + 1);

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
        onClick={handleClick(null)}
      >
        <input
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
