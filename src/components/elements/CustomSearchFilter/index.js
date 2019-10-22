import React, { /* useEffect, useState */ } from 'react';
import PropTypes from 'prop-types';
// import PerfectScrollbar from 'react-perfect-scrollbar';
// import Popper from '@material-ui/core/Popper';
import Input from '@material-ui/core/Input';
import './style.scss';

function CustomSearchFilter(props) {
  // const [anchorEl, setAnchorEl] = useState(null);
  const {
    className,
    // placehodler,
    // value,
    // searchItems,
  } = props;

  // const [wrapperRef, setWrapperRef] = useState(null);
  // const getWrapperRef = (ref) => {
  //   setWrapperRef(ref);
  // };
  //
  // const [popperRef, setPopperRef] = useState(null);
  // const getPopperRef = (ref) => {
  //   setPopperRef(ref);
  // };

  // const isOpened = Boolean(anchorEl);
  // const id = isOpened ? 'mg-popper' : undefined;
  //
  // const maxHeight = 400;
  // const height = Math.min(maxHeight, searchItems.length * 30 + 1);
  //
  // let width = 0;
  // if (wrapperRef) {
  //   ({ width } = wrapperRef.getBoundingClientRect());
  // }

  return (
    <div
      className={`mg-search-filter ${className}`}
      // ref={getWrapperRef}
    >
      <Input />
    </div>
  );
}

CustomSearchFilter.propTypes = {
  className: PropTypes.string,
  // placeholder: PropTypes.string,
  // value: PropTypes.string,
  // searchItems: PropTypes.array.isRequired,
  // onChange: PropTypes.func.isRequired,
  // disabled: PropTypes.bool,
};

CustomSearchFilter.defaultProps = {
  className: '',
  // placeholder: '',
  // value: null,
  // disabled: false,
};

export default CustomSearchFilter;
