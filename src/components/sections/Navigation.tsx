import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import NavItem from './NavItem';
import MobileMenu from './MobileMenu';

type NavProps = {
  activeSection: string;
  onNavigate: (id: string) => void;
};

const Navigation: React.FC<NavProps> = ({ activeSection, onNavigate }) => {
  const items = ['Home', 'About', 'Skills', 'Projects', 'Contact'];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-[0_0_24px_0_#00f0ff44]">
      <nav className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div
            role="img"
            aria-label="SK logo"
            className="w-8 h-8 rounded-sm animate-pulse"
            style={{
              background: 'linear-gradient(90deg,#60a5fa,#ef4444)',
              WebkitMaskImage: 'url(https://sree-krishna.github.io/static/media/sk_w_logo.199d93cfdef10539d2e2.png)',
              maskImage: 'url(https://sree-krishna.github.io/static/media/sk_w_logo.199d93cfdef10539d2e2.png)',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
            }}
          />
        </div>

        <div className="flex items-center gap-4">
          <ul className="hidden md:flex items-center gap-4">
            {items.map((it, idx) => (
              <li key={it}>
                <button
                  onClick={() => onNavigate(it.toLowerCase())}
                  className={`relative px-3 py-1 font-medium text-sm transition-all duration-300 ${
                    activeSection === it.toLowerCase() ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {it}
                  <span className={`absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-400 to-red-600 transition-all duration-300 ${
                    activeSection === it.toLowerCase() ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </button>
              </li>
            ))}
          </ul>

          <div className="md:hidden">
            <button
              className="transform transition-transform duration-300 hover:scale-110"
              onClick={() => setIsMenuOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>
      {isMenuOpen && <MobileMenu items={items} onSelect={(id) => { onNavigate(id); setIsMenuOpen(false); }} />}
    </motion.header>
  );
};

export default Navigation;
