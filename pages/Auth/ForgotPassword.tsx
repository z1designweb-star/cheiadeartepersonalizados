
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase.ts';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/redefinir-senha`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <Link to="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-[#f4d3d2] mb-8">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Link>

        {sent ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-serif font-bold text-gray-900">Link enviado!</h2>
            <p className="text-gray-500">Verifique sua caixa de entrada para redefinir sua senha.</p>
            <Link to="/login" className="block text-[#f4d3d2] font-bold">Voltar para Login</Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2 text-center">Esqueceu a senha?</h1>
            <p className="text-gray-500 text-center mb-8">Relaxa! Digite seu e-mail e te enviaremos um link para criar uma nova.</p>
            
            <form onSubmit={handleReset} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#f4d3d2]"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                disabled={loading}
                className="w-full py-4 bg-[#f4d3d2] text-white rounded-2xl font-bold text-lg flex items-center justify-center disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Enviar link de recuperação'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
