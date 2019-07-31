import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import './style.scss';

class CustomSelect extends Component {
  state = {
    isOpened: false,
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.state.isOpened
      && this.wrapperRef
      && this.wrapperRef.contains
      && !this.wrapperRef.contains(event.target)
    ) {
      this.toggle();
    }
  };

  getWrapperRef = (ref) => {
    this.wrapperRef = ref;
  };

  toggle = () => {
    this.setState(prevState => ({
      isOpened: !prevState.isOpened,
    }));
  };

  changeValue = value => () => {
    this.props.onChange(value);
    this.toggle();
  };

  render() {
    const { isOpened } = this.state;
    const {
      className,
      placeholder,
      value: current,
      items,
    } = this.props;

    const maxHeight = 400;
    const height = Math.min(maxHeight, items.length * 30 + 1);

    return (
      <div
        className={`mg-select-control ${className}`}
        ref={this.getWrapperRef}
      >
        <div
          className={`mg-select-current${isOpened ? ' active' : ''}`}
          onClick={this.toggle}
        >
          {(current && current.label) || placeholder}

          <ArrowDropDownIcon />
        </div>

        {isOpened && (
          <ul
            className={`mg-select-list${isOpened ? ' active' : ''}`}
            style={{ height }}
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
                  onClick={this.changeValue(item)}
                >
                  {item.label}
                </li>
              ))}
            </PerfectScrollbar>
          </ul>
        )}
      </div>
    );
  }
}

CustomSelect.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.object,
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

CustomSelect.defaultProps = {
  className: '',
  placeholder: '',
  value: null,
};

export default CustomSelect;
