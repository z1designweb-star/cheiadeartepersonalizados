
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.ts';
import { Profile as ProfileType } from '../../types.ts';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, Phone, Mail, LogOut, ArrowLeft, Loader2, Package } from 'lucide-react';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-[#f4d3d2]" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <Link to="/" className="inline-flex items-center text-sm text-gray-400 hover:text-[#f4d3d2] mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para a loja
          </Link>
          <h1 className="text-4xl font-serif font-bold text-gray-900">Olá, {profile?.full_name?.split(' ')[0]}!</h1>
          <p className="text-gray-500">Bem-vinda à sua área exclusiva.</p>
        </div>
        <button 
          onClick={() => supabase.auth.signOut().then(() => navigate('/'))}
          className="flex items-center gap-2 px-6 py-3 border-2 border-red-50 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" /> Sair
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Informações Pessoais */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-serif font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-[#f4d3d2]" /> Seus Dados
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Nome Completo</p>
                <p className="text-gray-900 font-medium">{profile?.full_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">CPF</p>
                <p className="text-gray-900 font-medium">{profile?.cpf}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">E-mail</p>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <Mail className="w-4 h-4 text-gray-300" /> {profile?.email}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Telefone</p>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <Phone className="w-4 h-4 text-gray-300" /> {profile?.phone}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-serif font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#f4d3d2]" /> Endereço de Entrega
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-900 leading-relaxed">
                {profile?.address_street}, {profile?.address_number} {profile?.address_complement && `- ${profile?.address_complement}`} <br/>
                {profile?.address_neighborhood} • {profile?.address_city}/{profile?.address_state} <br/>
                <span className="font-bold text-[#f4d3d2]">{profile?.cep}</span>
              </p>
            </div>
          </section>
        </div>

        {/* Sidebar de Ações */}
        <div className="space-y-6">
          <div className="bg-[#f4d3d2] p-8 rounded-3xl text-white shadow-lg shadow-[#f4d3d2]/20">
            <Package className="w-10 h-10 mb-4 opacity-50" />
            <h3 className="text-xl font-serif font-bold mb-2">Meus Pedidos</h3>
            <p className="text-sm opacity-80 mb-6">Acompanhe o status de suas compras artesanais.</p>
            <button className="w-full py-3 bg-white text-[#f4d3d2] rounded-xl font-bold text-sm shadow-sm hover:scale-105 transition-all">
              Ver Histórico
            </button>
          </div>

          <div className="p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center">
            <p className="text-xs text-gray-400 font-medium">Precisa alterar algum dado? Entre em contato pelo nosso WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
