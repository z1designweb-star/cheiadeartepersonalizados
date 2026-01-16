
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Clock, AlertCircle, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { supabase } from '../lib/supabase.ts';

const CheckoutResult: React.FC = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const [status, setStatus] = useState<'success' | 'pending' | 'error' | 'loading'>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const updateOrderStatus = async () => {
      const params = new URLSearchParams(location.search);
      const mpStatus = params.get('status');
      const ref = params.get('external_reference');
      setOrderId(ref);

      console.log("Status recebido do MP:", mpStatus, "Referência:", ref);

      if (mpStatus === 'approved' && ref) {
        // Sucesso imediato
        const { error } = await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', ref);

        if (error) console.error("Erro ao atualizar status:", error);
        setStatus('success');
        clearCart();
      } else if ((['pending', 'in_process', 'authorized'].includes(mpStatus || '')) && ref) {
        // Status intermediário (comum em boletos ou revisão de cartão)
        setStatus('pending');
        clearCart();
      } else if (mpStatus === 'rejected') {
        // Rejeitado pelo banco/segurança
        setStatus('error');
      } else {
        // Se não houver parâmetros, mas estiver na rota de sucesso
        if (window.location.hash.includes('/sucesso')) {
          setStatus('success');
          clearCart();
        } else {
          setStatus('error');
        }
      }
    };

    updateOrderStatus();
  }, [location, clearCart]);

  const content = {
    success: {
      icon: <CheckCircle2 className="w-20 h-20 text-green-500" />,
      title: "Quase tudo pronto!",
      message: "Seu pagamento foi confirmado ou está em fase final de aprovação. Verifique seu e-mail em instantes.",
      color: "text-green-600"
    },
    pending: {
      icon: <Clock className="w-20 h-20 text-yellow-500" />,
      title: "Pagamento em Análise",
      message: "O Mercado Pago está processando sua transação (isso é comum em cartões de crédito). Assim que for aprovado, seu pedido será atualizado automaticamente.",
      color: "text-yellow-600"
    },
    error: {
      icon: <AlertCircle className="w-20 h-20 text-red-500" />,
      title: "Pagamento não Concluído",
      message: "O Mercado Pago não conseguiu processar seu cartão (possivelmente por segurança). Tente novamente com outro cartão ou via Pix.",
      color: "text-red-600"
    },
    loading: {
      icon: <Loader2 className="w-20 h-20 text-[#f4d3d2] animate-spin" />,
      title: "Validando Compra",
      message: "Estamos conferindo os dados com o Mercado Pago...",
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
          {orderId && <p className="text-[10px] text-gray-400 uppercase tracking-widest">Pedido: {orderId}</p>}
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
