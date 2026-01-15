
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase.ts';
import { Loader2, Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      if (redirect === 'cart') {
        navigate('/');
        // Trigger sidebar opening could be done via context if needed
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <Link to="/" className="inline-flex items-center text-sm text-gray-400 hover:text-[#f4d3d2] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para a loja
        </Link>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Bem-vinda de volta</h1>
          <p className="text-gray-500">Entre para continuar suas compras na Cheia de Arte.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#f4d3d2] focus:bg-white outline-none transition-all"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Senha</label>
              <Link to="/esqueci-senha" size="sm" className="text-xs font-semibold text-[#f4d3d2] hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#f4d3d2] focus:bg-white outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500 font-bold bg-red-50 p-3 rounded-lg text-center animate-pulse">{error}</p>}

          <button
            disabled={loading}
            className="w-full py-4 bg-[#f4d3d2] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-[#f4d3d2]/20 hover:bg-[#e6c1c0] transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><LogIn className="w-5 h-5" /> Entrar</>}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-[#f4d3d2] font-bold hover:underline">
              Crie uma agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
