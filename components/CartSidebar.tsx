
import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, Loader2, CreditCard, ShieldCheck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import { createCheckoutPreference } from '../lib/mercadopago.ts';
import { formatDriveUrl } from '../lib/utils.ts';
import { supabase } from '../lib/supabase.ts';
import ShippingCalculator from './ShippingCalculator.tsx';

const CartSidebar: React.FC = () => {
  const { cart, removeFromCart, cartTotal, isCartOpen, setIsCartOpen, cartCount, selectedShipping } = useCart();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
  }, []);

  const finalTotal = cartTotal + (selectedShipping?.price || 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!user) {
      setIsCartOpen(false);
      navigate('/login?redirect=cart');
      return;
    }
    
    setIsCheckoutLoading(true);
    try {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

      if (!profile?.full_name || !profile?.cpf) {
        alert("Por favor, complete seu cadastro no perfil antes de comprar.");
        navigate('/perfil');
        setIsCartOpen(false);
        return;
      }

      // 1. Criar pedido no Supabase primeiro
      const { data: order, error: orderError } = await supabase.from('orders').insert([{
        customer_id: user.id,
        status: 'pending',
        total_amount: finalTotal,
        shipping_cost: selectedShipping?.price || 0,
        shipping_method: selectedShipping ? `${selectedShipping.company.name} - ${selectedShipping.name}` : 'A combinar',
        items: cart.map(i => ({
          id: i.id,
          name: i.name,
          model: i.selectedModel,
          aroma: i.selectedAroma,
          price: i.displayPrice,
          quantity: i.quantity
        }))
      }]).select().single();

      if (orderError) throw orderError;

      // 2. Criar preferência no Mercado Pago enviando o ID do pedido
      const items = cart.map(item => ({
        id: item.id,
        title: `${item.name}${item.selectedModel ? ` - ${item.selectedModel}` : ''}`,
        unit_price: item.displayPrice,
        quantity: item.quantity,
        picture_url: formatDriveUrl(item.image_url)
      }));

      if (selectedShipping) {
        items.push({
          id: 'frete',
          title: `Frete: ${selectedShipping.name}`,
          unit_price: selectedShipping.price,
          quantity: 1
        });
      }

      const checkoutUrl = await createCheckoutPreference(items, order.id);
      window.location.href = checkoutUrl;
    } catch (error: any) {
      alert("Erro ao processar: " + error.message);
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
              <div className="h-full flex flex-col items-center justify-center text-center">
                <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
                <p className="text-gray-500 font-serif">Sua sacola está vazia.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedModel}-${item.selectedAroma}`} className="flex gap-4 items-center border-b border-gray-50 pb-4">
                      <img src={formatDriveUrl(item.image_url)} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-grow">
                        <h3 className="text-sm font-bold">{item.name}</h3>
                        <p className="text-[10px] text-gray-400 uppercase">{item.selectedModel} | {item.selectedAroma}</p>
                        <p className="text-sm font-bold mt-1">{item.displayPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                      </div>
                      <button onClick={() => removeFromCart(`${item.id}-${item.selectedModel || 'none'}-${item.selectedAroma || 'none'}`)} className="text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
                <ShippingCalculator />
              </>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-900">Total com Frete</span>
                <span className="text-2xl font-bold text-gray-900">{finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <button
                disabled={isCheckoutLoading || !selectedShipping}
                onClick={handleCheckout}
                className="w-full py-4 bg-[#f4d3d2] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:bg-[#e6c1c0] disabled:opacity-50"
              >
                {isCheckoutLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Finalizar Pedido</>}
              </button>
              <div className="flex justify-center items-center gap-2 mt-4 opacity-40">
                <ShieldCheck className="w-3 h-3" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Pagamento Seguro Mercado Pago</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
