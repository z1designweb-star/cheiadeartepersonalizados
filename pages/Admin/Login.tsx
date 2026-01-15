
// Adicionando import de React para resolver erros de namespace 'React' (FC, FormEvent)
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase.ts';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { emailRedirectTo: window.location.origin }
        });
        
        if (error) throw error;
        
        setMessage({
          type: 'success', 
          text: 'Solicitação enviada! Verifique seu e-mail para confirmar a conta antes de tentar logar.'
        });
        setIsSignUp(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        if (!data.user) throw new Error("Usuário não encontrado.");

        // Tentar buscar o perfil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_approved, is_admin')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error("Erro ao buscar perfil:", profileError);
          // Se der erro 500 ou similar, é provável que faltem as políticas de RLS
          throw new Error("Erro de permissão no banco de dados. Verifique se as políticas RLS foram configuradas no SQL Editor do Supabase.");
        }

        if (profile?.is_approved) {
          navigate('/admin/dashboard');
        } else {
          setMessage({
            type: 'error', 
            text: 'Sua conta ainda não foi aprovada por um administrador.'
          });
          await supabase.auth.signOut();
        }
      }
    } catch (err: any) {
      console.error("Erro detalhado:", err);
      let errorText = err.message;
      
      if (err.status === 400 || err.message?.includes('Invalid login credentials')) {
        errorText = "E-mail ou senha incorretos.";
      } else if (err.message?.includes('Database error')) {
        errorText = "Erro no banco de dados. Verifique as permissões RLS no Supabase.";
      }

      setMessage({ type: 'error', text: errorText });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-serif font-bold text-center mb-2 text-gray-900">
          {isSignUp ? 'Solicitar Acesso' : 'Área Restrita'}
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          {isSignUp ? 'Preencha os dados para ser um administrador' : 'Entre com seu e-mail e senha'}
        </p>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#f4d3d2] outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#f4d3d2] outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-[#f4d3d2] text-white rounded-lg font-bold hover:bg-[#e6c1c0] transition-colors disabled:opacity-50 shadow-md flex items-center justify-center"
          >
            {loading ? 'Carregando...' : isSignUp ? 'Enviar Solicitação' : 'Entrar'}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message.type === 'error' ? <AlertCircle className="w-5 h-5 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 mt-0.5" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage(null);
            }}
            className="text-gray-500 text-sm hover:text-[#f4d3d2] font-medium"
          >
            {isSignUp ? 'Já tem conta? Faça login aqui' : 'Não tem acesso? Solicite aqui'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
