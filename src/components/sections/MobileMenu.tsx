import React from 'react';

type MobileMenuProps = {
  items: string[];
  onSelect: (id: string) => void;
};

const MobileMenu: React.FC<MobileMenuProps> = ({ items, onSelect }) => {
  return (
    <div className="md:hidden bg-background/90 backdrop-blur-xl border-t border-border/50 animate-fade-in">
      <div className="py-4 space-y-4">
        {items.map((item, index) => (
          <button
            key={item}
            onClick={() => onSelect(item.toLowerCase())}
            className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
