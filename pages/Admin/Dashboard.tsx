
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.ts';
import { Product, Profile, Order } from '../../types.ts';
import { Link, useNavigate } from 'react-router-dom';
import { formatDriveUrl } from '../../lib/utils.ts';
import { Edit, Trash2, Plus, Users, Package, LogOut, CheckCircle, TrendingUp, ShoppingCart, Clock, CheckCircle2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'users'>('orders');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingUsers, setPendingUsers] = useState<Profile[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/admin/login'); return; }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!profile?.is_admin || !profile?.is_approved) { navigate('/admin/login'); return; }
    setCurrentUser(profile);

    const [prods, ords, users] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*, profiles(full_name, email, phone, cep, address_street, address_number, address_complement, address_neighborhood, address_city, address_state)').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').eq('is_approved', false).eq('is_admin', true)
    ]);

    if (prods.data) setProducts(prods.data);
    if (ords.data) {
      setOrders(ords.data.map(o => ({
        ...o,
        customer_name: (o.profiles as any)?.full_name,
        customer_email: (o.profiles as any)?.email,
        customer_phone: (o.profiles as any)?.phone,
        customer_address: `${(o.profiles as any)?.address_street}, ${(o.profiles as any)?.address_number} - ${(o.profiles as any)?.address_neighborhood}, ${(o.profiles as any)?.address_city}/${(o.profiles as any)?.address_state} (${(o.profiles as any)?.cep})`
      })));
    }
    if (users.data) setPendingUsers(users.data);
    setLoading(false);
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchData();
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('Excluir este produto?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchData();
    }
  };

  const approveUser = async (id: string) => {
    await supabase.from('profiles').update({ is_approved: true }).eq('id', id);
    fetchData();
  };

  if (loading) return <div className="p-20 text-center font-serif text-xl animate-pulse">Carregando painel...</div>;

  const totalSales = orders.filter(o => o.status === 'paid' || o.status === 'shipped').reduce((acc, o) => acc + o.total_amount, 0);

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900">Gestão Cheia de Arte</h1>
          <p className="text-gray-500 mt-2">Olá, {currentUser?.email}. Seu painel de controle está pronto.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-full text-green-500"><TrendingUp className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Faturamento Pago</p>
              <p className="text-xl font-bold text-gray-900">{totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => navigate('/admin/login'))} className="p-4 text-red-400 hover:bg-red-50 rounded-2xl transition-all">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-2xl mb-8 max-w-md">
        <button onClick={() => setActiveTab('orders')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Vendas</button>
        <button onClick={() => setActiveTab('products')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'products' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Produtos</button>
        <button onClick={() => setActiveTab('users')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'users' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Admin</button>
      </div>

      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <ShoppingCart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-serif">Nenhuma venda registrada ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                  <div className={`w-2 md:w-3 flex-shrink-0 ${order.status === 'paid' ? 'bg-green-400' : order.status === 'pending' ? 'bg-yellow-400' : 'bg-gray-200'}`} />
                  <div className="p-6 flex-grow grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold text-gray-400">Pedido #{order.id.slice(0,8)}</p>
                      <h4 className="font-bold text-gray-900">{order.customer_name}</h4>
                      <p className="text-xs text-gray-500">{order.customer_email}</p>
                      <p className="text-xs text-gray-500">{order.customer_phone}</p>
                      <div className="pt-2 flex items-center gap-2">
                        {order.status === 'paid' ? <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> PAGO</span> :
                         order.status === 'pending' ? <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full"><Clock className="w-3 h-3" /> PENDENTE</span> :
                         <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full uppercase">{order.status}</span>}
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <p className="text-[10px] uppercase font-bold text-gray-400">Itens do Pedido</p>
                      <div className="space-y-1">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="text-sm text-gray-700 flex justify-between border-b border-gray-50 pb-1">
                            <span>{item.quantity}x {item.name} {item.model ? `(${item.model})` : ''}</span>
                            <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2">
                        <p className="text-[10px] uppercase font-bold text-gray-400">Endereço de Entrega</p>
                        <p className="text-xs text-gray-600 italic mt-1">{order.customer_address}</p>
                        <p className="text-xs font-bold text-[#f4d3d2] mt-1">{order.shipping_method}</p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-gray-400">Total</p>
                        <p className="text-2xl font-bold text-gray-900">{order.total_amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        {order.status === 'pending' && (
                          <button onClick={() => updateOrderStatus(order.id, 'paid')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Marcar como Pago"><CheckCircle2 className="w-5 h-5" /></button>
                        )}
                        {order.status === 'paid' && (
                          <button onClick={() => updateOrderStatus(order.id, 'shipped')} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Marcar como Enviado"><Package className="w-5 h-5" /></button>
                        )}
                        <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Cancelar"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold">Catálogo de Produtos</h2>
            <Link to="/admin/produtos/novo" className="bg-[#f4d3d2] text-white px-6 py-3 rounded-2xl flex items-center font-bold shadow-lg shadow-[#f4d3d2]/20 hover:scale-105 transition-all">
              <Plus className="w-5 h-5 mr-2" /> Novo Produto
            </Link>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">Produto</th>
                  <th className="px-8 py-5">Departamento</th>
                  <th className="px-8 py-5">Preço Base</th>
                  <th className="px-8 py-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5 flex items-center">
                      <img src={formatDriveUrl(product.image_url)} className="w-12 h-12 rounded-xl object-cover mr-4 border border-gray-100 shadow-sm" />
                      <span className="font-bold text-gray-800">{product.name}</span>
                    </td>
                    <td className="px-8 py-5 text-gray-500 font-medium">{product.department_id}</td>
                    <td className="px-8 py-5 font-bold text-gray-900">R$ {product.price.toFixed(2)}</td>
                    <td className="px-8 py-5 text-right space-x-2">
                      <Link to={`/admin/produtos/editar/${product.id}`} className="inline-block p-2 text-blue-400 hover:bg-blue-50 rounded-lg"><Edit className="w-5 h-5" /></Link>
                      <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="animate-in fade-in duration-500 max-w-2xl">
          <h2 className="text-2xl font-serif font-bold mb-6">Acessos Administrativos</h2>
          {pendingUsers.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
              <Users className="w-12 h-12 text-gray-100 mx-auto mb-4" />
              <p className="text-gray-400">Nenhum pedido de acesso administrativo pendente.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map(user => (
                <div key={user.id} className="flex justify-between items-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div>
                    <p className="font-bold text-gray-900">{user.email}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Aguardando Aprovação</p>
                  </div>
                  <button onClick={() => approveUser(user.id)} className="p-3 bg-green-50 text-green-500 rounded-2xl hover:bg-green-100 transition-all"><CheckCircle className="w-6 h-6" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
