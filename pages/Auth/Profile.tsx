
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.ts';
import { Profile as ProfileType, Order } from '../../types.ts';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, Phone, Mail, LogOut, ArrowLeft, Loader2, Package, CheckCircle, Clock, RefreshCw } from 'lucide-react';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProfileData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate('/login'); return; }

    const [profData, ordersData] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', session.user.id).single(),
      supabase.from('orders').select('*').eq('customer_id', session.user.id).order('created_at', { ascending: false })
    ]);

    if (profData.data) setProfile(profData.data);
    if (ordersData.data) setOrders(ordersData.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfileData();
  }, [navigate]);

  // Função para o cliente "forçar" uma atualização de status se ele souber que pagou
  const handleRefreshStatus = async (orderId: string) => {
    setUpdatingId(orderId);
    // Como não temos um backend para validar o token do MP agora,
    // simulamos uma verificação. Em um cenário real, você integraria um Webhook.
    // Para este MVP, permitimos que o usuário marque como pago se ele clicar aqui,
    // o que facilita sua gestão manual no admin.
    const { error } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', orderId);
    
    if (!error) {
      await fetchProfileData();
    }
    setUpdatingId(null);
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#f4d3d2]" /></div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <Link to="/" className="inline-flex items-center text-sm text-gray-400 hover:text-[#f4d3d2] mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para a loja
          </Link>
          <h1 className="text-4xl font-serif font-bold text-gray-900">Olá, {profile?.full_name?.split(' ')[0]}!</h1>
        </div>
        <button onClick={() => supabase.auth.signOut().then(() => navigate('/'))} className="flex items-center gap-2 px-6 py-3 border border-red-100 rounded-2xl text-red-500 font-bold hover:bg-red-50">
          <LogOut className="w-5 h-5" /> Sair
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-serif font-bold flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-[#f4d3d2]" /> Meus Pedidos
            </h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-10 text-gray-400 italic">Você ainda não realizou compras.</div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border border-gray-50 rounded-2xl p-6 bg-gray-50/30">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Pedido #{order.id.slice(0,8)}</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          order.status === 'paid' ? 'bg-green-100 text-green-600' : 
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {order.status === 'paid' ? 'Pago' : order.status === 'pending' ? 'Pendente' : order.status}
                        </div>
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => handleRefreshStatus(order.id)}
                            disabled={updatingId === order.id}
                            className="text-[9px] font-bold text-[#f4d3d2] hover:text-[#e6c1c0] flex items-center gap-1 uppercase tracking-tighter"
                          >
                            {updatingId === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                            Já paguei / Atualizar
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1 mb-4">
                      {order.items.map((item: any, i: number) => (
                        <p key={i} className="text-xs text-gray-700">{item.quantity}x {item.name}</p>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-400">{order.shipping_method}</span>
                      <span className="font-bold text-gray-900">{order.total_amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-serif font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#f4d3d2]" /> Endereço Salvo
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {profile?.address_street}, {profile?.address_number} - {profile?.address_neighborhood}<br/>
              {profile?.address_city}/{profile?.address_state} - CEP: {profile?.cep}
            </p>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-serif font-bold mb-4">Dados da Conta</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-[#f4d3d2]" /> {profile?.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-[#f4d3d2]" /> {profile?.phone}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <User className="w-4 h-4 text-[#f4d3d2]" /> {profile?.cpf}
              </div>
            </div>
          </div>
          <div className="p-6 bg-[#f4d3d2]/5 rounded-3xl border border-dashed border-[#f4d3d2]/20 text-center">
            <p className="text-xs text-gray-500">Dúvidas sobre seu pedido? Chame no WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
