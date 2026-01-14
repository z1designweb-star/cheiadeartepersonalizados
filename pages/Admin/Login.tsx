
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase.ts';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Cadastro realizado! Aguarde a aprovação do administrador para acessar.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Verificar se aprovado
        const { data: profile } = await supabase.from('profiles').select('is_approved').single();
        if (profile?.is_approved) {
          navigate('/admin/dashboard');
        } else {
          setMessage('Sua conta ainda não foi aprovada pelo administrador.');
          await supabase.auth.signOut();
        }
      }
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-serif font-bold text-center mb-8 text-gray-900">
          Área Restrita
        </h2>
        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#f4d3d2] focus:border-transparent outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#f4d3d2] focus:border-transparent outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            disabled={loading}
            className="w-full py-4 bg-[#f4d3d2] text-white rounded-lg font-bold hover:bg-[#e6c1c0] transition-colors disabled:opacity-50"
          >
            {loading ? 'Processando...' : isSignUp ? 'Solicitar Acesso' : 'Entrar'}
          </button>
        </form>

        {message && (
          <p className={`mt-6 text-center text-sm ${message.includes('erro') ? 'text-red-500' : 'text-[#f4d3d2] font-medium'}`}>
            {message}
          </p>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-gray-500 text-sm hover:text-[#f4d3d2]"
          >
            {isSignUp ? 'Já tem conta? Entre aqui' : 'Não tem acesso? Solicite aqui'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
