
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase.ts';
import { DEPARTMENTS } from '../../constants.tsx';
import { Variation, Product } from '../../types.ts';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    department_id: DEPARTMENTS[0].id,
    models: [],
    aromas: [],
    weight_grams: 0,
    height_cm: 0,
    width_cm: 0,
    length_cm: 0,
    variations: []
  });

  const [newModel, setNewModel] = useState('');
  const [newAroma, setNewAroma] = useState('');
  const [newVar, setNewVar] = useState<Variation>({ model: '', aroma: '', price: 0 });

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (data) setFormData(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        const { error } = await supabase.from('products').update(formData).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([formData]);
        if (error) throw error;
      }
      navigate('/admin/dashboard');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addVariation = () => {
    if (newVar.model && newVar.price > 0) {
      setFormData({ ...formData, variations: [...(formData.variations || []), newVar] });
      setNewVar({ model: '', aroma: '', price: 0 });
    }
  };

  const removeVariation = (index: number) => {
    const updated = [...(formData.variations || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, variations: updated });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate('/admin/dashboard')} className="flex items-center text-gray-500 hover:text-[#f4d3d2] mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h1 className="text-3xl font-serif font-bold mb-8">
          {id ? 'Editar Produto' : 'Cadastrar Novo Produto'}
        </h1>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Informações Básicas */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Produto</label>
              <input
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f4d3d2] outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f4d3d2] outline-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preço de Venda</label>
                <input
                  type="number" step="0.01"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f4d3d2] outline-none"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Departamento</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f4d3d2] outline-none"
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                >
                  {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Link da Imagem (Google Drive)</label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f4d3d2] outline-none"
                placeholder="Cole o link direto da imagem"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>
          </div>

          {/* Modelos, Aromas e Medidas */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Modelos (Separados por vírgula)</label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f4d3d2] outline-none"
                  placeholder="vidro, plástico..."
                  value={formData.models?.join(', ')}
                  onChange={(e) => setFormData({ ...formData, models: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Aromas (Separados por vírgula)</label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#f4d3d2] outline-none"
                  placeholder="lavanda, bamboo..."
                  value={formData.aromas?.join(', ')}
                  onChange={(e) => setFormData({ ...formData, aromas: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Peso (g)</label>
                <input type="number" className="w-full p-2 border rounded" value={formData.weight_grams} onChange={e => setFormData({...formData, weight_grams: parseInt(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Alt (cm)</label>
                <input type="number" step="0.1" className="w-full p-2 border rounded" value={formData.height_cm} onChange={e => setFormData({...formData, height_cm: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Larg (cm)</label>
                <input type="number" step="0.1" className="w-full p-2 border rounded" value={formData.width_cm} onChange={e => setFormData({...formData, width_cm: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Comp (cm)</label>
                <input type="number" step="0.1" className="w-full p-2 border rounded" value={formData.length_cm} onChange={e => setFormData({...formData, length_cm: parseFloat(e.target.value)})} />
              </div>
            </div>

            {/* Variações */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="font-semibold mb-4 text-gray-700">Variações de Preço</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <input placeholder="Modelo" className="p-2 border rounded" value={newVar.model} onChange={e => setNewVar({...newVar, model: e.target.value})} />
                <input placeholder="Aroma" className="p-2 border rounded" value={newVar.aroma} onChange={e => setNewVar({...newVar, aroma: e.target.value})} />
                <div className="flex gap-2">
                  <input type="number" placeholder="Preço" className="w-full p-2 border rounded" value={newVar.price} onChange={e => setNewVar({...newVar, price: parseFloat(e.target.value)})} />
                  <button type="button" onClick={addVariation} className="p-2 bg-[#f4d3d2] text-white rounded"><Plus /></button>
                </div>
              </div>
              <div className="space-y-2">
                {formData.variations?.map((v, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                    <span className="text-sm">{v.model} | {v.aroma} | R$ {v.price.toFixed(2)}</span>
                    <button type="button" onClick={() => removeVariation(i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-full pt-8 flex justify-end">
            <button
              disabled={loading}
              className="px-12 py-4 bg-[#f4d3d2] text-white rounded-xl font-bold text-lg flex items-center shadow-lg hover:shadow-xl transition-all"
            >
              <Save className="mr-2" /> {loading ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
