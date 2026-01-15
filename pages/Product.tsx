
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DEPARTMENTS } from '../constants.tsx';
import { Product as ProductType, Variation } from '../types.ts';
import { supabase } from '../lib/supabase.ts';
import { formatDriveUrl } from '../lib/utils.ts';
import { useCart } from '../context/CartContext.tsx';
import { ChevronRight, Home, ShieldCheck, Truck, RefreshCcw, Loader2, ShoppingCart, Minus, Plus } from 'lucide-react';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | undefined>();
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedAroma, setSelectedAroma] = useState<string>('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        if (data) {
          setProduct(data);
          // Pré-selecionar primeiras opções se existirem
          if (data.models?.length > 0) setSelectedModel(data.models[0]);
          if (data.aromas?.length > 0) setSelectedAroma(data.aromas[0]);
        }
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
      } finally {
        setLoading(false);
      }
      window.scrollTo(0, 0);
    };

    fetchProduct();
  }, [id]);

  // Encontrar a variação correspondente para determinar o preço
  const currentVariation = product?.variations?.find(v => 
    v.model === selectedModel && v.aroma === selectedAroma
  );

  const displayPrice = currentVariation ? currentVariation.price : (product?.price || 0);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#f4d3d2]" />
        <p className="text-gray-400 font-serif">Buscando detalhes...</p>
      </div>
    </div>
  );

  if (!product) return <div className="p-20 text-center font-serif text-2xl text-red-500">Produto não encontrado.</div>;

  const department = DEPARTMENTS.find(d => d.id === product.department_id);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, currentVariation);
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-[#f4d3d2] transition-colors"><Home className="w-4 h-4" /></Link>
        <ChevronRight className="w-4 h-4 shrink-0" />
        <Link to={`/departamento/${department?.id}`} className="hover:text-[#f4d3d2] transition-colors">{department?.name}</Link>
        <ChevronRight className="w-4 h-4 shrink-0" />
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Imagem */}
        <div className="rounded-2xl overflow-hidden bg-white aspect-square shadow-sm flex items-center justify-center border border-gray-100">
          <img 
            src={formatDriveUrl(product.image_url)} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/800x800?text=Erro+ao+carregar+imagem';
            }}
          />
        </div>

        {/* Detalhes */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-baseline gap-4 mb-8">
            <p className="text-3xl font-bold text-gray-900">
              {displayPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            {currentVariation && product.price !== currentVariation.price && (
              <span className="text-sm text-[#f4d3d2] font-semibold bg-[#f4d3d2]/10 px-2 py-1 rounded">
                Preço varia por modelo/aroma
              </span>
            )}
          </div>

          {/* Opções de Modelo */}
          {product.models && product.models.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Modelo</label>
              <div className="flex flex-wrap gap-2">
                {product.models.map(model => (
                  <button
                    key={model}
                    onClick={() => setSelectedModel(model)}
                    className={`px-4 py-2 rounded-full border text-sm transition-all ${
                      selectedModel === model 
                      ? 'bg-[#f4d3d2] border-[#f4d3d2] text-white shadow-md' 
                      : 'border-gray-200 text-gray-600 hover:border-[#f4d3d2]'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Opções de Aroma */}
          {product.aromas && product.aromas.length > 0 && (
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Aroma</label>
              <div className="flex flex-wrap gap-2">
                {product.aromas.map(aroma => (
                  <button
                    key={aroma}
                    onClick={() => setSelectedAroma(aroma)}
                    className={`px-4 py-2 rounded-full border text-sm transition-all ${
                      selectedAroma === aroma 
                      ? 'bg-[#f4d3d2] border-[#f4d3d2] text-white shadow-md' 
                      : 'border-gray-200 text-gray-600 hover:border-[#f4d3d2]'
                    }`}
                  >
                    {aroma}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantidade */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Quantidade</label>
            <div className="flex items-center w-32 border border-gray-200 rounded-lg overflow-hidden">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex-1 py-3 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="flex-1 text-center font-bold text-gray-900">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="flex-1 py-3 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          
          <div className="space-y-4 mb-12">
            <button 
              onClick={handleAddToCart}
              className="w-full py-5 bg-[#f4d3d2] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#e6c1c0] transition-all shadow-lg active:scale-95"
            >
              <ShoppingCart className="w-6 h-6" />
              Adicionar à Sacola
            </button>
            <a 
              href={`https://wa.me/5571982331700?text=Olá! Gostaria de mais informações sobre: ${product.name}${selectedModel ? ` (Modelo: ${selectedModel})` : ''}${selectedAroma ? ` (Aroma: ${selectedAroma})` : ''}`}
              target="_blank"
              className="w-full py-4 border-2 border-gray-100 text-gray-600 rounded-xl font-bold text-lg hover:border-[#f4d3d2] hover:text-[#f4d3d2] transition-all text-center block"
            >
              Conversar via WhatsApp
            </a>
          </div>

          <div className="border-t border-gray-100 pt-8 mb-8">
            <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Detalhes do Produto</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Truck className="w-5 h-5 text-[#f4d3d2]" />
              <span className="text-[10px] font-bold text-gray-500 uppercase leading-tight">Envio para<br/>todo Brasil</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-[#f4d3d2]" />
              <span className="text-[10px] font-bold text-gray-500 uppercase leading-tight">Pagamento<br/>Seguro</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <RefreshCcw className="w-5 h-5 text-[#f4d3d2]" />
              <span className="text-[10px] font-bold text-gray-500 uppercase leading-tight">Feito à mão<br/>com carinho</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
