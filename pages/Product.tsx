
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DEPARTMENTS } from '../constants.tsx';
import { Product as ProductType } from '../types.ts';
import { supabase } from '../lib/supabase.ts';
import { formatDriveUrl } from '../lib/utils.ts';
import { useCart } from '../context/CartContext.tsx';
import { ChevronRight, Home, ShieldCheck, Truck, RefreshCcw, Loader2, ShoppingCart } from 'lucide-react';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | undefined>();
  const [loading, setLoading] = useState(true);
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
        if (data) setProduct(data);
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
      } finally {
        setLoading(false);
      }
      window.scrollTo(0, 0);
    };

    fetchProduct();
  }, [id]);

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

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-12">
        <Link to="/" className="hover:text-[#f4d3d2] transition-colors"><Home className="w-4 h-4" /></Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/departamento/${department?.id}`} className="hover:text-[#f4d3d2] transition-colors">{department?.name}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="rounded-xl overflow-hidden bg-gray-50 aspect-square shadow-inner flex items-center justify-center border border-gray-100">
          <img 
            src={formatDriveUrl(product.image_url)} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/800x800?text=Erro+ao+carregar+imagem';
            }}
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-gray-800 mb-8">
            {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          
          <div className="border-t border-b border-gray-100 py-6 mb-8">
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <button 
              onClick={() => product && addToCart(product)}
              className="w-full py-4 bg-[#f4d3d2] text-white rounded-lg font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#e6c1c0] transition-colors shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              Adicionar ao Carrinho
            </button>
            <a 
              href={`https://wa.me/5571982331700?text=Olá! Tenho interesse no produto: ${product.name}`}
              target="_blank"
              className="w-full py-4 border-2 border-[#f4d3d2] text-[#f4d3d2] rounded-lg font-bold text-lg hover:bg-[#f4d3d2] hover:text-white transition-all text-center block"
            >
              Dúvidas via WhatsApp
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
            <div className="flex flex-col items-center text-center">
              <Truck className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-xs font-semibold text-gray-500 uppercase">Envio para todo BR</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-xs font-semibold text-gray-500 uppercase">Mercado Pago</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <RefreshCcw className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-xs font-semibold text-gray-500 uppercase">Troca Garantida</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
