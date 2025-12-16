import React from 'react';

type GlowOverlayProps = {
  style: React.CSSProperties;
};

const GlowOverlay: React.FC<GlowOverlayProps> = ({ style }) => {
  return <div style={style} />;
};

export default GlowOverlay;
