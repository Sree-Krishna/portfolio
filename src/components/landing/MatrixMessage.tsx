import React from 'react';

const MatrixMessage: React.FC = () => {
  return (
    <div
      className="matrix-message"
      style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '12vh',
        width: '70vw',
        textAlign: 'center',
        fontFamily: "'Orbitron', 'Courier New', Courier, monospace",
        fontSize: '0.9rem',
        color: '#00ff00',
        letterSpacing: '0.1em',
        zIndex: 20,
        userSelect: 'none',
        fontWeight: 200,
        textTransform: 'uppercase',
        opacity: 0.75,
      }}
    >
      THE CHOICE IS AN ILLUSION. YOU ALREADY KNOW WHAT YOU HAVE TO DO.
    </div>
  );
};

export default MatrixMessage;
