
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.ts';
import { Product, Profile } from '../../types.ts';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Users, Package, LogOut, CheckCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pendingUsers, setPendingUsers] = useState<Profile[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin/login');
      return;
    }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!profile?.is_approved) {
      navigate('/admin/login');
      return;
    }
    setCurrentUser(profile);

    const [prods, users] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').eq('is_approved', false)
    ]);

    if (prods.data) setProducts(prods.data);
    if (users.data) setPendingUsers(users.data);
    setLoading(false);
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchData();
    }
  };

  const approveUser = async (id: string) => {
    await supabase.from('profiles').update({ is_approved: true }).eq('id', id);
    fetchData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) return <div className="p-20 text-center">Carregando...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-500 mt-2">Bem-vindo(a), {currentUser?.email}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center text-red-400 hover:text-red-600 font-medium">
          <LogOut className="w-5 h-5 mr-2" /> Sair
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gestão de Produtos */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold flex items-center">
              <Package className="mr-3 text-[#f4d3d2]" /> Produtos ({products.length})
            </h2>
            <Link to="/admin/produtos/novo" className="bg-[#f4d3d2] text-white px-4 py-2 rounded-lg flex items-center font-bold hover:bg-[#e6c1c0]">
              <Plus className="w-4 h-4 mr-2" /> Novo Produto
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Depto</th>
                  <th className="px-6 py-4">Preço</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center">
                      <img src={product.image_url} className="w-10 h-10 rounded object-cover mr-4" />
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{product.department_id}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">R$ {product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link to={`/admin/produtos/editar/${product.id}`} className="text-blue-400 hover:text-blue-600 inline-block">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => deleteProduct(product.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gestão de Usuários */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-serif font-bold mb-6 flex items-center">
              <Users className="mr-3 text-[#f4d3d2]" /> Pendentes
            </h2>
            {pendingUsers.length === 0 ? (
              <p className="text-gray-400 italic text-sm">Nenhum usuário aguardando aprovação.</p>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map(user => (
                  <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm truncate mr-2" title={user.email}>{user.email}</span>
                    <button 
                      onClick={() => approveUser(user.id)}
                      className="text-green-500 hover:text-green-700 p-1"
                    >
                      <CheckCircle className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
