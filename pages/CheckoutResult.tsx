
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Clock, AlertCircle, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { supabase } from '../lib/supabase.ts';

const CheckoutResult: React.FC = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const [status, setStatus] = useState<'success' | 'pending' | 'error' | 'loading'>('loading');

  useEffect(() => {
    const updateOrderStatus = async () => {
      const params = new URLSearchParams(location.search);
      const mpStatus = params.get('status');
      const orderId = params.get('external_reference');

      if (mpStatus === 'approved' && orderId) {
        // Atualiza no banco que o pedido foi pago
        const { error } = await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', orderId);

        if (error) console.error("Erro ao atualizar status do pedido:", error);
        setStatus('success');
        clearCart();
      } else if ((mpStatus === 'pending' || mpStatus === 'in_process') && orderId) {
        setStatus('pending');
        clearCart();
      } else if (mpStatus === 'rejected') {
        setStatus('error');
      } else {
        // Fallback para acessos diretos
        setStatus(location.pathname.includes('sucesso') ? 'success' : 'error');
      }
    };

    updateOrderStatus();
  }, [location, clearCart]);

  const content = {
    success: {
      icon: <CheckCircle2 className="w-20 h-20 text-green-500" />,
      title: "Pagamento Aprovado!",
      message: "Seu pedido foi confirmado. Já estamos preparando seus aromas com todo carinho.",
      color: "text-green-600"
    },
    pending: {
      icon: <Clock className="w-20 h-20 text-yellow-500" />,
      title: "Pagamento em Processamento",
      message: "Seu pagamento está sendo analisado. Assim que for confirmado, você verá a atualização no seu perfil.",
      color: "text-yellow-600"
    },
    error: {
      icon: <AlertCircle className="w-20 h-20 text-red-500" />,
      title: "Ops! Houve um problema",
      message: "O pagamento não foi processado. Tente novamente ou entre em contato conosco.",
      color: "text-red-600"
    },
    loading: {
      icon: <Loader2 className="w-20 h-20 text-[#f4d3d2] animate-spin" />,
      title: "Confirmando...",
      message: "Aguarde um instante enquanto validamos sua compra.",
      color: "text-gray-400"
    }
  };

  const current = content[status];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">{current.icon}</div>
        <div className="space-y-4">
          <h1 className={`text-3xl font-serif font-bold ${current.color}`}>{current.title}</h1>
          <p className="text-gray-600">{current.message}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-4">
          <Link to="/perfil" className="w-full py-4 bg-[#f4d3d2] text-white rounded-xl font-bold flex items-center justify-center gap-2">
            Ver Meus Pedidos
          </Link>
          <Link to="/" className="w-full py-4 border-2 border-gray-50 text-gray-500 rounded-xl font-bold flex items-center justify-center gap-2">
            Voltar para a Loja <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutResult;
