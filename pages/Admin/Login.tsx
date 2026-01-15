
import React, { useState } from 'react';
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
          text: 'Solicitação enviada! Por favor, verifique seu e-mail e clique no link de confirmação antes de tentar logar.'
        });
        setIsSignUp(false);
      } else {
        // 1. Tentar Login
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        
        if (!authData.user) throw new Error("Usuário não retornado pelo sistema.");

        // 2. Tentar buscar o perfil para checar aprovação
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_approved, is_admin')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Erro no Perfil:", profileError);
          if (profileError.code === '42P17') {
            throw new Error("Erro de recursão detectado no Supabase. Por favor, execute o NOVO script SQL de correção (v2) que te enviei.");
          }
          throw new Error(`Erro ao acessar banco de dados: ${profileError.message}`);
        }

        if (!profile) {
          // Se o login funcionou mas o perfil não existe na tabela 'profiles'
          throw new Error("Seu usuário de login existe, mas não encontramos seus dados na tabela de perfis. Tente solicitar acesso novamente.");
        }

        if (profile.is_approved) {
          setMessage({ type: 'success', text: 'Login realizado! Redirecionando...' });
          setTimeout(() => navigate('/admin/dashboard'), 1500);
        } else {
          setMessage({
            type: 'error', 
            text: 'Sua conta ainda não foi aprovada por um administrador. Aguarde a aprovação.'
          });
          await supabase.auth.signOut();
        }
      }
    } catch (err: any) {
      console.error("Erro de Autenticação:", err);
      let errorText = err.message || "Ocorreu um erro inesperado.";
      
      if (err.status === 400 || err.message?.includes('Invalid login credentials')) {
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
            className="w-full py-4 bg-[#f4d3d2] text-white rounded-lg font-bold text-lg flex items-center justify-center shadow-md hover:bg-[#e6c1c0] transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              isSignUp ? 'Enviar Solicitação' : 'Entrar'
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-lg border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
            message.type === 'error' 
              ? 'bg-red-50 text-red-700 border-red-100' 
              : 'bg-green-50 text-green-700 border-green-100'
          }`}>
            {message.type === 'error' ? <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />}
            <p className="text-sm font-medium leading-relaxed">{message.text}</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <button
            disabled={loading}
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage(null);
            }}
            className="text-gray-500 text-sm hover:text-[#f4d3d2] font-medium transition-colors"
          >
            {isSignUp ? 'Já tem conta? Faça login aqui' : 'Não tem acesso? Solicite aqui'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
