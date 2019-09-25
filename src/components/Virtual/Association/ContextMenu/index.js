import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

function ContextMenu({
  open,
  handleClose,
  info,
}) {
  const handleClick = (event) => {
    const target = document.getElementsByClassName('context-menu-container');
    const currentX = event.clientX;
    const currentY = event.clientY;
    const infX = info.positionX;
    const sufX = infX + target[0].clientWidth;
    const infY = info.positionY;
    const sufY = infY + target[0].clientHeight;
    if (currentX < infX || currentX > sufX || currentY < infY || currentY > sufY) {
      handleClose();
    }
  };
  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => { window.removeEventListener('click', handleClick); };
  });
  return (
    open
    && (
      <div
        className="context-menu-container"
        style={{
          top: `${info.positionY}px`,
          left: `${info.positionX}px`,
        }}
      >
        {info.label}
      </div>
    )
  );
}

ContextMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  info: PropTypes.object.isRequired,
};

export default ContextMenu;
