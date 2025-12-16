import React from 'react';

type NavItemProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

const NavItem: React.FC<NavItemProps> = ({ label, active = false, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`relative px-3 py-1 font-semibold text-sm rounded transition-colors duration-200 ${
          active ? 'text-blue-400' : 'text-blue-100 hover:text-red-400'
        }`}
      >
        {label}
        {active && <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-2/3 h-0.5 bg-gradient-to-r from-blue-400 to-red-400 rounded-full animate-pulse" />}
      </button>
    </li>
  );
};

export default NavItem;
