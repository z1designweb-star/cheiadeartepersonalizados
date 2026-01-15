
import React, { useState, useEffect } from 'react';
import { Truck, Search, Loader2, Check } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { calculateShipping } from '../lib/melhorenvio.ts';
import { ShippingOption } from '../types.ts';

const ShippingCalculator: React.FC = () => {
  const { cart, destinationCep, setDestinationCep, selectedShipping, setSelectedShipping } = useCart();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    if (destinationCep.replace(/\D/g, '').length !== 8) {
      setError('CEP inválido');
      return;
    }

    setError('');
    setLoading(true);
    
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

    if (results.length === 0) {
      setError('Não foi possível calcular o frete para este CEP.');
    } else {
      // Formatar resultados para o nosso tipo ShippingOption
      const formattedOptions: ShippingOption[] = results.map((opt: any) => ({
        id: opt.id,
        name: opt.name,
        price: parseFloat(opt.price),
        delivery_time: opt.delivery_time,
        company: {
          name: opt.company.name,
          picture: opt.company.picture
        }
      }));
      setOptions(formattedOptions);
    }
    setLoading(false);
  };

  // Auto-calcular se já houver CEP salvo ao abrir o carrinho
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
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white border border-gray-50 p-1 flex items-center justify-center">
                  <img src={option.company.picture} alt={option.company.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-800">{option.company.name} {option.name}</p>
                  <p className="text-[10px] text-gray-500">Até {option.delivery_time} dias úteis</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-900">
                  {option.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
