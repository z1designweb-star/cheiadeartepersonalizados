
import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from '../constants.tsx';
import { useCart } from '../context/CartContext.tsx';
import { supabase } from '../lib/supabase.ts';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { setIsCartOpen, cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          {/* Link direto para Login/Perfil no Desktop para facilitar */}
          <Link to={user ? "/perfil" : "/login"} className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#f4d3d2] transition-colors">
            <User className="w-5 h-5" />
            {user ? 'Minha Conta' : 'Entrar'}
          </Link>
        </div>

        <Link to="/" className="text-3xl font-serif font-bold tracking-tight text-gray-800">
          Cheia de Arte
        </Link>

        <div className="flex items-center space-x-2">
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

      {/* Menu Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t shadow-xl animate-in fade-in slide-in-from-top duration-300 overflow-y-auto max-h-[90vh]">
          <nav className="container mx-auto py-8 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="col-span-full mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 border-b pb-2">Departamentos</h3>
              </div>
              {DEPARTMENTS.map((dept) => (
                <Link
                  key={dept.id}
                  to={`/departamento/${dept.id}`}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-serif font-medium text-gray-700 hover:text-[#f4d3d2] transition-colors p-4 border rounded-xl hover:border-[#f4d3d2]"
                >
                  {dept.name}
                </Link>
              ))}
            </div>

            <div className="border-t pt-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">Sua Conta</h3>
              <div className="flex flex-col gap-3">
                {user ? (
                  <>
                    <Link to="/perfil" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl font-bold text-gray-700">
                      <User className="w-5 h-5 text-[#f4d3d2]" /> Ver Meu Perfil
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 p-4 text-red-500 font-bold">
                      <LogOut className="w-5 h-5" /> Sair da Conta
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 bg-[#f4d3d2] text-white rounded-xl font-bold shadow-lg shadow-[#f4d3d2]/20">
                    <User className="w-5 h-5" /> Fazer Login / Criar Conta
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
