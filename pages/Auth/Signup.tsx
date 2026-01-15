
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase.ts';
import { Loader2, ArrowLeft } from 'lucide-react';

const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    cpf: '',
    birth_date: '',
    phone: '',
    cep: '',
    address_street: '',
    address_number: '',
    address_complement: '',
    address_neighborhood: '',
    address_city: '',
    address_state: ''
  });

  const handleCepBlur = async () => {
    const cep = formData.cep.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            address_street: data.logradouro,
            address_neighborhood: data.bairro,
            address_city: data.localidade,
            address_state: data.uf
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP");
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erro ao criar usuário.");

      // 2. Criar perfil no DB (profiles)
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: formData.email,
        full_name: formData.full_name,
        cpf: formData.cpf,
        birth_date: formData.birth_date,
        phone: formData.phone,
        cep: formData.cep,
        address_street: formData.address_street,
        address_number: formData.address_number,
        address_complement: formData.address_complement,
        address_neighborhood: formData.address_neighborhood,
        address_city: formData.address_city,
        address_state: formData.address_state,
        is_approved: true, // Clientes são pré-aprovados para compra
        is_admin: false
      });

      if (profileError) throw profileError;

      alert("Conta criada com sucesso! Verifique seu e-mail para confirmar o acesso.");
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
        <Link to="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-[#f4d3d2] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para Login
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Crie sua conta</h1>
          <p className="text-gray-500">Preencha seus dados para uma entrega segura.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-8">
          {/* Dados Pessoais */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-[#f4d3d2] uppercase tracking-widest border-b border-gray-100 pb-2">Informações Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nome Completo</label>
                <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#f4d3d2] focus:bg-white" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">CPF</label>
                <input required placeholder="000.000.000-00" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#f4d3d2] focus:bg-white" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Data de Nascimento</label>
                <input type="date" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#f4d3d2] focus:bg-white" value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Telefone / WhatsApp</label>
                <input required placeholder="(00) 00000-0000" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#f4d3d2] focus:bg-white" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
          </section>

          {/* Endereço */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-[#f4d3d2] uppercase tracking-widest border-b border-gray-100 pb-2">Endereço de Entrega</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">CEP</label>
                <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#f4d3d2] focus:bg-white" value={formData.cep} onChange={e => setFormData({...formData, cep: e.target.value})} onBlur={handleCepBlur} />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Logradouro (Rua/Av)</label>
                <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#f4d3d2] focus:bg-white" value={formData.address_street} onChange={e => setFormData({...formData, address_street: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Número</label>
                <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#f4d3d2] focus:bg-white" value={formData.address_number} onChange={e => setFormData({...formData, address_number: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Complemento</label>
                <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#f4d3d2] focus:bg-white" value={formData.address_complement} onChange={e => setFormData({...formData, address_complement: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Bairro</label>
                <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#f4d3d2] focus:bg-white" value={formData.address_neighborhood} onChange={e => setFormData({...formData, address_neighborhood: e.target.value})} />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Cidade</label>
                <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#f4d3d2] focus:bg-white" value={formData.address_city} onChange={e => setFormData({...formData, address_city: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">UF (Estado)</label>
                <input required maxLength={2} placeholder="Ex: BA" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#f4d3d2] focus:bg-white uppercase" value={formData.address_state} onChange={e => setFormData({...formData, address_state: e.target.value.toUpperCase()})} />
              </div>
            </div>
          </section>

          {/* Acesso */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-[#f4d3d2] uppercase tracking-widest border-b border-gray-100 pb-2">Dados de Acesso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">E-mail</label>
                <input type="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#f4d3d2] focus:bg-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Senha</label>
                <input type="password" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#f4d3d2] focus:bg-white" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>
          </section>

          {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-4 rounded-xl">{error}</p>}

          <button
            disabled={loading}
            className="w-full py-5 bg-[#f4d3d2] text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-[#e6c1c0] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Finalizar Cadastro'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
