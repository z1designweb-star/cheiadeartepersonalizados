
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase.ts';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);
  const navigate = useNavigate();

  // Se já houver uma sessão válida e aprovada, redireciona direto
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_approved')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (profile?.is_approved) {
          navigate('/admin/dashboard');
        }
      }
    };
    checkSession();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { emailRedirectTo: window.location.origin }
        });
        
        if (signUpError) throw signUpError;
        
        setMessage({
          type: 'success', 
          text: 'Solicitação enviada! Verifique seu e-mail (caixa de entrada e spam) para confirmar a conta.'
        });
        setIsSignUp(false);
      } else {
        // 1. Tentar Login
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        
        if (authError) {
          if (authError.message.includes('Email not confirmed')) {
            throw new Error("E-mail ainda não confirmado. Verifique sua caixa de entrada.");
          }
          throw authError;
        }
        
        if (!authData.user) throw new Error("Erro ao identificar usuário.");

        // 2. Tentar buscar o perfil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_approved')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Erro RLS:", profileError);
          if (profileError.code === '42P17') {
            throw new Error("Erro de recursão no Supabase. Execute o script de Reset Total no SQL Editor.");
          }
          throw new Error(`Erro de banco de dados: ${profileError.message}`);
        }

        if (!profile) {
          throw new Error("Perfil não encontrado. Tente solicitar acesso novamente.");
        }

        if (profile.is_approved) {
          setMessage({ type: 'success', text: 'Acesso concedido! Entrando...' });
          setTimeout(() => navigate('/admin/dashboard'), 1000);
        } else {
          setMessage({
            type: 'error', 
            text: 'Sua conta aguarda aprovação de um administrador.'
          });
          await supabase.auth.signOut();
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      let errorText = err.message || "Erro inesperado.";
      if (err.message?.includes('Invalid login credentials')) {
        errorText = "E-mail ou senha incorretos.";
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
          {isSignUp ? 'Crie sua conta administrativa' : 'Entre com suas credenciais'}
        </p>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#f4d3d2] outline-none"
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#f4d3d2] outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-[#f4d3d2] text-white rounded-lg font-bold text-lg flex items-center justify-center shadow-md hover:bg-[#e6c1c0] transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              isSignUp ? 'Solicitar Acesso' : 'Entrar'
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-lg border flex items-start gap-3 animate-in fade-in slide-in-from-top-1 ${
            message.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'
          }`}>
            {message.type === 'error' ? <ShieldAlert className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage(null);
            }}
            className="text-gray-500 text-sm hover:text-[#f4d3d2] font-medium"
          >
            {isSignUp ? 'Já tem conta? Faça login' : 'Não tem acesso? Solicite aqui'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
