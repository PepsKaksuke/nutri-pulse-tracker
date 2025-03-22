
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Home, 
  CalendarCheck, 
  List, 
  User, 
  Menu, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { 
      name: 'Explorateur', 
      path: '/', 
      icon: <Home className="w-5 h-5" /> 
    },
    { 
      name: 'Mon assiette', 
      path: '/assiette', 
      icon: <CalendarCheck className="w-5 h-5" /> 
    },
    { 
      name: 'Tous les aliments', 
      path: '/aliments', 
      icon: <List className="w-5 h-5" /> 
    },
    { 
      name: 'Profil', 
      path: '/profil', 
      icon: <User className="w-5 h-5" /> 
    }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="text-xl font-bold text-nutri-green-600">NutriDex</span>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-nutri-green-600",
                location.pathname === link.path 
                  ? "text-nutri-green-600" 
                  : "text-gray-600"
              )}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Search Button (top right) */}
        <Link
          to="/"
          className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Search className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Rechercher</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="flex md:hidden items-center justify-center h-9 w-9 rounded-full hover:bg-gray-100 transition-colors"
          aria-expanded={isMenuOpen}
          aria-label="Menu principal"
        >
          {isMenuOpen ? (
            <X className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Menu className="h-[1.2rem] w-[1.2rem]" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white border-b border-gray-100 shadow-md animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 py-3 px-3 rounded-md text-sm font-medium transition-colors",
                  location.pathname === link.path 
                    ? "bg-nutri-green-50 text-nutri-green-600" 
                    : "hover:bg-gray-50"
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Bottom Navigation Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-md">
        <nav className="flex items-center justify-around">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex flex-col items-center py-2 px-3 text-xs transition-colors",
                location.pathname === link.path 
                  ? "text-nutri-green-600" 
                  : "text-gray-600"
              )}
            >
              {link.icon}
              <span className="mt-1">{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
