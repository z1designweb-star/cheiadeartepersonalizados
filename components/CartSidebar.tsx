
import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Loader2, CreditCard, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { createCheckoutPreference } from '../lib/mercadopago.ts';
import { formatDriveUrl } from '../lib/utils.ts';
import ShippingCalculator from './ShippingCalculator.tsx';

const CartSidebar: React.FC = () => {
  const { cart, removeFromCart, cartTotal, isCartOpen, setIsCartOpen, cartCount, selectedShipping } = useCart();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const finalTotal = cartTotal + (selectedShipping?.price || 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsCheckoutLoading(true);
    try {
      const items = cart.map(item => ({
        id: item.id,
        title: `${item.name}${item.selectedModel ? ` - ${item.selectedModel}` : ''}${item.selectedAroma ? ` (${item.selectedAroma})` : ''}`,
        unit_price: item.displayPrice,
        quantity: item.quantity,
        picture_url: formatDriveUrl(item.image_url)
      }));

      // Adicionar frete como um item se selecionado
      if (selectedShipping) {
        items.push({
          id: 'shipping-fee',
          title: `Frete: ${selectedShipping.company.name} (${selectedShipping.name})`,
          unit_price: selectedShipping.price,
          quantity: 1,
          picture_url: 'https://cdn-icons-png.flaticon.com/512/709/709790.png'
        });
      }

      const checkoutUrl = await createCheckoutPreference(items);
      window.location.href = checkoutUrl;
    } catch (error) {
      alert("Houve um erro ao processar o checkout. Tente novamente.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-serif font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#f4d3d2]" />
              Sua Sacola ({cartCount})
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <ShoppingBag className="w-16 h-16 text-gray-200" />
                <p className="text-gray-500 font-serif text-lg">Sua sacola está vazia.</p>
                <button onClick={() => setIsCartOpen(false)} className="text-[#f4d3d2] font-bold hover:underline">
                  Continuar comprando
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {cart.map((item) => {
                    const uniqueId = `${item.id}-${item.selectedModel || 'none'}-${item.selectedAroma || 'none'}`;
                    return (
                      <div key={uniqueId} className="flex gap-4 items-center animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                          <img src={formatDriveUrl(item.image_url)} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h3>
                          {(item.selectedModel || item.selectedAroma) && (
                            <p className="text-[10px] text-gray-400 uppercase font-semibold mt-1">
                              {item.selectedModel}{item.selectedModel && item.selectedAroma ? ' • ' : ''}{item.selectedAroma}
                            </p>
                          )}
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-gray-500 font-medium">{item.quantity}x {item.displayPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                            <p className="text-sm font-bold text-gray-900">{(item.displayPrice * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(uniqueId)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <ShippingCalculator />
              </>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t bg-gray-50 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                {selectedShipping && (
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Frete ({selectedShipping.company.name})</span>
                    <span>{selectedShipping.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
              
              <button
                disabled={isCheckoutLoading || !selectedShipping}
                onClick={handleCheckout}
                className="w-full py-4 bg-[#f4d3d2] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:bg-[#e6c1c0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckoutLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    {!selectedShipping ? 'Selecione o Frete' : 'Pagar com Mercado Pago'}
                  </>
                )}
              </button>
              <div className="flex justify-center items-center gap-2 mt-4 opacity-40">
                <ShieldCheck className="w-3 h-3" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Ambiente 100% Seguro</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
