
import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Loader2, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { createCheckoutPreference } from '../lib/mercadopago.ts';
import { formatDriveUrl } from '../lib/utils.ts';

const CartSidebar: React.FC = () => {
  const { cart, removeFromCart, cartTotal, isCartOpen, setIsCartOpen, cartCount } = useCart();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsCheckoutLoading(true);
    try {
      const checkoutUrl = await createCheckoutPreference(
        cart.map(item => ({
          id: item.id,
          title: item.name,
          unit_price: item.price,
          quantity: item.quantity,
          picture_url: formatDriveUrl(item.image_url)
        }))
      );
      
      // Redireciona para o Mercado Pago
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
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={formatDriveUrl(item.image_url)} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.quantity}x {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="text-2xl font-bold text-gray-900">
                  {cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              
              <button
                disabled={isCheckoutLoading}
                onClick={handleCheckout}
                className="w-full py-4 bg-[#f4d3d2] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:bg-[#e6c1c0] transition-all disabled:opacity-50"
              >
                {isCheckoutLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Finalizar Compra
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
                Pagamento processado via Mercado Pago
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
