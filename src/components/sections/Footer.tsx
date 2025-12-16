import React from 'react';
import SocialLinks from './SocialLinks';

type FooterProps = { neonBlue: string };

const Footer: React.FC<FooterProps> = ({ neonBlue }) => {
  return (
    <footer className="py-12 px-4 lg:px-8" style={{ background: '#000' }}>
      <div className="container mx-auto text-center">
        <p className="text-gray-300 mb-4">© 2025 Portfolio. Crafted with passion and precision.</p>
        <div className="flex justify-center space-x-6">
          <div className="w-2 h-2 rounded-full" style={{ background: neonBlue }} />
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="w-2 h-2 rounded-full" style={{ background: neonBlue, opacity: 0.9 }} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
