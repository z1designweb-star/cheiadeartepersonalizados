
import React, { useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DEPARTMENTS } from '../constants.tsx';
import { useCart } from '../context/CartContext.tsx';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsCartOpen, cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <Link to="/" className="text-3xl font-serif font-bold tracking-tight text-gray-800">
          Cheia de Arte
        </Link>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#f4d3d2] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile/Desktop Sandwich Menu Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t shadow-xl animate-in fade-in slide-in-from-top duration-300">
          <nav className="container mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-full mb-4 text-center">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Explore Nossos Departamentos</h3>
            </div>
            {DEPARTMENTS.map((dept) => (
              <Link
                key={dept.id}
                to={`/departamento/${dept.id}`}
                onClick={() => setIsOpen(false)}
                className="text-lg font-serif font-medium text-gray-700 hover:text-[#f4d3d2] transition-colors p-4 border rounded-xl hover:border-[#f4d3d2] text-center"
              >
                {dept.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
