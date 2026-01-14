
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
        // CADASTRO: Isso cria o usuário e dispara o Trigger SQL para a tabela 'profiles'
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { emailRedirectTo: window.location.origin }
        });
        
        if (error) throw error;
        
        setMessage({
          type: 'success', 
          text: 'Solicitação enviada! Se você for o primeiro usuário, seu acesso já está liberado. Tente fazer login.'
        });
        setIsSignUp(false); // Volta para o login após cadastrar
      } else {
        // LOGIN: Só funciona para usuários já existentes
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Verificar perfil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_approved')
          .eq('id', data.user?.id)
          .single();

        if (profileError) throw new Error("Perfil não encontrado. Você já se cadastrou clicando em 'Solicite aqui'?");

        if (profile?.is_approved) {
          navigate('/admin/dashboard');
        } else {
          setMessage({
            type: 'error', 
            text: 'Sua conta ainda não foi aprovada pelo administrador.'
          });
          await supabase.auth.signOut();
        }
      }
    } catch (err: any) {
      console.error("Erro na autenticação:", err);
      let errorText = err.message;
      if (err.message === 'Failed to fetch') {
        errorText = "Erro de conexão: Verifique se o SUPABASE_URL está correto no Vercel ou se há um ad-blocker ativo.";
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#f4d3d2] focus:border-transparent outline-none transition-all"
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#f4d3d2] focus:border-transparent outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-[#f4d3d2] text-white rounded-lg font-bold hover:bg-[#e6c1c0] transition-colors disabled:opacity-50 shadow-md flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center"><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processando...</span>
            ) : isSignUp ? 'Enviar Solicitação' : 'Entrar'}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
            {message.type === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
            <p className="text-sm font-medium leading-tight">{message.text}</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <button
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
