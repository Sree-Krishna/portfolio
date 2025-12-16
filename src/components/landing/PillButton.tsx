import React from 'react';

type PillButtonProps = {
  ariaLabel: string;
  left: string;
  top: string;
  width: number;
  height: number;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

const PillButton: React.FC<PillButtonProps> = ({ ariaLabel, left, top, width, height, onClick, onMouseEnter, onMouseLeave }) => {
  return (
    <button
      aria-label={ariaLabel}
      className="matrix-pill-btn"
      style={{
        position: 'absolute',
        left,
        top,
        width: `${width}px`,
        height: `${height}px`,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        zIndex: 10,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      tabIndex={0}
    />
  );
};

export default PillButton;
