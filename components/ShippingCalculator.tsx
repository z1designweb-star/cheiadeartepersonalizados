
import React, { useState, useEffect } from 'react';
import { Truck, Search, Loader2, Check } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { calculateShipping } from '../lib/melhorenvio.ts';
import { ShippingOption } from '../types.ts';

const ShippingCalculator: React.FC = () => {
  const { cart, cartTotal, destinationCep, setDestinationCep, selectedShipping, setSelectedShipping } = useCart();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [error, setError] = useState('');

  const logoUrl = "https://cdn-icons-png.flaticon.com/512/869/869636.png"; // Ícone de loja/entrega própria

  const handleCalculate = async () => {
    const cleanCep = destinationCep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setError('CEP inválido');
      return;
    }

    setError('');
    setLoading(true);
    
    // 1. Buscar opções do Melhor Envio
    const results = await calculateShipping({
      to_cep: destinationCep,
      products: cart.map(item => ({
        id: item.id,
        width: item.width_cm,
        height: item.height_cm,
        length: item.length_cm,
        weight: item.weight_grams,
        insurance_value: item.displayPrice,
        quantity: item.quantity
      }))
    });

    // 2. Formatar resultados da API
    const apiOptions: ShippingOption[] = results.map((opt: any) => ({
      id: opt.id,
      name: opt.name,
      price: parseFloat(opt.price),
      delivery_time: opt.delivery_time,
      company: {
        name: opt.company.name,
        picture: opt.company.picture
      }
    }));

    // 3. Gerar Opções Manuais/Fixas
    const customOptions: ShippingOption[] = [];

    // Opção: Retirada Local (Sempre disponível)
    customOptions.push({
      id: 'retirada-local',
      name: 'Retirada Local',
      price: 0,
      delivery_time: 1,
      company: {
        name: 'Loja Física',
        picture: logoUrl
      }
    });

    // Opção: Entrega Local Salvador (CEPs que começam com 40 ou 41)
    if (cleanCep.startsWith('40') || cleanCep.startsWith('41')) {
      customOptions.push({
        id: 'entrega-salvador',
        name: 'Entrega Local (Salvador/BA)',
        price: 15,
        delivery_time: 2,
        company: {
          name: 'Cheia de Arte',
          picture: logoUrl
        }
      });
    }

    // Opção: Frete Grátis (Para compras > R$ 250)
    if (cartTotal >= 250) {
      customOptions.push({
        id: 'frete-gratis',
        name: 'Frete Grátis (Promoção)',
        price: 0,
        delivery_time: 5,
        company: {
          name: 'Cheia de Arte',
          picture: logoUrl
        }
      });
    }

    // Unificar e ordenar por preço
    const allOptions = [...customOptions, ...apiOptions].sort((a, b) => a.price - b.price);
    
    setOptions(allOptions);
    setLoading(false);
  };

  useEffect(() => {
    if (destinationCep.replace(/\D/g, '').length === 8 && cart.length > 0 && options.length === 0) {
      handleCalculate();
    }
  }, []);

  return (
    <div className="space-y-4 py-4 border-t border-b border-gray-100 my-4">
      <div className="flex items-center gap-2 mb-2">
        <Truck className="w-4 h-4 text-[#f4d3d2]" />
        <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Calcular Frete</span>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="00000-000"
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#f4d3d2] outline-none"
            value={destinationCep}
            onChange={(e) => setDestinationCep(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
          />
        </div>
        <button
          onClick={handleCalculate}
          disabled={loading || cart.length === 0}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
      </div>

      {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}

      {options.length > 0 && (
        <div className="space-y-2 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedShipping(option)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                selectedShipping?.id === option.id 
                ? 'border-[#f4d3d2] bg-[#f4d3d2]/5 shadow-sm' 
                : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded bg-white border border-gray-50 p-1 flex items-center justify-center shrink-0">
                  <img src={option.company.picture} alt={option.company.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 leading-tight">
                    {option.company.name === 'Loja Física' || option.company.name === 'Cheia de Arte' 
                      ? option.name 
                      : `${option.company.name} ${option.name}`}
                  </p>
                  <p className="text-[10px] text-gray-500">Prazo: {option.delivery_time} {option.delivery_time === 1 ? 'dia útil' : 'dias úteis'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold ${option.price === 0 ? 'text-green-500' : 'text-gray-900'}`}>
                  {option.price === 0 ? 'Grátis' : option.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  selectedShipping?.id === option.id ? 'bg-[#f4d3d2] border-[#f4d3d2]' : 'border-gray-200'
                }`}>
                  {selectedShipping?.id === option.id && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;
